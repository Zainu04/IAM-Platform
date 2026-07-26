import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const DEMO_ACCOUNTS = [
  { label: "IT Manager", email: "zainab@journeyone.local", role: "Full operational access" },
  { label: "HR Manager", email: "hr@journeyone.local", role: "Onboarding and employee records" },
  { label: "Auditor", email: "auditor@journeyone.local", role: "Read-only compliance access" },
];

export default function Login() {
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0].email);
  const [password, setPassword] = useState("secret");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in. Confirm that the API server is running.");
    }
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel" aria-label="JourneyOne introduction">
        <div className="login-brand-mark" aria-hidden="true">J<span>1</span></div>
        <div>
          <p className="eyebrow">Employee lifecycle management</p>
          <h1>Every arrival and departure, handled with confidence.</h1>
          <p className="login-brand-copy">JourneyOne connects HR, IT, equipment, access, tasks, and compliance in one coordinated workflow.</p>
        </div>
        <div className="login-feature-list">
          <div><Users aria-hidden="true" /><span>Role-based employee workflows</span></div>
          <div><ShieldCheck aria-hidden="true" /><span>Audit-ready actions and permissions</span></div>
          <div><LockKeyhole aria-hidden="true" /><span>Protected employee and access records</span></div>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <div className="login-card-heading">
            <div className="mobile-login-logo" aria-hidden="true">J<span>1</span></div>
            <p className="eyebrow">Secure workspace</p>
            <h2>Welcome back</h2>
            <p>Sign in to manage onboarding and offboarding journeys.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="login-email">Email address</label>
              <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" required />
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="password-field">
                <input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="btn-primary login-submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}<ArrowRight aria-hidden="true" />
            </button>
          </form>

          <div className="demo-account-section">
            <p>Demo accounts <span>Password: <strong>secret</strong></span></p>
            <div className="demo-account-grid">
              {DEMO_ACCOUNTS.map((account) => (
                <button key={account.email} type="button" onClick={() => { setEmail(account.email); setPassword("secret"); setError(""); }}>
                  <strong>{account.label}</strong>
                  <span>{account.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
