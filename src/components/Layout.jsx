import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Check, CheckCircle2, Download, FileText, UserPlus, X } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import TopNavbar from "./TopNavbar.jsx";
import { safeApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { AUDIT_DEMO_LOGS } from "../utils/auditDemoData.js";

const INITIAL_EMPLOYEES = [
  { id:"emp-1", name:"Emily Carter", role:"UX Designer", department:"Design", email:"emily.carter@journeyone.com", avatar:"https://i.pravatar.cc/100?img=47", type:"onboarding", startLabel:"Starts Jul 28", startDate:"2026-07-28", progress:60, nextStep:{label:"Assign Laptop",icon:"laptop",due:"Today"}, steps:[{id:"s1",label:"Send offer & welcome email",done:true},{id:"s2",label:"Collect signed documents",done:true},{id:"s3",label:"Provision accounts",done:true},{id:"s4",label:"Assign laptop",done:false},{id:"s5",label:"Schedule first-day orientation",done:false}]},
  { id:"emp-2", name:"Marcus Lee", role:"Software Engineer", department:"Engineering", email:"marcus.lee@journeyone.com", avatar:"https://i.pravatar.cc/100?img=12", type:"onboarding", startLabel:"Starts Jul 29", startDate:"2026-07-29", progress:40, nextStep:{label:"Approve Access",icon:"shield",due:"Tomorrow"}, steps:[{id:"s1",label:"Send offer & welcome email",done:true},{id:"s2",label:"Collect signed documents",done:true},{id:"s3",label:"Approve system access",done:false},{id:"s4",label:"Assign equipment",done:false},{id:"s5",label:"Schedule first-day orientation",done:false}]},
  { id:"emp-3", name:"Ava Patel", role:"Marketing Associate", department:"Marketing", email:"ava.patel@journeyone.com", avatar:"https://i.pravatar.cc/100?img=32", type:"onboarding", startLabel:"Starts Aug 2", startDate:"2026-08-02", progress:20, nextStep:{label:"Upload Documents",icon:"file",due:"2 days"}, steps:[{id:"s1",label:"Send offer & welcome email",done:true},{id:"s2",label:"Upload signed documents",done:false},{id:"s3",label:"Approve system access",done:false},{id:"s4",label:"Assign equipment",done:false},{id:"s5",label:"Schedule first-day orientation",done:false}]},
  { id:"emp-4", name:"Daniel Brooks", role:"IT Support Specialist", department:"Information Technology", email:"daniel.brooks@journeyone.com", avatar:"https://i.pravatar.cc/100?img=51", type:"offboarding", startLabel:"Last Day: May 30", startDate:"2026-05-30", progress:80, nextStep:{label:"Collect Equipment",icon:"mail",due:"Today"}, steps:[{id:"notify-teams",label:"Notify IT and manager",done:true},{id:"revoke-access",label:"Disable accounts and revoke access",done:true},{id:"transfer-files",label:"Transfer files and ownership",done:true},{id:"collect-equipment",label:"Collect company equipment",done:false},{id:"archive-employee",label:"Archive employee record",done:false}]},
  { id:"emp-5", name:"Sofia Ramirez", role:"HR Coordinator", department:"Human Resources", email:"sofia.ramirez@journeyone.com", avatar:"https://i.pravatar.cc/100?img=44", type:"onboarding", startLabel:"Starts Aug 4", startDate:"2026-08-04", progress:20, nextStep:{label:"Collect Documents",icon:"file",due:"3 days"}, steps:[{id:"send-welcome",label:"Send offer & welcome letter",done:true},{id:"collect-documents",label:"Collect signed documents",done:false},{id:"provision-access",label:"Provision accounts and access",done:false},{id:"assign-equipment",label:"Assign laptop and equipment",done:false},{id:"schedule-orientation",label:"Schedule first-day orientation",done:false}]},
  { id:"emp-6", name:"Noah Williams", role:"Financial Analyst", department:"Finance", email:"noah.williams@journeyone.com", avatar:"https://i.pravatar.cc/100?img=15", type:"offboarding", startLabel:"Last Day: Aug 8", startDate:"2026-08-08", progress:20, nextStep:{label:"Disable Accounts",icon:"shield",due:"Tomorrow"}, steps:[{id:"notify-teams",label:"Notify IT and manager",done:true},{id:"revoke-access",label:"Disable accounts and revoke access",done:false},{id:"transfer-files",label:"Transfer files and ownership",done:false},{id:"collect-equipment",label:"Collect company equipment",done:false},{id:"archive-employee",label:"Archive employee record",done:false}]}
];
const INITIAL_TASKS=[
{id:"task-1",employeeId:"emp-1",actionType:"EQUIPMENT_ASSIGNED",label:"Assign laptop for Emily Carter",subLabel:"Onboarding",priority:"High",icon:"laptop",assignedRole:"IT Manager",dueDate:"2026-07-26",status:"OPEN",done:false},
{id:"task-2",employeeId:"emp-2",actionType:"ACCESS_PROVISIONED",label:"Approve access for Marcus Lee",subLabel:"Onboarding",priority:"Medium",icon:"shield",assignedRole:"IT Manager",dueDate:"2026-07-27",status:"OPEN",done:false},
{id:"task-3",employeeId:"emp-4",actionType:"EQUIPMENT_COLLECTED",label:"Collect badge from Daniel Brooks",subLabel:"Offboarding",priority:"High",icon:"briefcase",assignedRole:"IT Manager",dueDate:"2026-05-30",status:"OPEN",done:false},
{id:"task-4",employeeId:"emp-3",actionType:"DOCUMENTS_APPROVED",label:"Review documents for Ava Patel",subLabel:"Onboarding",priority:"Low",icon:"file-text",assignedRole:"HR Manager",dueDate:"2026-07-28",status:"OPEN",done:false}];
const INITIAL_ACCESS=[
{id:"acc-1",name:"Marcus Lee",avatar:"https://i.pravatar.cc/100?img=12",system:"GitHub – Engineering Org",requested:"Jul 20, 2026",status:"Pending"},
{id:"acc-2",name:"Ava Patel",avatar:"https://i.pravatar.cc/100?img=32",system:"Marketing Analytics Suite",requested:"Jul 19, 2026",status:"Pending"},
{id:"acc-3",name:"Emily Carter",avatar:"https://i.pravatar.cc/100?img=47",system:"Figma – Design Team",requested:"Jul 18, 2026",status:"Approved"}];
const INITIAL_DATES=[
{id:"date-1",month:"JUL",day:"28",title:"Emily Carter — First Day",subtitle:"UX Designer",badge:"In 2 days"},
{id:"date-2",month:"JUL",day:"29",title:"Marcus Lee — First Day",subtitle:"Software Engineer",badge:"In 3 days"},
{id:"date-3",month:"AUG",day:"02",title:"Ava Patel — First Day",subtitle:"Marketing Associate",badge:"In 7 days"},
{id:"date-4",month:"MAY",day:"30",title:"Daniel Brooks — Last Day",subtitle:"IT Support Specialist",badge:"Today"}];
const INITIAL_EQUIPMENT=[
{id:"eq-1",item:'MacBook Pro 14"',assetTag:"JO-1042",assignedTo:"Emily Carter",status:"Pending Assignment"},
{id:"eq-2",item:"Dell XPS 15",assetTag:"JO-1088",assignedTo:"Marcus Lee",status:"Assigned"},
{id:"eq-3",item:"iPhone 15",assetTag:"JO-2026",assignedTo:"Ava Patel",status:"Pending Assignment"},
{id:"eq-4",item:"Badge #4471",assetTag:"BADGE-4471",assignedTo:"Daniel Brooks",status:"To Be Collected"}];
const INITIAL_NOTIFICATIONS=[
{id:"n1",text:"Marcus Lee requested access to GitHub",time:"10m ago",read:false},
{id:"n2",text:"Emily Carter's documents were approved",time:"1h ago",read:false},
{id:"n3",text:"Daniel Brooks's offboarding starts today",time:"3h ago",read:false}];
const INITIAL_DEPARTMENTS=[
{id:"dep-1",name:"Engineering",systems:["GitHub","Jira","AWS","Slack"],color:"#7a1130"},
{id:"dep-2",name:"Design",systems:["Figma","Adobe Creative Cloud","Slack"],color:"#c9922f"},
{id:"dep-3",name:"Marketing",systems:["HubSpot","Analytics Suite","Canva"],color:"#2c8a4b"},
{id:"dep-4",name:"Information Technology",systems:["Microsoft 365 Admin","Okta","Service Desk"],color:"#5b5bd6"}];

function load(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}}

function normalizedIdentity(value = "") {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function stableAvatar(profileId) {
  return `https://i.pravatar.cc/100?u=${encodeURIComponent(profileId)}`;
}

function normalizeEmployees(employees) {
  const onboardingTemplate = [
    { id: "send-welcome", label: "Send offer & welcome letter", description: "Send the employee their offer details and first-day information.", icon: "mail" },
    { id: "collect-documents", label: "Collect signed documents", description: "Upload and verify the signed offer, tax forms, and policies.", icon: "file" },
    { id: "provision-access", label: "Provision accounts and access", description: "Choose the systems this employee needs for their department.", icon: "shield" },
    { id: "assign-equipment", label: "Assign laptop and equipment", description: "Reserve an available device and record the assignment.", icon: "laptop" },
    { id: "schedule-orientation", label: "Schedule first-day orientation", description: "Set the orientation date, time, location, and host.", icon: "calendar" },
  ];

  const offboardingTemplate = [
    { id: "notify-teams", label: "Notify IT and manager", description: "Send the employee's departure details to their manager and the IT team.", icon: "mail" },
    { id: "revoke-access", label: "Disable accounts and revoke access", description: "Disable company accounts and remove all approved system permissions.", icon: "shield" },
    { id: "transfer-files", label: "Transfer files and ownership", description: "Choose who will receive the employee's files, projects, and shared resources.", icon: "files" },
    { id: "collect-equipment", label: "Collect company equipment", description: "Confirm the return of assigned devices, badge, and accessories.", icon: "laptop" },
    { id: "archive-employee", label: "Archive employee record", description: "Review the completed checklist and archive the employee's record.", icon: "archive" },
  ];

  const profileByIdentity = new Map();

  employees.forEach((employee) => {
    const identity = normalizedIdentity(employee.email || employee.name);
    const profileId = employee.profileId || employee.sourceOnboardingId || employee.id;
    const existing = profileByIdentity.get(identity);
    if (!existing || employee.type === "onboarding") {
      profileByIdentity.set(identity, {
        profileId,
        avatar: employee.avatar || stableAvatar(profileId),
      });
    }
  });

  return employees.map((employee) => {
    const identity = normalizedIdentity(employee.email || employee.name);
    const canonicalProfile = profileByIdentity.get(identity);
    const profileId = employee.profileId || canonicalProfile?.profileId || employee.id;
    const avatar = canonicalProfile?.avatar || employee.avatar || stableAvatar(profileId);
    const template = employee.type === "onboarding" ? onboardingTemplate : offboardingTemplate;
    if (!template) return employee;
    const existingSteps = employee.steps || [];
    const steps = template.map((item, index) => {
      const matched = existingSteps.find((step) => step.id === item.id) || existingSteps[index];
      return {
        ...item,
        done: Boolean(matched?.done),
        completedAt: matched?.completedAt,
        details: matched?.details,
      };
    });
    const progress = Math.round((steps.filter((step) => step.done).length / steps.length) * 100);
    const nextIncomplete = steps.find((step) => !step.done);
    const completedLabel = employee.type === "onboarding" ? "Onboarding complete" : "Offboarding complete";
    return {
      ...employee,
      profileId,
      avatar,
      steps,
      progress,
      status: progress === 100 ? (employee.type === "offboarding" ? "Archived" : "Completed") : "In Progress",
      onboardingCompletedAt: employee.type === "onboarding" && progress === 100 ? (employee.onboardingCompletedAt || new Date().toISOString()) : employee.onboardingCompletedAt,
      offboardingCompletedAt: employee.type === "offboarding" && progress === 100 ? (employee.offboardingCompletedAt || new Date().toISOString()) : employee.offboardingCompletedAt,
      nextStep: nextIncomplete
        ? { label: nextIncomplete.label, icon: nextIncomplete.icon, due: employee.nextStep?.due || "Today" }
        : { label: completedLabel, icon: "check", due: "Complete" },
    };
  });
}

function Modal({title,subtitle,onClose,children,width}){return <div className="modal-overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal-box" style={width?{maxWidth:width}:undefined}><div className="modal-head"><h3>{title}</h3><button className="modal-close" onClick={onClose}><X/></button></div>{subtitle&&<p className="modal-sub">{subtitle}</p>}{children}</div></div>}
function NewJourneyModal({ type, onClose, onSubmit, presetEmployee = null, employeeOptions = [] }) {
  const onboarding = type === "onboarding";
  const [selectedProfileId, setSelectedProfileId] = useState(presetEmployee?.profileId || presetEmployee?.id || "");
  const selectedEmployee = presetEmployee || employeeOptions.find((employee) => employee.profileId === selectedProfileId || employee.id === selectedProfileId) || null;
  const [name, setName] = useState(presetEmployee?.name || "");
  const [role, setRole] = useState(presetEmployee?.role || "");
  const [department, setDepartment] = useState(presetEmployee?.department || "");
  const [email, setEmail] = useState(presetEmployee?.email || "");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!selectedEmployee || onboarding) return;
    setName(selectedEmployee.name);
    setRole(selectedEmployee.role);
    setDepartment(selectedEmployee.department);
    setEmail(selectedEmployee.email || "");
  }, [selectedEmployee, onboarding]);

  return (
    <Modal
      title={onboarding ? "Start Onboarding Process" : "Start Offboarding"}
      subtitle={
        onboarding
          ? "Create one permanent employee profile and begin their onboarding journey."
          : selectedEmployee
            ? `Continue ${selectedEmployee.name}'s lifecycle using the same saved employee profile.`
            : "Choose an existing employee, or enter their information manually if they are not listed yet."
      }
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim() && role.trim() && date) {
            onSubmit({
              name: name.trim(),
              role: role.trim(),
              department: department || "General",
              email: email.trim(),
              date,
              existingEmployee: selectedEmployee,
            });
          }
        }}
      >
        {!onboarding && !presetEmployee && (
          <div className="field">
            <label>Select employee</label>
            <select
              value={selectedProfileId}
              onChange={(event) => setSelectedProfileId(event.target.value)}
              required
            >
              <option value="">Choose an employee...</option>
              {employeeOptions.map((employee) => (
                <option key={employee.profileId || employee.id} value={employee.profileId || employee.id}>
                  {employee.name} — {employee.department}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedEmployee && !onboarding && (
          <div className="saved-employee-preview">
            <img src={selectedEmployee.avatar} alt="" />
            <div>
              <strong>{selectedEmployee.name}</strong>
              <span>{selectedEmployee.role} · {selectedEmployee.department}</span>
              <small>{selectedEmployee.email}</small>
            </div>
          </div>
        )}

        <div className="field">
          <label>Employee name</label>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Priya Sharma" required  />
        </div>
        <div className="field">
          <label>Email address</label>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="e.g. priya.sharma@company.com" required  />
        </div>
        <div className="field">
          <label>Role / Title</label>
          <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Product Designer" required  />
        </div>
        <div className="field">
          <label>Department</label>
          <input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="e.g. Design"  />
        </div>
        <div className="field">
          <label>{onboarding ? "Start date" : "Last day"}</label>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
        </div>
        {!onboarding && selectedEmployee && (
          <div className="saved-profile-note">
            JourneyOne will reuse employee profile ID <strong>{selectedEmployee.profileId || selectedEmployee.id}</strong>, including the same profile photo and saved records.
          </div>
        )}
        {!onboarding && !employeeOptions.length && !presetEmployee && (
          <div className="saved-profile-note">No saved employees are available yet. You can still enter the employee information manually and start the offboarding workflow.</div>
        )}
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!name.trim() || !role.trim() || !date}>
            <UserPlus /> {onboarding ? "Start Onboarding" : "Start Offboarding"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EmployeeDetailModal({employee,onClose,onToggleStep}){if(!employee)return null;const progress=Math.round(employee.steps.filter(s=>s.done).length/employee.steps.length*100);return <Modal title={employee.name} subtitle={`${employee.role} · ${employee.startLabel}`} onClose={onClose}><div className="progress-block"><div className="label">Journey progress</div><div className="progress-bar-row"><div className="progress-track"><div className={`progress-fill ${employee.type==="offboarding"?"offboarding":""}`} style={{width:`${progress}%`}}/></div><span className="progress-pct">{progress}%</span></div></div><div className="step-checklist">{employee.steps.map(s=><button key={s.id} className={`step-item ${s.done?"done":""}`} onClick={()=>onToggleStep(employee.id,s.id)}><span className="dot">{s.done&&<Check/>}</span>{s.label}</button>)}</div><div className="modal-actions"><button className="btn-secondary" onClick={onClose}>Close</button></div></Modal>}

function AddTaskModal({ onClose, employees, onSubmit }) {
  const [label, setLabel] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [route, setRoute] = useState("/tasks");

  return (
    <Modal title="Add HR Task" subtitle="Create a task and connect it to the page where the work gets completed." onClose={onClose}>
      <form onSubmit={(event) => {
        event.preventDefault();
        if (!label.trim()) return;
        onSubmit({ label: label.trim(), employeeId, priority, dueDate, route });
      }}>
        <div className="field">
          <label>Task title</label>
          <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="e.g. Review I-9 documents" required />
        </div>
        <div className="field">
          <label>Related employee</label>
          <select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
            <option value="">General HR task</option>
            {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
          </select>
        </div>
        <div className="workflow-form-grid">
          <div className="field">
            <label>Priority</label>
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div className="field">
            <label>Due date</label>
            <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Take me to</label>
          <select value={route} onChange={(event) => setRoute(event.target.value)}>
            <option value="/tasks">HR Tasks</option>
            <option value="/documents">Employee Documents</option>
            <option value="/orientation">Orientation Planning</option>
            <option value="/onboarding">Onboarding</option>
            <option value="/offboarding">Offboarding</option>
            <option value="/employees">Employees</option>
          </select>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary"><Check /> Add task</button>
        </div>
      </form>
    </Modal>
  );
}

function UploadDocumentModal({ onClose, employees, onSubmit, presetEmployeeId = "" }) {
  const onboardingEmployees = employees.filter((employee) => employee.type === "onboarding");
  const [employeeId, setEmployeeId] = useState(presetEmployeeId || onboardingEmployees[0]?.id || "");
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);

  return (
    <Modal title="Upload Employee Document" subtitle="Save a document title and connect the file to the employee's onboarding workflow." onClose={onClose}>
      <form onSubmit={(event) => {
        event.preventDefault();
        if (!employeeId || !title.trim() || !files.length) return;
        onSubmit({ employeeId, title: title.trim(), files });
      }}>
        <div className="field">
          <label>Employee</label>
          <select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} required>
            <option value="">Choose an employee...</option>
            {onboardingEmployees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Document title</label>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Signed Offer Letter" required />
        </div>
        <label className="document-upload">
          <FileText />
          <span><strong>Select document</strong><small>PDF, DOCX, image, or other employee record</small></span>
          <input type="file" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} />
        </label>
        {files.length > 0 && <div className="uploaded-files">{files.map((file) => <div key={`${file.name}-${file.size}`}><FileText /><span>{file.name}</span><CheckCircle2 /></div>)}</div>}
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!employeeId || !title.trim() || !files.length}><Check /> Upload and verify</button>
        </div>
      </form>
    </Modal>
  );
}

function ScheduleOrientationModal({ onClose, employees, onSubmit, presetEmployeeId = "" }) {
  const eligible = employees.filter((employee) => employee.type === "onboarding" && employee.progress < 100);
  const [employeeId, setEmployeeId] = useState(presetEmployeeId || eligible[0]?.id || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [host, setHost] = useState("");

  return (
    <Modal title="Schedule Orientation" subtitle="Plan the employee's first-day orientation and complete the connected HR task." onClose={onClose}>
      <form onSubmit={(event) => {
        event.preventDefault();
        if (!employeeId || !date || !time || !location.trim() || !host.trim()) return;
        onSubmit({ employeeId, date, time, location: location.trim(), host: host.trim() });
      }}>
        <div className="field">
          <label>Employee</label>
          <select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} required>
            <option value="">Choose an employee...</option>
            {eligible.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
          </select>
        </div>
        <div className="workflow-form-grid">
          <div className="field"><label>Date</label><input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></div>
          <div className="field"><label>Time</label><input type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></div>
        </div>
        <div className="field"><label>Location or meeting link</label><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Main Office, Room 204" required /></div>
        <div className="field"><label>Orientation host</label><input value={host} onChange={(event) => setHost(event.target.value)} placeholder="e.g. Maya Thompson" required /></div>
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary"><Check /> Schedule orientation</button>
        </div>
      </form>
    </Modal>
  );
}

function ReportModal({onClose,employees,tasks,accessRequests}){const [type,setType]=useState("onboarding");function dl(){let rows=[],name="report.csv";if(type==="onboarding"){rows=employees.filter(e=>e.type==="onboarding").map(e=>({Name:e.name,Role:e.role,Start:e.startLabel,Progress:`${e.progress}%`}));name="onboarding-report.csv"}else if(type==="offboarding"){rows=employees.filter(e=>e.type==="offboarding").map(e=>({Name:e.name,Role:e.role,LastDay:e.startLabel,Progress:`${e.progress}%`}));name="offboarding-report.csv"}else if(type==="tasks"){rows=tasks.map(t=>({Task:t.label,Category:t.subLabel,Priority:t.priority,Status:t.done?"Done":"Open"}));name="tasks-report.csv"}else{rows=accessRequests.map(a=>({Name:a.name,System:a.system,Requested:a.requested,Status:a.status}));name="access-requests-report.csv"}const headers=rows.length?Object.keys(rows[0]):[];const csv=[headers.join(","),...rows.map(r=>headers.map(h=>`"${String(r[h]).replace(/"/g,'""')}"`).join(","))].join("\n");const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);onClose(name)}return <Modal title="Generate Report" subtitle="Choose a report to create and download as CSV." onClose={()=>onClose()}><div className="field"><label>Report type</label><select value={type} onChange={e=>setType(e.target.value)}><option value="onboarding">Onboarding summary</option><option value="offboarding">Offboarding summary</option><option value="tasks">Task list</option><option value="access">Access requests</option></select></div><div className="modal-actions"><button className="btn-secondary" onClick={()=>onClose()}>Cancel</button><button className="btn-primary" onClick={dl}><Download/>Download CSV</button></div></Modal>}
function HowModal({onClose}){return <Modal title="How JourneyOne works" subtitle="A simple workflow behind every hire and every exit." onClose={onClose} width={480}><div className="step-checklist">{["Start a journey","Coordinate access and equipment","Track every required step","Export reports for stakeholders"].map((x,i)=><div className="step-item" key={x}><span className="dot done-dot">{i+1}</span><div><strong>{x}</strong></div></div>)}</div><div className="modal-actions"><button className="btn-primary full" onClick={onClose}>Got it</button></div></Modal>}

export default function Layout() {
  const navigate = useNavigate();
  const { user: authenticatedUser, logout } = useAuth();
  const [employees, setEmployees] = useState(() =>
    normalizeEmployees(load("jo-employees", INITIAL_EMPLOYEES))
  );
  const [tasks, setTasks] = useState(() => load("jo-tasks", INITIAL_TASKS).filter((task) => task.actionType !== "EXIT_INTERVIEW_COMPLETED" && !/exit interview/i.test(task.label || "")));
  const [accessRequests, setAccessRequests] = useState(() =>
    load("jo-access", INITIAL_ACCESS)
  );
  const [equipment, setEquipment] = useState(() =>
    load("jo-equipment", INITIAL_EQUIPMENT)
  );
  const [notifications, setNotifications] = useState(() =>
    load("jo-notifications", INITIAL_NOTIFICATIONS)
  );
  const [departments, setDepartments] = useState(() =>
    load("jo-departments", INITIAL_DEPARTMENTS)
  );
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = load("jo-user", null);
    const source = authenticatedUser || saved || {
      name: "JourneyOne User",
      title: "Team Member",
      role: "TEAM_MEMBER",
    };
    return {
      ...source,
      firstName: source.name?.split(" ")[0] || "Team",
      avatar: source.avatar || null,
    };
  });
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = load("jo-audit", []);
    return saved.length ? saved : AUDIT_DEMO_LOGS;
  });
  const [systemMode, setSystemMode] = useState("Local demo");

  useEffect(() => {
    localStorage.setItem("jo-employees", JSON.stringify(employees));
  }, [employees]);
  useEffect(() => {
    localStorage.setItem("jo-tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("jo-access", JSON.stringify(accessRequests));
  }, [accessRequests]);
  useEffect(() => {
    localStorage.setItem("jo-equipment", JSON.stringify(equipment));
  }, [equipment]);
  useEffect(() => {
    localStorage.setItem("jo-notifications", JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem("jo-departments", JSON.stringify(departments));
  }, [departments]);
  useEffect(() => {
    localStorage.setItem("jo-user", JSON.stringify(currentUser));
  }, [currentUser]);
  useEffect(() => { localStorage.setItem("jo-audit", JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { safeApi("/health").then((result) => result && setSystemMode("API connected")); }, []);

  useEffect(() => {
    const migrationKey = "jo-it-demo-journeys-v3";
    if (localStorage.getItem(migrationKey)) return;

    const demoEmployees = [
      {
        id: "emp-blaire-willow", profileId: "profile-blaire-willow", name: "Blaire Willow",
        role: "Product Designer", department: "Design", email: "blaire.willow@journeyone.com",
        avatar: "https://i.pravatar.cc/100?u=blaire-willow", type: "onboarding",
        startLabel: "Starts Jul 30", startDate: "2026-07-30",
        steps: [
          { id: "send-welcome", done: true }, { id: "collect-documents", done: true },
          { id: "provision-access", done: true }, { id: "assign-equipment", done: false },
          { id: "schedule-orientation", done: false },
        ],
      },
      {
        id: "emp-elizabeth-melody", profileId: "profile-elizabeth-melody", name: "Elizabeth Melody",
        role: "Financial Analyst", department: "Finance", email: "elizabeth.melody@journeyone.com",
        avatar: "https://i.pravatar.cc/100?u=elizabeth-melody", type: "onboarding",
        startLabel: "Starts Jul 31", startDate: "2026-07-31",
        steps: [
          { id: "send-welcome", done: true }, { id: "collect-documents", done: true },
          { id: "provision-access", done: false }, { id: "assign-equipment", done: false },
          { id: "schedule-orientation", done: false },
        ],
      },
      {
        id: "emp-carter-johnson", profileId: "profile-carter-johnson", name: "Carter Johnson",
        role: "Operations Coordinator", department: "Operations", email: "carter.johnson@journeyone.com",
        avatar: "https://i.pravatar.cc/100?u=carter-johnson", type: "onboarding",
        startLabel: "Starts Aug 1", startDate: "2026-08-01",
        steps: [
          { id: "send-welcome", done: true }, { id: "collect-documents", done: true },
          { id: "provision-access", done: false }, { id: "assign-equipment", done: false },
          { id: "schedule-orientation", done: false },
        ],
      },
    ];

    setEmployees((previous) => normalizeEmployees([
      ...previous,
      ...demoEmployees.filter((demo) => !previous.some((employee) => employee.id === demo.id || employee.email === demo.email)),
    ]));

    const demoTasks = [
      {
        id: "task-blaire-equipment", employeeId: "emp-blaire-willow", actionType: "EQUIPMENT_ASSIGNED",
        label: "Assign MacBook Pro to Blaire Willow", subLabel: "Onboarding", priority: "High",
        assignedRole: "IT Manager", dueDate: "2026-07-22", status: "OPEN", done: false, icon: "laptop",
        targetPath: "/equipment?focus=Blaire%20Willow",
      },
      {
        id: "task-elizabeth-account", employeeId: "emp-elizabeth-melody", actionType: "ACCESS_PROVISIONED",
        label: "Create employee account for Elizabeth Melody", subLabel: "Onboarding", priority: "High",
        assignedRole: "IT Manager", dueDate: "2026-07-22", status: "OPEN", done: false, icon: "key",
        targetPath: "/accounts?focus=emp-elizabeth-melody",
      },
      {
        id: "task-carter-access", employeeId: "emp-carter-johnson", actionType: "ACCESS_REQUEST_REVIEW",
        label: "Review Microsoft 365 access for Carter Johnson", subLabel: "Onboarding", priority: "Medium",
        assignedRole: "IT Manager", dueDate: "2026-07-23", status: "OPEN", done: false, icon: "shield",
        targetPath: "/access-requests?focus=acc-carter-m365",
      },
    ];
    setTasks((previous) => [
      ...demoTasks.filter((demo) => !previous.some((task) => task.id === demo.id)),
      ...previous,
    ]);

    const demoEquipment = {
      id: "eq-blaire-macbook", item: 'MacBook Pro 14" M4', assetTag: "JO-2148",
      assignedTo: "Blaire Willow", status: "Pending Assignment",
    };
    setEquipment((previous) => previous.some((item) => item.id === demoEquipment.id) ? previous : [demoEquipment, ...previous]);

    const demoAccess = {
      id: "acc-carter-m365", name: "Carter Johnson", avatar: "https://i.pravatar.cc/100?u=carter-johnson",
      system: "Microsoft 365", requested: "Jul 22, 2026", status: "Pending",
    };
    setAccessRequests((previous) => previous.some((request) => request.id === demoAccess.id) ? previous : [demoAccess, ...previous]);

    localStorage.setItem(migrationKey, "complete");
  }, []);


  useEffect(() => {
    const migrationKey = "jo-hr-dashboard-tasks-v1";
    if (localStorage.getItem(migrationKey)) return;
    const demoTasks = [
      { id:"task-hr-welcome-emily", employeeId:"emp-1", actionType:"WELCOME_SENT", label:"Send first-day reminder to Emily Carter", subLabel:"Onboarding", priority:"High", assignedRole:"HR Manager", dueDate:"2026-07-27", status:"OPEN", done:false, route:"/onboarding/emp-1" },
      { id:"task-hr-orientation-marcus", employeeId:"emp-2", actionType:"ORIENTATION_SCHEDULED", label:"Schedule orientation for Marcus Lee", subLabel:"Onboarding", priority:"Medium", assignedRole:"HR Manager", dueDate:"2026-07-28", status:"OPEN", done:false, route:"/orientation" },
      { id:"task-hr-documents-ava", employeeId:"emp-3", actionType:"DOCUMENTS_APPROVED", label:"Review signed documents for Ava Patel", subLabel:"Onboarding", priority:"High", assignedRole:"HR Manager", dueDate:"2026-07-26", status:"OPEN", done:false, route:"/documents" },
    ];
    setTasks((previous) => {
      const ids = new Set(previous.map((task) => task.id));
      return [...demoTasks.filter((task) => !ids.has(task.id)), ...previous];
    });
    localStorage.setItem(migrationKey, "complete");
  }, []);

  function recordAudit(action, resourceType, resourceId, details = {}) {
    setAuditLogs((previous) => [{
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      actorName: currentUser.name,
      actorEmail: currentUser.email || `${String(currentUser.name || "user").toLowerCase().replace(/\s+/g, ".")}@journeyone.com`,
      actorRole: currentUser.role || currentUser.title,
      action,
      resourceType,
      resourceId,
      status: details.status || "SUCCESS",
      details,
      createdAt: new Date().toISOString(),
    }, ...previous]);
  }

  function completeTaskFor(employeeId, actionType) {
    setTasks((previous) => previous.map((task) =>
      task.employeeId === employeeId && task.actionType === actionType
        ? { ...task, done: true, status: "COMPLETED", completedAt: new Date().toISOString(), completedBy: currentUser.name }
        : task
    ));
  }

  function createTasksForJourney(employee) {
    const actionByStep = {
      "send-welcome":"WELCOME_SENT", "collect-documents":"DOCUMENTS_APPROVED", "provision-access":"ACCESS_PROVISIONED",
      "assign-equipment":"EQUIPMENT_ASSIGNED", "schedule-orientation":"ORIENTATION_SCHEDULED", "notify-teams":"TEAMS_NOTIFIED",
      "revoke-access":"ACCESS_REVOKED", "transfer-files":"FILES_TRANSFERRED", "collect-equipment":"EQUIPMENT_COLLECTED",
      "archive-employee":"EMPLOYEE_ARCHIVED"
    };
    const ownerByAction = { WELCOME_SENT:"HR Manager", DOCUMENTS_APPROVED:"HR Manager", ACCESS_PROVISIONED:"IT Manager", EQUIPMENT_ASSIGNED:"IT Manager", ORIENTATION_SCHEDULED:"HR Manager", TEAMS_NOTIFIED:"HR Manager", ACCESS_REVOKED:"IT Manager", FILES_TRANSFERRED:"HR Manager", EQUIPMENT_COLLECTED:"IT Manager", EXIT_INTERVIEW_COMPLETED:"HR Manager", EMPLOYEE_ARCHIVED:"HR Manager" };
    const newTasks = employee.steps.map((step, index) => ({
      id:`task-${Date.now()}-${index}`, employeeId:employee.id, actionType:actionByStep[step.id],
      label:`${step.label} for ${employee.name}`, subLabel:employee.type === "onboarding" ? "Onboarding" : "Offboarding",
      priority:index < 2 ? "High" : index < 4 ? "Medium" : "Low", assignedRole:ownerByAction[actionByStep[step.id]],
      dueDate:employee.startDate, status:"OPEN", done:false, icon:step.icon || "file-text"
    }));
    setTasks((previous) => [...newTasks, ...previous]);
  }

  function flash(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }

  function openEmployee(employee) {
    if (employee.type === "onboarding") {
      navigate(`/onboarding/${employee.id}`);
      return;
    }
    if (employee.type === "offboarding") {
      navigate(`/offboarding/${employee.id}`);
      return;
    }
    setModal({ type: "employee", payload: employee });
  }

  function toggleStep(employeeId, stepId) {
    setEmployees((previous) =>
      previous.map((employee) => {
        if (employee.id !== employeeId) return employee;
        const steps = employee.steps.map((step) =>
          step.id === stepId ? { ...step, done: !step.done } : step
        );
        const progress = Math.round(
          (steps.filter((step) => step.done).length / steps.length) * 100
        );
        const nextIncomplete = steps.find((step) => !step.done);
        return {
          ...employee,
          steps,
          progress,
          nextStep: nextIncomplete
            ? { ...employee.nextStep, label: nextIncomplete.label, due: "Today" }
            : { label: "Onboarding complete", icon: "check", due: "Complete" },
        };
      })
    );
  }

  function completeOnboardingStep(employeeId, stepId, details = {}) {
    let completedLabel = "Task completed";

    setEmployees((previous) =>
      previous.map((employee) => {
        if (employee.id !== employeeId) return employee;

        const steps = employee.steps.map((step) => {
          if (step.id !== stepId) return step;
          completedLabel = step.label;
          return {
            ...step,
            done: true,
            completedAt: new Date().toISOString(),
            details: { ...(step.details || {}), ...details },
          };
        });

        const progress = Math.round(
          (steps.filter((step) => step.done).length / steps.length) * 100
        );
        const nextIncomplete = steps.find((step) => !step.done);

        return {
          ...employee,
          steps,
          progress,
          status: progress === 100 ? "Completed" : "In Progress",
          onboardingCompletedAt:
            progress === 100
              ? employee.onboardingCompletedAt || new Date().toISOString()
              : employee.onboardingCompletedAt,
          nextStep: nextIncomplete
            ? { label: nextIncomplete.label, icon: nextIncomplete.icon || "file", due: "Today" }
            : { label: "Onboarding complete", icon: "check", due: "Complete" },
        };
      })
    );

    if (stepId === "assign-equipment" && details.equipmentId) {
      setEquipment((previous) =>
        previous.map((item) =>
          item.id === details.equipmentId
            ? { ...item, assignedTo: details.employeeName, status: "Assigned" }
            : item
        )
      );
    }

    if (stepId === "provision-access" && details.systems?.length) {
      setAccessRequests((previous) => [
        ...details.systems.map((system, index) => ({
          id: `acc-${Date.now()}-${index}`,
          name: details.employeeName,
          avatar: details.employeeAvatar,
          system,
          requested: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          status: "Approved",
        })),
        ...previous,
      ]);
    }

    const onboardingAction = {"send-welcome":"WELCOME_SENT","collect-documents":"DOCUMENTS_APPROVED","provision-access":"ACCESS_PROVISIONED","assign-equipment":"EQUIPMENT_ASSIGNED","schedule-orientation":"ORIENTATION_SCHEDULED"}[stepId];
    if (onboardingAction) completeTaskFor(employeeId, onboardingAction);
    recordAudit(onboardingAction || "WORKFLOW_STEP_COMPLETED", "employee", employeeId, { ...details, stepId, workflow: "onboarding", employeeName: details.employeeName, category: completedLabel, system: "JourneyOne Onboarding", proof: `${completedLabel} completed for ${details.employeeName || "employee"}.` });
    safeApi(`/employees/${employeeId}/steps/${stepId}`, { method:"PATCH", body:JSON.stringify({ details }) });

    setNotifications((previous) => [
      {
        id: `n-${Date.now()}`,
        text: `${completedLabel} completed for ${details.employeeName || "employee"}`,
        time: "Just now",
        read: false,
      },
      ...previous,
    ]);

    flash(`${completedLabel} completed.`);
  }

  function completeOffboardingStep(employeeId, stepId, details = {}) {
    let completedLabel = "Task completed";
    let employeeName = details.employeeName || "employee";

    setEmployees((previous) =>
      previous.map((employee) => {
        if (employee.id !== employeeId) return employee;
        employeeName = employee.name;
        const steps = employee.steps.map((step) => {
          if (step.id !== stepId) return step;
          completedLabel = step.label;
          return {
            ...step,
            done: true,
            completedAt: new Date().toISOString(),
            details: { ...(step.details || {}), ...details },
          };
        });
        const progress = Math.round((steps.filter((step) => step.done).length / steps.length) * 100);
        const nextIncomplete = steps.find((step) => !step.done);
        return {
          ...employee,
          steps,
          progress,
          status: progress === 100 ? "Archived" : "In Progress",
          offboardingCompletedAt: progress === 100 ? (employee.offboardingCompletedAt || new Date().toISOString()) : employee.offboardingCompletedAt,
          nextStep: nextIncomplete
            ? { label: nextIncomplete.label, icon: nextIncomplete.icon || "file", due: "Today" }
            : { label: "Offboarding complete", icon: "check", due: "Complete" },
        };
      })
    );

    if (stepId === "revoke-access") {
      setAccessRequests((previous) =>
        previous.map((request) =>
          request.name === employeeName ? { ...request, status: "Revoked" } : request
        )
      );
    }

    if (stepId === "collect-equipment") {
      setEquipment((previous) =>
        previous.map((item) =>
          item.assignedTo === employeeName
            ? { ...item, assignedTo: "Unassigned", status: "Available" }
            : item
        )
      );
    }

    const offboardingAction = {"notify-teams":"TEAMS_NOTIFIED","revoke-access":"ACCESS_REVOKED","transfer-files":"FILES_TRANSFERRED","collect-equipment":"EQUIPMENT_COLLECTED","archive-employee":"EMPLOYEE_ARCHIVED"}[stepId];
    if (offboardingAction) completeTaskFor(employeeId, offboardingAction);
    recordAudit(offboardingAction || "WORKFLOW_STEP_COMPLETED", "employee", employeeId, { ...details, stepId, workflow: "offboarding", employeeName, category: completedLabel, system: stepId === "revoke-access" ? "Identity & Access Management" : "JourneyOne Offboarding", proof: `${completedLabel} completed for ${employeeName}.` });
    safeApi(`/employees/${employeeId}/steps/${stepId}`, { method:"PATCH", body:JSON.stringify({ details }) });

    setNotifications((previous) => [
      {
        id: `n-${Date.now()}`,
        text: `${completedLabel} completed for ${employeeName}`,
        time: "Just now",
        read: false,
      },
      ...previous,
    ]);

    flash(`${completedLabel} completed successfully.`);
  }

  function createJourney(type, { name, role, department, email, date, existingEmployee = null }) {
    const id = `emp-${Date.now()}`;
    const profileId = existingEmployee?.profileId || existingEmployee?.id || `profile-${Date.now()}`;
    const formatted = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const onboardingSteps = [
      {
        id: "send-welcome",
        label: "Send offer & welcome letter",
        description: "Send the employee their offer details and first-day information.",
        icon: "mail",
        done: false,
      },
      {
        id: "collect-documents",
        label: "Collect signed documents",
        description: "Upload and verify the signed offer, tax forms, and policies.",
        icon: "file",
        done: false,
      },
      {
        id: "provision-access",
        label: "Provision accounts and access",
        description: "Choose the systems this employee needs for their department.",
        icon: "shield",
        done: false,
      },
      {
        id: "assign-equipment",
        label: "Assign laptop and equipment",
        description: "Reserve an available device and record the assignment.",
        icon: "laptop",
        done: false,
      },
      {
        id: "schedule-orientation",
        label: "Schedule first-day orientation",
        description: "Set the orientation date, time, location, and host.",
        icon: "calendar",
        done: false,
      },
    ];

    const offboardingSteps = [
      { id: "notify-teams", label: "Notify IT and manager", description: "Send the employee's departure details to their manager and the IT team.", icon: "mail", done: false },
      { id: "revoke-access", label: "Disable accounts and revoke access", description: "Disable company accounts and remove all approved system permissions.", icon: "shield", done: false },
      { id: "transfer-files", label: "Transfer files and ownership", description: "Choose who will receive the employee's files, projects, and shared resources.", icon: "files", done: false },
      { id: "collect-equipment", label: "Collect company equipment", description: "Confirm the return of assigned devices, badge, and accessories.", icon: "laptop", done: false },
      { id: "archive-employee", label: "Archive employee record", description: "Review the completed checklist and archive the employee's record.", icon: "archive", done: false },
    ];

    const steps = type === "onboarding" ? onboardingSteps : offboardingSteps;
    const employee = {
      id,
      name,
      role,
      department,
      profileId,
      sourceOnboardingId: type === "offboarding" ? existingEmployee?.id || null : null,
      email: existingEmployee?.email || email || `${name.toLowerCase().replace(/\s+/g, ".")}@journeyone.com`,
      avatar: existingEmployee?.avatar || stableAvatar(profileId),
      type,
      status: "In Progress",
      startLabel:
        type === "onboarding" ? `Starts ${formatted}` : `Last Day: ${formatted}`,
      startDate: date,
      progress: 0,
      nextStep: {
        label: steps[0].label,
        icon: steps[0].icon || "shield",
        due: "Today",
      },
      steps,
    };

    if (type === "offboarding" && existingEmployee) {
      const alreadyOffboarding = employees.some(
        (item) => item.type === "offboarding" && item.profileId === profileId && item.progress < 100
      );
      if (alreadyOffboarding) {
        setModal(null);
        flash(`${name} already has an active offboarding journey.`);
        return;
      }
    }

    setEmployees((previous) => [employee, ...previous]);
    createTasksForJourney(employee);
    recordAudit(type === "onboarding" ? "ONBOARDING_INITIATED" : "OFFBOARDING_INITIATED", "employee", employee.id, {
      type,
      employeeName: employee.name,
      employeeId: employee.id,
      employeeCode: employee.profileId,
      department: employee.department,
      category: type === "onboarding" ? "Onboarding Started" : "Offboarding Started",
      system: "JourneyOne",
      proof: `${type === "onboarding" ? "Onboarding" : "Offboarding"} journey started for ${employee.name} with ${steps.length} required lifecycle steps.`,
      effectiveDate: date,
    });
    safeApi("/employees", { method:"POST", body:JSON.stringify(employee) });
    setModal(null);
    flash(`${type === "onboarding" ? "Onboarding" : "Offboarding"} started for ${name}.`);

    if (type === "onboarding") {
      navigate(`/onboarding/${id}`);
    } else {
      navigate(`/offboarding/${id}`);
    }
  }


  function addCustomHrTask({ label, employeeId, priority, dueDate, route }) {
    const employee = employees.find((item) => item.id === employeeId);
    const task = {
      id: `task-custom-${Date.now()}`,
      employeeId: employeeId || null,
      actionType: "CUSTOM_HR_TASK",
      label,
      subLabel: employee ? `${employee.name} · Custom HR task` : "Custom HR task",
      priority,
      assignedRole: "HR Manager",
      dueDate: dueDate || new Date().toISOString().slice(0, 10),
      status: "OPEN",
      done: false,
      route,
      custom: true,
    };
    setTasks((previous) => [task, ...previous]);
    recordAudit("HR_TASK_CREATED", "task", task.id, { employeeId, route });
    setModal(null);
    flash("HR task added.");
  }

  function saveEmployeeDocument({ employeeId, title, files }) {
    const employee = employees.find((item) => item.id === employeeId);
    if (!employee) return;
    const existingStep = employee.steps?.find((step) => step.id === "collect-documents");
    const existingDocuments = existingStep?.details?.documents || [];
    const uploadedDocuments = files.map((file) => ({ title, name: file.name, size: file.size, type: file.type, uploadedAt: new Date().toISOString() }));
    const documents = [...existingDocuments, ...uploadedDocuments];
    completeOnboardingStep(employeeId, "collect-documents", { employeeName: employee.name, documents, documentTitle: title });
    setModal(null);
  }

  function saveOrientation({ employeeId, date, time, location, host }) {
    const employee = employees.find((item) => item.id === employeeId);
    if (!employee) return;
    completeOnboardingStep(employeeId, "schedule-orientation", { employeeName: employee.name, date, time, location, host });
    setModal(null);
  }

  const context = {
    employees,
    tasks,
    accessRequests,
    equipment,
    dates: INITIAL_DATES,
    notifications,
    departments,
    currentUser,
    auditLogs,
    systemMode,
    navigate,
    openEmployee,
    completeOnboardingStep,
    completeOffboardingStep,
    startOnboarding: () => setModal({ type: "new-onboarding" }),
    startOffboarding: () => setModal({ type: "new-offboarding" }),
    addHrTask: () => setModal({ type: "add-hr-task" }),
    uploadDocument: (employeeId = "") => setModal({ type: "upload-document", payload: { employeeId } }),
    scheduleOrientation: (employeeId = "") => setModal({ type: "schedule-orientation", payload: { employeeId } }),
    startOffboardingFor: (employee) =>
      setModal({ type: "new-offboarding", payload: employee }),
    generateReport: () => setModal({ type: "report" }),
    showHow: () => setModal({ type: "how" }),
    toggleTask: (id) => {
      const task = tasks.find((item) => item.id === id);
      if (!task?.done) { flash("This task completes automatically when its related action is finished."); return; }
      flash("Completed tasks are locked to preserve the audit trail.");
    },
    manualToggleTask: (id) => {
      const task = tasks.find((item) => item.id === id);
      if (!task) return;
      const nextDone = !(task.done || task.status === "COMPLETED");
      setTasks((previous) => previous.map((item) => item.id === id ? {
        ...item,
        done: nextDone,
        status: nextDone ? "COMPLETED" : "OPEN",
        completedAt: nextDone ? new Date().toISOString() : null,
      } : item));
      recordAudit(nextDone ? "TASK_MANUALLY_COMPLETED" : "TASK_REOPENED", "task", id, {
        employeeId: task.employeeId,
        actionType: task.actionType,
      });
      safeApi(`/tasks/${id}`, { method:"PATCH", body:JSON.stringify({ status: nextDone ? "COMPLETED" : "OPEN" }) });
      flash(nextDone ? "Task marked complete." : "Task reopened.");
    },
    decideAccess: (id, status, reason = "") => {
      const request = accessRequests.find((item) => item.id === id);
      setAccessRequests((previous) => previous.map((item) => item.id === id ? { ...item, status, reason, decidedAt:new Date().toISOString(), decidedBy:currentUser.name } : item));
      if (status === "Approved" && request) {
        const employee = employees.find((item) => item.name === request.name);
        if (employee) {
          completeTaskFor(employee.id, "ACCESS_PROVISIONED");
          completeTaskFor(employee.id, "ACCESS_REQUEST_REVIEW");
        }
      }
      recordAudit("ACCESS_REQUEST_DECIDED", "accessRequest", id, { status, reason });
      safeApi(`/access-requests/${id}`, { method:"PATCH", body:JSON.stringify({ status, reason }) });
      flash(`Access request ${status.toLowerCase()}.`);
    },
    markEquipment: (id, status = "Assigned") => {
      const item = equipment.find((entry) => entry.id === id);
      setEquipment((previous) => previous.map((entry) => entry.id === id ? { ...entry, status, handledAt:new Date().toISOString() } : entry));
      const employee = employees.find((entry) => entry.name === item?.assignedTo);
      if (employee) completeTaskFor(employee.id, status === "Available" ? "EQUIPMENT_COLLECTED" : "EQUIPMENT_ASSIGNED");
      recordAudit("EQUIPMENT_STATUS_UPDATED", "equipment", id, { status, employeeId:employee?.id });
      if (item && employee) safeApi(`/equipment/${id}/${status === "Available" ? "return" : "assign"}`, { method:"POST", body:JSON.stringify({ employeeId:employee.id, employeeName:employee.name }) });
      flash("Equipment status updated and related task completed.");
    },
    assignEquipment: (equipmentId, employeeId) => {
      const item = equipment.find((entry) => entry.id === equipmentId);
      const employee = employees.find((entry) => entry.id === employeeId);
      if (!item || !employee) {
        flash("Choose a valid device and employee.");
        return;
      }
      if (item.status === "Assigned" && item.employeeId && item.employeeId !== employeeId) {
        flash("This device is already assigned to another employee.");
        return;
      }
      completeOnboardingStep(employeeId, "assign-equipment", {
        equipmentId,
        employeeId,
        employeeName: employee.name,
        employeeAvatar: employee.avatar,
        equipmentName: item.item,
        assetTag: item.assetTag,
      });
      setEquipment((previous) => previous.map((entry) => entry.id === equipmentId ? {
        ...entry,
        assignedTo: employee.name,
        employeeId: employee.id,
        status: "Assigned",
        assignedAt: new Date().toISOString(),
      } : entry));
      flash(`${item.item} assigned to ${employee.name}.`);
    },
    addEquipment: (item) =>
      setEquipment((previous) => [
        { id: `eq-${Date.now()}`, ...item },
        ...previous,
      ]),
    updateEmployeeAccount: (employeeId, updates) => {
      let updatedName = null;
      setEmployees((previous) => previous.map((employee) => {
        if (employee.id !== employeeId) return employee;
        updatedName = updates.name || employee.name;
        return { ...employee, ...updates };
      }));
      completeTaskFor(employeeId, "ACCESS_PROVISIONED");
      recordAudit("ACCOUNT_UPDATED", "employee", employeeId, updates);
      safeApi(`/employees/${employeeId}/account`, { method: "PATCH", body: JSON.stringify(updates) });
      flash(`Account updated for ${updatedName || "employee"}.`);
    },
    toggleAccountStatus: (employeeId) => {
      let nextStatus = "Active";
      let employeeName = "employee";
      setEmployees((previous) => previous.map((employee) => {
        if (employee.id !== employeeId) return employee;
        nextStatus = (employee.accountStatus || "Active") === "Active" ? "Disabled" : "Active";
        employeeName = employee.name;
        return { ...employee, accountStatus: nextStatus };
      }));
      recordAudit("ACCOUNT_STATUS_CHANGED", "employee", employeeId, { status: nextStatus });
      safeApi(`/employees/${employeeId}/account`, { method: "PATCH", body: JSON.stringify({ accountStatus: nextStatus }) });
      flash(`${employeeName}'s account is now ${nextStatus.toLowerCase()}.`);
    },
    resetAccountPassword: (employeeId) => {
      const employee = employees.find((item) => item.id === employeeId);
      recordAudit("ACCOUNT_PASSWORD_RESET", "employee", employeeId, {});
      safeApi(`/employees/${employeeId}/account/reset-password`, { method: "POST" });
      flash(`Temporary password sent to ${employee?.email || "the employee"}.`);
    },
    markNotification: (id) =>
      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      ),
    markAllNotifications: () =>
      setNotifications((previous) =>
        previous.map((notification) => ({ ...notification, read: true }))
      ),
    setDepartments,
    saveUser: ({ name, title }) =>
      setCurrentUser((user) => ({
        ...user,
        name,
        title,
        firstName: name.split(" ")[0],
      })),
    signOut: () => { logout(); navigate("/login", { replace: true }); },
    permissions: {
      canManageEmployees:["IT_MANAGER","HR_MANAGER"].includes(authenticatedUser?.role),
      canManageEquipment:authenticatedUser?.role === "IT_MANAGER",
      canAudit:["IT_MANAGER","HR_MANAGER","AUDITOR"].includes(authenticatedUser?.role),
    },
    recordAudit,
    flash,
  };

  return (
    <div className="app-shell">
      <Sidebar currentUser={currentUser} />

      <div className="main-column">
        <TopNavbar {...context} />
        <main className="main-content">
          <Outlet context={context} />
        </main>
      </div>

      {modal?.type === "new-onboarding" && (
        <NewJourneyModal
          type="onboarding"
          onClose={() => setModal(null)}
          onSubmit={(data) => createJourney("onboarding", data)}
        />
      )}
      {modal?.type === "new-offboarding" && (
        <NewJourneyModal
          type="offboarding"
          onClose={() => setModal(null)}
          presetEmployee={modal.payload || null}
          employeeOptions={employees
            .filter((employee) => employee.type === "onboarding")
            .filter((employee, index, list) =>
              list.findIndex((item) => (item.profileId || item.id) === (employee.profileId || employee.id)) === index
            )
            .filter((employee) =>
              !employees.some((item) => item.type === "offboarding" && item.profileId === (employee.profileId || employee.id) && item.progress < 100)
            )}
          onSubmit={(data) => createJourney("offboarding", data)}
        />
      )}
      {modal?.type === "employee" && (
        <EmployeeDetailModal
          employee={employees.find((employee) => employee.id === modal.payload.id) || modal.payload}
          onClose={() => setModal(null)}
          onToggleStep={toggleStep}
        />
      )}
      {modal?.type === "report" && (
        <ReportModal
          employees={employees}
          tasks={tasks}
          accessRequests={accessRequests}
          onClose={(fileName) => {
            setModal(null);
            if (fileName) flash(`Downloaded ${fileName}`);
          }}
        />
      )}
      {modal?.type === "add-hr-task" && <AddTaskModal employees={employees} onClose={() => setModal(null)} onSubmit={addCustomHrTask} />}
      {modal?.type === "upload-document" && <UploadDocumentModal employees={employees} presetEmployeeId={modal.payload?.employeeId || ""} onClose={() => setModal(null)} onSubmit={saveEmployeeDocument} />}
      {modal?.type === "schedule-orientation" && <ScheduleOrientationModal employees={employees} presetEmployeeId={modal.payload?.employeeId || ""} onClose={() => setModal(null)} onSubmit={saveOrientation} />}
      {modal?.type === "how" && <HowModal onClose={() => setModal(null)} />}
      {toast && (
        <div className="toast">
          <CheckCircle2 />
          {toast}
        </div>
      )}
    </div>
  );
}
