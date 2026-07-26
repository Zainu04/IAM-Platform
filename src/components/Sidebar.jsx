import { NavLink } from "react-router-dom";
import {
  Home, Users, UserPlus, LogOut, ShieldCheck, Monitor,
  Bell, BarChart2, Settings, ChevronDown, ScrollText, FileText,
  CalendarDays, UserCog, ListChecks, Activity, Building2
} from "lucide-react";

const roleItems = {
  HR_MANAGER: [
    {to:"/",label:"Dashboard",icon:Home,end:true},
    {to:"/employees",label:"Employees",icon:Users},
    {to:"/onboarding",label:"Onboarding",icon:UserPlus},
    {to:"/offboarding",label:"Offboarding",icon:LogOut},
    {to:"/documents",label:"Documents",icon:FileText},
    {to:"/orientation",label:"Orientation",icon:CalendarDays},
    {to:"/tasks",label:"HR Tasks",icon:ListChecks},
    {to:"/notifications",label:"Notifications",icon:Bell},
    {to:"/reports",label:"HR Reports",icon:BarChart2},
  ],
  IT_MANAGER: [
    {to:"/",label:"Dashboard",icon:Home,end:true},
    {to:"/equipment",label:"Equipment",icon:Monitor},
    {to:"/accounts",label:"Accounts",icon:UserCog},
    {to:"/access-requests",label:"Access Requests",icon:ShieldCheck},
    {to:"/department-access",label:"Department Access",icon:Building2},
    {to:"/tasks",label:"IT Tasks",icon:ListChecks},
    {to:"/notifications",label:"Notifications",icon:Bell},
  ],
  AUDITOR: [
    {to:"/",label:"Dashboard",icon:Home,end:true},
    {to:"/audit-history",label:"Audit History",icon:Activity},
    {to:"/compliance",label:"Compliance",icon:ScrollText},
    {to:"/reports",label:"Reports",icon:BarChart2},
  ],
};

export default function Sidebar({ currentUser }) {
  const visibleItems = roleItems[currentUser.role] || roleItems.IT_MANAGER;
  const initials = currentUser.name?.split(" ").map((part) => part[0]).join("").slice(0,2).toUpperCase() || "JO";
  return <aside className="sidebar">
    <div className="sidebar-brand"><img className="sidebar-brand-logo" src="/journeyone-logo.png" alt="JourneyOne logo"/><div><h1>JourneyOne</h1><p>Every journey. Seamlessly managed.</p></div></div>
    <div className="role-workspace-label">{currentUser.title} Workspace</div>
    <nav className="sidebar-nav">{visibleItems.map(({to,label,icon:Icon,end})=><NavLink key={to} to={to} end={end} className={({isActive})=>`nav-item ${isActive?"active":""}`}><Icon/>{label}</NavLink>)}</nav>
    <div className="sidebar-spacer"><svg className="sidebar-illustration" viewBox="0 0 220 260" fill="none" aria-hidden="true"><path d="M20 250 C 60 210, 40 190, 80 160 S 140 120, 120 90 S 180 40, 160 10" stroke="#c9922f" strokeWidth="2.5" strokeDasharray="6 6"/><circle cx="160" cy="10" r="6" fill="#d4a24c"/></svg></div>
    <div className="sidebar-footer"><NavLink className="nav-item" to="/settings"><Settings/>Settings</NavLink><NavLink className="sidebar-user" to="/settings">{currentUser.avatar?<img src={currentUser.avatar} alt=""/>:<span className="profile-initials">{initials}</span>}<div className="info"><strong>{currentUser.name}</strong><span>{currentUser.title}</span></div><ChevronDown size={14}/></NavLink></div>
  </aside>;
}
