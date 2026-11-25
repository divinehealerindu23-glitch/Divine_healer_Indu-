import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile, User } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ChevronDown, ClipboardList, Package, UserRound, LogOut, X } from "lucide-react";
import { auth, db } from "./firebase";

type Booking = { id: string; service?: string; knot?: string; bookingId?: string; phone?: string; status?: string; consultationFee?: number; readingFee?: number; knotPrice?: number; totalFee?: number; readingOption?: string; createdAt?: { toDate?: () => Date } };

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
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"profile" | "orders">("profile");
  const isOwner = user?.email?.toLowerCase() === "divinehealerindu23@gmail.com";

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    if (!user) { setOrders([]); return; }
    let active = true;
    setLoadingOrders(true);
    getDocs(query(collection(db, "users", user.uid, "bookings"), orderBy("createdAt", "desc")))
      .then(snapshot => { if (active) setOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Booking))); })
      .catch(() => { if (active) setError("Could not load your orders. Please check the Firestore security rules."); })
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
        setNotice("You are signed in.");
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

  return <div className="relative shrink-0">
    <button type="button" onClick={() => setOpen(v => !v)} aria-expanded={open} className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)] bg-[rgba(27,5,48,.72)] px-3 py-2 text-sm font-bold text-[var(--gold-soft)] shadow-lg hover:bg-[rgba(212,175,55,.14)]">
      <UserRound size={17}/><span className="hidden sm:inline">{user ? (user.displayName || "My Account") : "My Profile"}</span><ChevronDown size={15}/>
    </button>
    {open && <div className="absolute left-0 top-full z-[60] mt-3 w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-[rgba(212,175,55,.55)] bg-[#FBF8FF] text-[#28113F] shadow-[0_20px_60px_rgba(0,0,0,.4)]">
      <div className="flex items-center justify-between border-b border-purple-100 bg-[#32105B] px-4 py-3 text-white"><div><p className="text-xs uppercase tracking-widest text-[#F5D77B]">Your private space</p><p className="font-bold">{user ? (user.displayName || user.email) : "Welcome"}</p></div><button type="button" aria-label="Close profile menu" onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-white/10"><X size={18}/></button></div>
      {user ? <div className="p-4">
        <div className={`mb-4 grid ${isOwner ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
          <button type="button" onClick={() => setTab("profile")} className={`rounded-xl px-3 py-2 text-sm font-bold ${tab === "profile" ? "bg-[#32105B] text-white" : "bg-purple-50 text-[#32105B]"}`}><UserRound className="mr-1 inline" size={15}/> My Profile</button>
          <button type="button" onClick={() => setTab("orders")} className={`rounded-xl px-3 py-2 text-sm font-bold ${tab === "orders" ? "bg-[#32105B] text-white" : "bg-purple-50 text-[#32105B]"}`}><ClipboardList className="mr-1 inline" size={15}/> Order Details</button>
          {isOwner && <a href="/admin" className="rounded-xl bg-amber-100 px-2 py-2 text-center text-sm font-bold text-[#32105B]"><Package className="mr-1 inline" size={15}/> Stock Manager</a>}
        </div>
        {tab === "profile" ? <div>
          <p className="text-sm text-gray-600">Signed in as</p><p className="font-bold">{user.email}</p>
          {!user.emailVerified && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Please verify your email. <button className="font-bold underline" onClick={() => sendEmailVerification(user).then(() => setNotice("Verification email sent again."))}>Resend verification email</button></p>}
          {isOwner && !user.emailVerified && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Your owner email must be verified before you can manage products. Use the verification link sent to your inbox, then sign out and sign in again.</p>}
          {isOwner && user.emailVerified && <p className="mt-3 text-xs text-green-700">Owner access confirmed. Stock Manager is available in the tab above.</p>}
          {notice && <p className="mt-3 text-sm text-green-700">{notice}</p>}
        </div> : <div>
          <div className="flex items-center justify-between"><h3 className="font-bold">My Orders &amp; Bookings</h3><span className="text-xs text-gray-500">{orders.length} records</span></div>
          {loadingOrders ? <p className="mt-3 text-sm text-gray-600">Loading your order details…</p> : orders.length ? <div className="mt-3 max-h-[50vh] space-y-3 overflow-y-auto">{orders.map(o => <article key={o.id} className="rounded-xl border border-purple-100 bg-white p-3"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{o.service || "Booking"}</strong><span className="rounded-full bg-purple-50 px-2 py-1 text-xs font-bold">{o.status || "Request received"}</span></div>{o.readingOption && <p className="mt-1 text-sm text-gray-600">{o.readingOption}</p>}{o.knot && <p className="mt-1 text-sm text-gray-600">{o.knot}</p>}<p className="mt-2 text-xs text-gray-500">Reference: {o.bookingId || o.id}</p>{o.createdAt?.toDate && <p className="text-xs text-gray-500">{o.createdAt.toDate().toLocaleString()}</p>}<div className="mt-2 space-y-1 text-sm text-gray-700">{typeof o.consultationFee === "number" && <p>Consultation: ₹{o.consultationFee}</p>}{typeof o.readingFee === "number" && o.readingFee > 0 && <p>Service charge: ₹{o.readingFee}</p>}{typeof o.knotPrice === "number" && o.knotPrice > 0 && <p>Product charge: ₹{o.knotPrice}</p>}<p className="border-t border-gray-100 pt-1 font-bold">Total: ₹{o.totalFee ?? ((o.consultationFee || 0) + (o.readingFee || 0) + (o.knotPrice || 0))}</p></div></article>)}</div> : <p className="mt-3 rounded-xl bg-purple-50 p-3 text-sm text-gray-600">No orders linked to this account yet. Sign in before submitting a booking to see it here.</p>}
        </div>}
        <button onClick={() => signOut(auth)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#32105B] px-4 py-2 text-sm font-bold"><LogOut size={15}/> Log out</button>
      </div> : <form onSubmit={submit} className="space-y-3 p-4">
        <h3 className="font-bold">{mode === "login" ? "Customer Login" : "Create your account"}</h3>
        {mode === "register" && <label className="block text-sm font-semibold">Full name<input value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2" placeholder="Your full name"/></label>}
        <label className="block text-sm font-semibold">Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2" placeholder="you@example.com"/></label>
        <label className="block text-sm font-semibold">Password<input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2" placeholder="At least 6 characters"/></label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}{notice && <p className="rounded-xl bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
        <button disabled={busy} className="w-full rounded-full bg-[#32105B] px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}</button>
        <div className="flex flex-wrap justify-between gap-3 text-sm"><button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setNotice(""); }} className="font-bold text-purple-800 underline">{mode === "login" ? "Create an account" : "Already have an account? Log in"}</button>{mode === "login" && <button type="button" onClick={resetPassword} className="font-semibold underline">Forgot password?</button>}</div>
      </form>}
    </div>}
  </div>;
}
