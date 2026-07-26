import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

let app, token, dataPath;
const seedPath = path.resolve("server/data/seed.json");
beforeAll(async()=>{
  dataPath=path.join(os.tmpdir(),`journeyone-test-${Date.now()}.json`);
  process.env.JOURNEYONE_DATA_PATH=dataPath;
  app=(await import("../server/app.js")).default;
});
beforeEach(async()=>{
  await fs.copyFile(seedPath,dataPath);
  const login=await request(app).post("/api/auth/login").send({email:"zainab@journeyone.local",password:"secret"});
  token=login.body.token;
});

describe("JourneyOne API",()=>{
  it("reports a healthy service",async()=>{const r=await request(app).get("/api/health");expect(r.status).toBe(200);expect(r.body.status).toBe("ok");});
  it("rejects protected endpoints without a token",async()=>{const r=await request(app).get("/api/bootstrap");expect(r.status).toBe(401);});
  it("creates a journey and automatically creates workflow tasks",async()=>{
    const employee={name:"Carter Jones",email:"carter@example.com",role:"Analyst",department:"Finance",type:"onboarding",startDate:"2026-08-01",steps:[{id:"assign-equipment",label:"Assign laptop",done:false},{id:"schedule-orientation",label:"Schedule orientation",done:false}]};
    const created=await request(app).post("/api/employees").set("Authorization",`Bearer ${token}`).send(employee);
    expect(created.status).toBe(201);
    const tasks=await request(app).get("/api/tasks").set("Authorization",`Bearer ${token}`);
    expect(tasks.body).toHaveLength(2);
    expect(tasks.body.some(t=>t.actionType==="EQUIPMENT_ASSIGNED")).toBe(true);
  });
  it("completes the matching task when a workflow action is completed",async()=>{
    const employee={name:"Carter Jones",email:"carter@example.com",role:"Analyst",department:"Finance",type:"onboarding",startDate:"2026-08-01",steps:[{id:"assign-equipment",label:"Assign laptop",done:false}]};
    const created=await request(app).post("/api/employees").set("Authorization",`Bearer ${token}`).send(employee);
    const step=await request(app).patch(`/api/employees/${created.body.id}/steps/assign-equipment`).set("Authorization",`Bearer ${token}`).send({details:{assetTag:"JO-100"}});
    expect(step.status).toBe(200); expect(step.body.progress).toBe(100);
    const tasks=await request(app).get("/api/tasks").set("Authorization",`Bearer ${token}`);
    expect(tasks.body[0].status).toBe("COMPLETED");
  });
  it("records auditable events",async()=>{
    const employee={name:"Carter Jones",email:"carter@example.com",role:"Analyst",department:"Finance",type:"onboarding",startDate:"2026-08-01",steps:[{id:"send-welcome",label:"Send welcome",done:false}]};
    await request(app).post("/api/employees").set("Authorization",`Bearer ${token}`).send(employee);
    const logs=await request(app).get("/api/audit-logs").set("Authorization",`Bearer ${token}`);
    expect(logs.status).toBe(200);expect(logs.body[0].action).toBe("EMPLOYEE_JOURNEY_CREATED");
  });
});
