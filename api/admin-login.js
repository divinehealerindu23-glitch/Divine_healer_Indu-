import { passwordMatches, issueAdminCookie, clearAdminCookie } from "./_admin-auth.js";

export default function handler(req, res) {
  if (req.method === "DELETE") {
    clearAdminCookie(res);
    return res.status(200).json({ success: true });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, DELETE");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const { password } = req.body || {};
  if (!passwordMatches(password)) return res.status(401).json({ error: "The password is not correct. Please try again." });
  issueAdminCookie(res);
  return res.status(200).json({ success: true });
}
