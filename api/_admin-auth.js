const OWNER_EMAIL = "divinehealerindu23@gmail.com";
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyBsGiw7l7gx26Ja_oBFqNj9OAorUNYSOus";

// Verify the Firebase ID token with Google's Identity Toolkit on every admin API call.
// The email is read from Google's verified token response, never from client-supplied data.
export async function requireAdmin(req, res) {
  const authorization = req.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    res.status(401).json({ error: "Please sign in with the owner account." });
    return false;
  }
  try {
    const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + FIREBASE_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: match[1] })
    });
    if (!response.ok) throw new Error("Invalid Firebase token");
    const data = await response.json();
    const account = data.users?.[0];
    const allowed = account?.email?.toLowerCase() === OWNER_EMAIL && account?.emailVerified === true && account?.disabled !== true;
    if (!allowed) {
      res.status(403).json({ error: "Stock Manager is reserved for the verified owner account." });
      return false;
    }
    return true;
  } catch {
    res.status(401).json({ error: "Your sign-in expired. Please sign in again." });
    return false;
  }
}
