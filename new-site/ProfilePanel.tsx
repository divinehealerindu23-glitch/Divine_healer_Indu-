import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile, User } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "./firebase";

type Booking = { id: string; service?: string; knot?: string; bookingId?: string; phone?: string; status?: string; consultationFee?: number; knotPrice?: number; createdAt?: { toDate?: () => Date } };

export default function ProfilePanel() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [orders, setOrders] = useState<Booking[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    if (!user) { setOrders([]); return; }
    let active = true;
    setLoadingOrders(true);
    getDocs(query(collection(db, "users", user.uid, "bookings"), orderBy("createdAt", "desc")))
      .then(snapshot => { if (active) setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Booking))); })
      .catch(() => { if (active) setError("Could not load your bookings. Please check that the Firestore security rules have been published."); })
      .finally(() => { if (active) setLoadingOrders(false); });
    return () => { active = false; };
  }, [user]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setNotice(""); setBusy(true);
    try {
      if (mode === "register") {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
        await sendEmailVerification(credential.user);
        setNotice("Account created. Please verify your email using the link we sent you.");
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        setNotice("You are signed in. Your bookings are shown below.");
      }
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message.replace("Firebase: ", "") : "We could not complete that request.");
    } finally { setBusy(false); }
  }

  async function resetPassword() {
    if (!email.trim()) { setError("Enter your email address first."); return; }
    setError(""); setNotice("");
    try { await sendPasswordResetEmail(auth, email.trim()); setNotice("Password reset link sent. Please check your email."); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not send reset email."); }
  }

  return <section id="profile" className="scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20">
    <div className="mx-auto max-w-5xl overflow-hidden rounded-[30px] border border-[rgba(212,175,55,.5)] bg-[linear-gradient(145deg,#32105B,#1A0833)] shadow-[0_25px_70px_rgba(0,0,0,.28)]">
      <div className="grid md:grid-cols-[.8fr_1.2fr]">
        <div className="p-7 sm:p-9"><p className="text-xs font-bold uppercase tracking-[.25em] text-[#F5D77B]">✦ Your private space</p><h2 className="mt-3 font-serif-display text-4xl font-bold text-white">My Profile</h2><p className="mt-4 leading-relaxed text-[#E5D8F5]">Sign in securely to view your booking history and keep your healing journey in one place.</p></div>
        <div className="bg-[#FBF8FF] p-6 text-[#28113F] sm:p-9">
          {user ? <div>
            <p className="text-sm text-gray-600">Signed in as</p><h3 className="mt-1 text-xl font-bold">{user.displayName || user.email}</h3><p className="text-sm text-gray-600">{user.email}</p>
            {!user.emailVerified && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Please verify your email. <button className="font-bold underline" onClick={() => sendEmailVerification(user).then(() => setNotice("Verification email sent again."))}>Resend verification email</button></p>}
            {notice && <p className="mt-3 text-sm text-green-700">{notice}</p>}
            <div className="mt-6 flex items-center justify-between"><h4 className="text-lg font-bold">My Bookings &amp; Orders</h4><button onClick={() => signOut(auth)} className="rounded-full border border-[#32105B] px-4 py-2 text-sm font-bold">Log out</button></div>
            {loadingOrders ? <p className="mt-4 text-sm text-gray-600">Loading your bookings…</p> : orders.length ? <div className="mt-4 space-y-3">{orders.map(o => <article key={o.id} className="rounded-2xl border border-purple-100 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{o.service || "Booking"}</strong><span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold">{o.status || "Request received"}</span></div>{o.knot && <p className="mt-1 text-sm text-gray-600">{o.knot}</p>}<p className="mt-2 text-xs text-gray-500">Booking reference: {o.bookingId || o.id}</p>{o.createdAt?.toDate && <p className="text-xs text-gray-500">{o.createdAt.toDate().toLocaleString()}</p>}<p className="mt-2 text-sm">Consultation: ₹{o.consultationFee ?? 300}{o.knotPrice ? ` • Knot: ₹${o.knotPrice}` : ""}</p></article>)}</div> : <p className="mt-4 rounded-xl bg-white p-4 text-sm text-gray-600">No bookings linked to this account yet. Sign in before submitting a booking to see it here.</p>}
          </div> : <form onSubmit={submit} className="space-y-3">
            <h3 className="text-xl font-bold">{mode === "login" ? "Customer Login" : "Create your account"}</h3>
            {mode === "register" && <><label className="block text-sm font-semibold" htmlFor="profile-name">Full name</label><input id="profile-name" value={name} onChange={e => setName(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="Your full name" /></>}
            <label className="block text-sm font-semibold" htmlFor="profile-email">Email address</label><input id="profile-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="you@example.com" />
            <label className="block text-sm font-semibold" htmlFor="profile-password">Password</label><input id="profile-password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} value={password} onChange={e => setPassword(e.target.value)} required className="w-full rounded-xl border border-gray-300 px-4 py-3" placeholder="At least 6 characters" />
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}{notice && <p className="rounded-xl bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
            <button disabled={busy} className="w-full rounded-full bg-[#32105B] px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}</button>
            <div className="flex flex-wrap justify-between gap-3 text-sm"><button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setNotice(""); }} className="font-bold text-purple-800 underline">{mode === "login" ? "Create an account" : "Already have an account? Log in"}</button>{mode === "login" && <button type="button" onClick={resetPassword} className="font-semibold underline">Forgot password?</button>}</div>
          </form>}
        </div>
      </div>
    </div>
  </section>;
}
