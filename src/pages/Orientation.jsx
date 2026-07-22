import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";

export default function Orientation(){
 const c=useOutletContext();
 const upcoming=useMemo(()=>c.employees.filter(e=>e.type==='onboarding'&&e.progress<100),[c.employees]);
 return <div className="page-content role-page"><div className="page-heading"><div><p className="eyebrow">HR workspace</p><h1>Orientation Planning</h1><p>Coordinate first-day sessions without exposing technical administration tools.</p></div><button className="btn-primary" onClick={c.startOnboarding}><CalendarDays/> Schedule orientation</button></div>
 <div className="role-metric-grid compact"><Metric icon={CalendarDays} value={upcoming.length} label="Upcoming starts"/><Metric icon={Clock3} value={upcoming.filter(e=>e.steps?.some(s=>s.id==='schedule-orientation'&&!s.done)).length} label="Need scheduling"/><Metric icon={Users} value={upcoming.filter(e=>e.steps?.some(s=>s.id==='schedule-orientation'&&s.done)).length} label="Scheduled"/></div>
 <div className="data-card"><div className="data-card-header"><h2>First-day schedule</h2><span className="pill gold">HR owned</span></div>{upcoming.map(e=>{const done=e.steps?.some(s=>s.id==='schedule-orientation'&&s.done);return <div className="role-list-row" key={e.id}><div className="date-badge"><strong>{new Date(e.startDate).toLocaleDateString('en-US',{month:'short'}).toUpperCase()}</strong><span>{new Date(e.startDate).getDate()}</span></div><div className="role-list-body"><strong>{e.name}</strong><span><MapPin size={14}/> Main office · {e.role}</span></div><button className={done?'btn-secondary':'btn-primary'} onClick={()=>c.openEmployee(e)}>{done?'View details':'Schedule'}</button></div>})}</div></div>
}
function Metric({icon:Icon,value,label}){return <div className="role-metric-card"><div className="metric-icon"><Icon/></div><strong>{value}</strong><span>{label}</span></div>}
