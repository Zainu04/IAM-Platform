import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "journeyone-development-secret-change-me";

export function signUser(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email, name: user.name }, SECRET, { expiresIn: "8h" });
}

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Authentication required" });
  try { req.user = jwt.verify(token, SECRET); next(); }
  catch { return res.status(401).json({ error: "Invalid or expired token" }); }
}

export function allowRoles(...roles) {
  return (req, res, next) => roles.includes(req.user?.role)
    ? next()
    : res.status(403).json({ error: "You do not have permission to perform this action" });
}
