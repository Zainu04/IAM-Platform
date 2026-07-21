import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopNavbar from './TopNavbar.jsx';

const pageTitles = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/onboarding': 'Onboarding',
  '/offboarding': 'Offboarding',
  '/equipment': 'Equipment Inventory',
  '/department-access': 'Department Access',
  '/access-requests': 'Access Requests',
  '/notifications': 'Notifications',
  '/reports': 'Reports',
  '/settings': 'Settings'
};

<<<<<<< Updated upstream
function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell">
        <TopNavbar title={title} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
=======
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
    { id: "exit-interview", label: "Complete exit interview", description: "Record the departure reason, interview notes, and handoff feedback.", icon: "message" },
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
            : "Choose an existing employee so their name, photo, role, access, and equipment remain connected."
      }
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim() && role.trim() && date && (onboarding || selectedEmployee)) {
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
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Priya Sharma" required readOnly={!onboarding} />
        </div>
        <div className="field">
          <label>Email address</label>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="e.g. priya.sharma@company.com" required readOnly={!onboarding} />
        </div>
        <div className="field">
          <label>Role / Title</label>
          <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Product Designer" required readOnly={!onboarding} />
        </div>
        <div className="field">
          <label>Department</label>
          <input value={department} onChange={(event) => setDepartment(event.target.value)} placeholder="e.g. Design" readOnly={!onboarding} />
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
          <div className="saved-profile-note">Complete an onboarding journey first. Employees must exist in the directory before offboarding can begin.</div>
        )}
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!onboarding && !selectedEmployee}>
            <UserPlus /> {onboarding ? "Start Onboarding" : "Start Offboarding"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EmployeeDetailModal({employee,onClose,onToggleStep}){if(!employee)return null;const progress=Math.round(employee.steps.filter(s=>s.done).length/employee.steps.length*100);return <Modal title={employee.name} subtitle={`${employee.role} · ${employee.startLabel}`} onClose={onClose}><div className="progress-block"><div className="label">Journey progress</div><div className="progress-bar-row"><div className="progress-track"><div className={`progress-fill ${employee.type==="offboarding"?"offboarding":""}`} style={{width:`${progress}%`}}/></div><span className="progress-pct">{progress}%</span></div></div><div className="step-checklist">{employee.steps.map(s=><button key={s.id} className={`step-item ${s.done?"done":""}`} onClick={()=>onToggleStep(employee.id,s.id)}><span className="dot">{s.done&&<Check/>}</span>{s.label}</button>)}</div><div className="modal-actions"><button className="btn-secondary" onClick={onClose}>Close</button></div></Modal>}
function ReportModal({onClose,employees,tasks,accessRequests}){const [type,setType]=useState("onboarding");function dl(){let rows=[],name="report.csv";if(type==="onboarding"){rows=employees.filter(e=>e.type==="onboarding").map(e=>({Name:e.name,Role:e.role,Start:e.startLabel,Progress:`${e.progress}%`}));name="onboarding-report.csv"}else if(type==="offboarding"){rows=employees.filter(e=>e.type==="offboarding").map(e=>({Name:e.name,Role:e.role,LastDay:e.startLabel,Progress:`${e.progress}%`}));name="offboarding-report.csv"}else if(type==="tasks"){rows=tasks.map(t=>({Task:t.label,Category:t.subLabel,Priority:t.priority,Status:t.done?"Done":"Open"}));name="tasks-report.csv"}else{rows=accessRequests.map(a=>({Name:a.name,System:a.system,Requested:a.requested,Status:a.status}));name="access-requests-report.csv"}const headers=rows.length?Object.keys(rows[0]):[];const csv=[headers.join(","),...rows.map(r=>headers.map(h=>`"${String(r[h]).replace(/"/g,'""')}"`).join(","))].join("\n");const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);onClose(name)}return <Modal title="Generate Report" subtitle="Choose a report to create and download as CSV." onClose={()=>onClose()}><div className="field"><label>Report type</label><select value={type} onChange={e=>setType(e.target.value)}><option value="onboarding">Onboarding summary</option><option value="offboarding">Offboarding summary</option><option value="tasks">Task list</option><option value="access">Access requests</option></select></div><div className="modal-actions"><button className="btn-secondary" onClick={()=>onClose()}>Cancel</button><button className="btn-primary" onClick={dl}><Download/>Download CSV</button></div></Modal>}
function HowModal({onClose}){return <Modal title="How JourneyOne works" subtitle="A simple workflow behind every hire and every exit." onClose={onClose} width={480}><div className="step-checklist">{["Start a journey","Coordinate access and equipment","Track every required step","Export reports for stakeholders"].map((x,i)=><div className="step-item" key={x}><span className="dot done-dot">{i+1}</span><div><strong>{x}</strong></div></div>)}</div><div className="modal-actions"><button className="btn-primary full" onClick={onClose}>Got it</button></div></Modal>}

export default function Layout() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(() =>
    normalizeEmployees(load("jo-employees", INITIAL_EMPLOYEES))
  );
  const [tasks, setTasks] = useState(() => load("jo-tasks", INITIAL_TASKS));
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
  const [currentUser, setCurrentUser] = useState(() =>
    load("jo-user", {
      name: "Zainab Akhtar",
      firstName: "Zainab",
      title: "IT Manager",
      avatar: "https://i.pravatar.cc/100?img=45",
    })
  );
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");

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
      { id: "exit-interview", label: "Complete exit interview", description: "Record the departure reason, interview notes, and handoff feedback.", icon: "message", done: false },
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
    setModal(null);
    flash(`${type === "onboarding" ? "Onboarding" : "Offboarding"} started for ${name}.`);

    if (type === "onboarding") {
      navigate(`/onboarding/${id}`);
    } else {
      navigate(`/offboarding/${id}`);
    }
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
    navigate,
    openEmployee,
    completeOnboardingStep,
    completeOffboardingStep,
    startOnboarding: () => setModal({ type: "new-onboarding" }),
    startOffboarding: () => setModal({ type: "new-offboarding" }),
    startOffboardingFor: (employee) =>
      setModal({ type: "new-offboarding", payload: employee }),
    generateReport: () => setModal({ type: "report" }),
    showHow: () => setModal({ type: "how" }),
    toggleTask: (id) =>
      setTasks((previous) =>
        previous.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task
        )
      ),
    decideAccess: (id, status) => {
      setAccessRequests((previous) =>
        previous.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );
      flash(`Access request ${status.toLowerCase()}.`);
    },
    markEquipment: (id, status = "Assigned") => {
      setEquipment((previous) =>
        previous.map((item) => (item.id === id ? { ...item, status } : item))
      );
      flash("Equipment status updated.");
    },
    addEquipment: (item) =>
      setEquipment((previous) => [
        { id: `eq-${Date.now()}`, ...item },
        ...previous,
      ]),
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
    signOut: () => flash("You have been signed out of this demo."),
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
            .filter((employee) => employee.type === "onboarding" && employee.progress === 100)
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
      {modal?.type === "how" && <HowModal onClose={() => setModal(null)} />}
      {toast && (
        <div className="toast">
          <CheckCircle2 />
          {toast}
        </div>
      )}
>>>>>>> Stashed changes
    </div>
  );
}

export default Layout;
