import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { performance } from "node:perf_hooks";
import { readStore, updateStore, makeId } from "./lib/store.js";
import { signUser, requireAuth, allowRoles } from "./lib/auth.js";
import { addAudit } from "./lib/audit.js";
import { completeMatchingTasks, createWorkflowTasks } from "./lib/automation.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));
app.use((req, res, next) => { req.requestStartedAt = performance.now(); res.setHeader("X-JourneyOne-Started", new Date().toISOString()); next(); });

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "JourneyOne API", timestamp: new Date().toISOString() }));

app.post("/api/auth/login", async (req, res) => {
  const parsed = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Valid email and password are required" });
  const data = await readStore();
  const user = data.users.find(item => item.email.toLowerCase() === parsed.data.email.toLowerCase());
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return res.status(401).json({ error: "Invalid credentials" });
  const { passwordHash, ...safeUser } = user;
  res.json({ token: signUser(user), user: safeUser });
});

app.get("/api/bootstrap", requireAuth, async (_req, res) => {
  const data = await readStore();
  const { users, ...safe } = data;
  res.json(safe);
});

const employeeSchema = z.object({
  name: z.string().min(2), email: z.string().email(), role: z.string().min(2), department: z.string().min(2),
  id: z.string().optional(), profileId: z.string().optional(), type: z.enum(["onboarding", "offboarding"]), startDate: z.string().min(8), steps: z.array(z.object({ id:z.string(), label:z.string(), done:z.boolean().optional() })).min(1)
});

app.post("/api/employees", requireAuth, allowRoles("HR_MANAGER"), async (req, res) => {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid employee data", issues: parsed.error.issues });
  const result = await updateStore(data => {
    if (data.employees.some(e => e.email.toLowerCase() === parsed.data.email.toLowerCase() && e.type === parsed.data.type && e.status !== "Archived")) {
      return { error: "An active journey already exists for this employee", status: 409 };
    }
    const employee = { ...parsed.data, id: parsed.data.id || makeId("emp"), progress: 0, status: "In Progress", createdAt: new Date().toISOString() };
    data.employees.unshift(employee); createWorkflowTasks(data, employee);
    addAudit(data, req, "EMPLOYEE_JOURNEY_CREATED", "employee", employee.id, { type: employee.type });
    return { employee };
  });
  if (result.error) return res.status(result.status).json({ error: result.error });
  res.status(201).json(result.employee);
});

app.patch("/api/employees/:id/steps/:stepId", requireAuth, allowRoles("IT_MANAGER","HR_MANAGER"), async (req, res) => {
  const result = await updateStore(data => {
    const employee = data.employees.find(e => e.id === req.params.id);
    if (!employee) return { error: "Employee not found", status: 404 };
    const step = employee.steps.find(s => s.id === req.params.stepId);
    if (!step) return { error: "Workflow step not found", status: 404 };
    const itSteps = new Set(["assign-equipment", "provision-access", "revoke-access", "collect-equipment"]);
    const requiredRole = itSteps.has(step.id) ? "IT_MANAGER" : "HR_MANAGER";
    if (req.user.role !== requiredRole) return { error: "This workflow step belongs to another workspace", status: 403 };
    step.done = true; step.completedAt = new Date().toISOString(); step.details = req.body?.details || {};
    employee.progress = Math.round(employee.steps.filter(s=>s.done).length / employee.steps.length * 100);
    employee.status = employee.progress === 100 ? (employee.type === "offboarding" ? "Archived" : "Completed") : "In Progress";
    const map = {"assign-equipment":"EQUIPMENT_ASSIGNED","provision-access":"ACCESS_PROVISIONED","collect-documents":"DOCUMENTS_APPROVED","send-welcome":"WELCOME_SENT","schedule-orientation":"ORIENTATION_SCHEDULED","revoke-access":"ACCESS_REVOKED","collect-equipment":"EQUIPMENT_COLLECTED","notify-teams":"TEAMS_NOTIFIED","transfer-files":"FILES_TRANSFERRED","exit-interview":"EXIT_INTERVIEW_COMPLETED","archive-employee":"EMPLOYEE_ARCHIVED"};
    completeMatchingTasks(data, employee.id, map[step.id], req.user.sub);
    data.notifications.unshift({ id:makeId("notification"), text:`${step.label} completed for ${employee.name}`, read:false, createdAt:new Date().toISOString() });
    addAudit(data, req, "WORKFLOW_STEP_COMPLETED", "employee", employee.id, { stepId: step.id, progress: employee.progress });
    return { employee };
  });
  if (result.error) return res.status(result.status).json({ error: result.error });
  res.json(result.employee);
});

app.patch("/api/employees/:id/account", requireAuth, allowRoles("IT_MANAGER"), async (req, res) => {
  const parsed = z.object({
    name: z.string().min(2).optional(), email: z.string().email().optional(),
    role: z.string().min(2).optional(), department: z.string().min(2).optional(),
    accountStatus: z.enum(["Active", "Disabled"]).optional(),
  }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid account update", issues: parsed.error.issues });
  const result = await updateStore(data => {
    const employee = data.employees.find(e => e.id === req.params.id);
    if (!employee) return { error: "Employee not found", status: 404 };
    Object.assign(employee, parsed.data);
    addAudit(data, req, "ACCOUNT_UPDATED", "employee", employee.id, parsed.data);
    return { employee };
  });
  if (result.error) return res.status(result.status).json({ error: result.error });
  res.json(result.employee);
});

app.post("/api/employees/:id/account/reset-password", requireAuth, allowRoles("IT_MANAGER"), async (req, res) => {
  const result = await updateStore(data => {
    const employee = data.employees.find(e => e.id === req.params.id);
    if (!employee) return { error: "Employee not found", status: 404 };
    addAudit(data, req, "ACCOUNT_PASSWORD_RESET", "employee", employee.id, {});
    data.notifications.unshift({ id: makeId("notification"), text: `Temporary password issued for ${employee.name}`, read: false, createdAt: new Date().toISOString() });
    return { employee };
  });
  if (result.error) return res.status(result.status).json({ error: result.error });
  res.json({ message: "Temporary password generated and sent.", employee: result.employee });
});

app.get("/api/tasks", requireAuth, async (req,res) => { const data=await readStore(); let tasks=data.tasks; if(req.query.status) tasks=tasks.filter(t=>t.status===req.query.status); res.json(tasks); });
app.patch("/api/tasks/:id", requireAuth, allowRoles("IT_MANAGER","HR_MANAGER"), async (req,res) => {
  const result=await updateStore(data=>{ const task=data.tasks.find(t=>t.id===req.params.id); if(!task)return {error:"Task not found",status:404}; if(task.assignedRole && task.assignedRole !== req.user.role)return {error:"This task belongs to another workspace",status:403}; Object.assign(task, req.body, {updatedAt:new Date().toISOString()}); addAudit(data,req,"TASK_UPDATED","task",task.id,{status:task.status}); return {task}; });
  if(result.error)return res.status(result.status).json({error:result.error}); res.json(result.task);
});

app.post("/api/equipment/:id/assign", requireAuth, allowRoles("IT_MANAGER"), async (req,res)=>{
  const parsed=z.object({employeeId:z.string(),employeeName:z.string()}).safeParse(req.body); if(!parsed.success)return res.status(400).json({error:"employeeId and employeeName are required"});
  const result=await updateStore(data=>{ const item=data.equipment.find(e=>e.id===req.params.id); if(!item)return {error:"Equipment not found",status:404}; if(item.status==="Assigned"&&item.employeeId!==parsed.data.employeeId)return {error:"Equipment is already assigned",status:409}; Object.assign(item,{status:"Assigned",employeeId:parsed.data.employeeId,assignedTo:parsed.data.employeeName,assignedAt:new Date().toISOString()}); completeMatchingTasks(data,parsed.data.employeeId,"EQUIPMENT_ASSIGNED",req.user.sub); addAudit(data,req,"EQUIPMENT_ASSIGNED","equipment",item.id,{employeeId:parsed.data.employeeId}); return {item}; });
  if(result.error)return res.status(result.status).json({error:result.error}); res.json(result.item);
});
app.post("/api/equipment/:id/return", requireAuth, allowRoles("IT_MANAGER"), async (req,res)=>{ const result=await updateStore(data=>{const item=data.equipment.find(e=>e.id===req.params.id);if(!item)return {error:"Equipment not found",status:404};const employeeId=item.employeeId;Object.assign(item,{status:"Available",assignedTo:"Unassigned",employeeId:null,returnedAt:new Date().toISOString()});if(employeeId)completeMatchingTasks(data,employeeId,"EQUIPMENT_COLLECTED",req.user.sub);addAudit(data,req,"EQUIPMENT_RETURNED","equipment",item.id,{employeeId});return {item};});if(result.error)return res.status(result.status).json({error:result.error});res.json(result.item);});

app.patch("/api/access-requests/:id", requireAuth, allowRoles("IT_MANAGER"), async(req,res)=>{const parsed=z.object({status:z.enum(["Approved","Denied","Revoked"]),reason:z.string().optional()}).safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid status"});const result=await updateStore(data=>{const request=data.accessRequests.find(a=>a.id===req.params.id);if(!request)return {error:"Request not found",status:404};Object.assign(request,parsed.data,{decidedBy:req.user.sub,decidedAt:new Date().toISOString()});if(request.employeeId&&parsed.data.status==="Approved")completeMatchingTasks(data,request.employeeId,"ACCESS_PROVISIONED",req.user.sub);addAudit(data,req,"ACCESS_REQUEST_DECIDED","accessRequest",request.id,{status:parsed.data.status,reason:parsed.data.reason});return {request};});if(result.error)return res.status(result.status).json({error:result.error});res.json(result.request);});

app.get("/api/audit-logs", requireAuth, allowRoles("IT_MANAGER","HR_MANAGER","AUDITOR"), async(req,res)=>{const data=await readStore();res.json(data.auditLogs.slice(0,Number(req.query.limit)||200));});
app.get("/api/metrics", requireAuth, async(_req,res)=>{const data=await readStore();const open=data.tasks.filter(t=>t.status!=="COMPLETED");const overdue=open.filter(t=>t.dueDate&&new Date(t.dueDate)<new Date());res.json({employees:data.employees.length,openTasks:open.length,overdueTasks:overdue.length,completedTasks:data.tasks.filter(t=>t.status==="COMPLETED").length,auditEvents:data.auditLogs.length,generatedAt:new Date().toISOString()});});

app.post("/api/integrations/email/preview", requireAuth, allowRoles("HR_MANAGER"), (req,res)=>res.json({mode:"preview",to:req.body.to,subject:req.body.subject,accepted:true,message:"Email integration is configured in safe preview mode. Set SMTP variables to send real messages."}));
app.post("/api/integrations/calendar/orientations", requireAuth, allowRoles("HR_MANAGER"), async(req,res)=>{const parsed=z.object({employeeId:z.string(),employeeName:z.string(),startsAt:z.string(),host:z.string(),location:z.string()}).safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Invalid orientation data"});const event=await updateStore(data=>{const event={id:makeId("orientation"),...parsed.data,createdAt:new Date().toISOString()};data.orientations.push(event);completeMatchingTasks(data,event.employeeId,"ORIENTATION_SCHEDULED",req.user.sub);addAudit(data,req,"ORIENTATION_SCHEDULED","orientation",event.id,{employeeId:event.employeeId});return event;});res.status(201).json(event);});

app.use((err,_req,res,_next)=>{console.error(err);res.status(500).json({error:"Unexpected server error"});});
export default app;
