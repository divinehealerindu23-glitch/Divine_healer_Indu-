import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "./firebase";
import { ArrowLeft, ImagePlus, LogOut, Package, Plus, Save, ShoppingBag, Trash2, Upload, Boxes, Eye, EyeOff } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  imageUrl: string;
  availability: "Available" | "Out of Stock" | "Hidden";
  updatedAt?: string;
};

const blankProduct = (): Product => ({ id: "", name: "", description: "", price: "", stock: 0, imageUrl: "", availability: "Available" });
const gold = "#D4AF37";
const whatsapp = "https://wa.me/918920702407";
const OWNER_EMAIL = "divinehealerindu23@gmail.com";

export function ShopSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/products").then(r => r.ok ? r.json() : Promise.reject()).then(data => setProducts(data.products || [])).catch(() => setProducts([])).finally(() => setLoading(false));
  }, []);

  return <section id="shop" className="relative isolate scroll-mt-24 overflow-hidden border-y border-[rgba(212,175,55,.34)] bg-[radial-gradient(ellipse_at_50%_0%,rgba(108,65,139,.34),transparent_52%),linear-gradient(180deg,#170526_0%,#241039_48%,#170526_100%)] px-4 py-20 sm:px-6 sm:py-24">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-30" style={{backgroundImage:"radial-gradient(circle at 12% 22%,rgba(245,214,123,.18) 0 1px,transparent 2px),radial-gradient(circle at 82% 16%,rgba(201,167,235,.22) 0 1px,transparent 2px),radial-gradient(circle at 72% 76%,rgba(245,214,123,.16) 0 1px,transparent 2px)",backgroundSize:"110px 110px,150px 150px,180px 180px"}} />
    <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-12 -z-10 h-80 w-80 rounded-full border border-[#D4AF37]/20 opacity-50 sm:h-[28rem] sm:w-[28rem]"><div className="absolute inset-5 rounded-full border border-[#C9A7EB]/20"/><div className="absolute inset-12 rounded-full border border-[#D4AF37]/20"/><div className="absolute inset-20 rounded-full border border-[#C9A7EB]/15"/></div>
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/40 bg-[#2A0A4A]/60 px-5 py-2 text-[10px] font-extrabold uppercase tracking-[.32em] text-[#F5D67B] shadow-[0_8px_35px_rgba(0,0,0,.18)]"><span>✧</span> Curated with intention <span>✧</span></div>
        <p className="font-cormorant text-lg italic tracking-[.12em] text-[#D9C4F0]">A little magic for your everyday rituals</p>
        <h2 className="font-serif-display mt-2 text-[clamp(2.6rem,6vw,4.7rem)] font-semibold leading-[1.05] text-[#FFF9EE]">The Divine <span className="gold-text italic">Collection</span></h2>
        <div className="mx-auto mt-6 flex max-w-xs items-center gap-3"><span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/70"/><Sparkles size={17} className="text-[#F5D67B]"/><span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/70"/></div>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#D8CBE8] sm:text-base">Thoughtfully chosen spiritual essentials and intention-led pieces, selected by Indu to accompany your personal journey.</p>
      </div>

      {loading ? <div className="mt-14 flex flex-col items-center gap-4 text-[#D8CBE8]"><span className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37]/25 border-t-[#F5D67B]"/><p className="font-cormorant text-xl italic">Opening the collection…</p></div> :
      products.length === 0 ? <div className="relative mx-auto mt-14 max-w-xl rounded-[2rem] border border-[#D4AF37]/35 bg-[linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.025))] px-7 py-12 text-center shadow-[0_25px_70px_rgba(0,0,0,.24)]"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#D4AF37]/50 bg-[#2A0A4A] text-[#F5D67B] shadow-[0_0_35px_rgba(212,175,55,.13)]"><ShoppingBag size={27}/></div><p className="font-serif-display mt-5 text-2xl font-semibold text-[#FFF9EE]">A beautiful collection is on its way</p><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#D8CBE8]">New treasures are being prepared with care. Contact Indu for current offerings and personal recommendations.</p><a className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#E4C66B] bg-gradient-to-r from-[#E8CE83] to-[#C79B38] px-6 py-3 text-sm font-extrabold text-[#241035] shadow-[0_8px_28px_rgba(212,175,55,.2)] transition hover:-translate-y-0.5" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Enquire with Indu</a></div> :
      <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">{products.map((product, index) => <article key={product.id} className="group relative overflow-hidden rounded-[1.7rem] border border-[#D4AF37]/35 bg-[linear-gradient(155deg,rgba(255,255,255,.09),rgba(255,255,255,.025)_48%,rgba(201,167,235,.06))] p-[1px] shadow-[0_22px_55px_rgba(0,0,0,.25)] transition duration-500 hover:-translate-y-1.5 hover:border-[#F5D67B]/75 hover:shadow-[0_28px_65px_rgba(0,0,0,.36)]">
        <div className="overflow-hidden rounded-[calc(1.7rem-1px)] bg-[#21102F]">
          <div className="relative aspect-[4/4.4] overflow-hidden bg-[#12031F]">
            {product.imageUrl ? <img src={product.imageUrl} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.055]"/> : <div className="grid h-full place-items-center text-[#D4AF37]"><Package size={52} strokeWidth={1.2}/></div>}
            <div className="absolute inset-0 bg-gradient-to-t from-[#160625]/75 via-transparent to-[#160625]/10"/>
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-[#F5D67B]/50 bg-[#1B082D]/80 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.2em] text-[#F5D67B] backdrop-blur-md"><Sparkles size={11}/> Selected by Indu</div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3"><span className="font-cormorant text-lg italic text-white/90">A mindful choice</span><span className="rounded-full border border-[#F5D67B]/65 bg-[#1B082D]/85 px-3.5 py-2 text-sm font-bold text-[#F5D67B] shadow-lg backdrop-blur-md">{product.price ? (product.price.match(/[₹$€£]/) ? product.price : "₹"+product.price) : "Price on request"}</span></div>
          </div>
          <div className="relative p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2"><span className="h-px w-7 bg-[#D4AF37]/75"/><span className="text-[9px] font-extrabold uppercase tracking-[.25em] text-[#C9A7EB]">The Divine Edit · {String(index + 1).padStart(2,"0")}</span></div>
            <h3 className="font-serif-display text-[1.65rem] font-semibold leading-tight text-[#FFF9EE]">{product.name}</h3>
            <p className="mt-3 min-h-[3.5rem] text-[13px] leading-6 text-[#D8CBE8]">{product.description || "A thoughtfully selected addition to your spiritual practice."}</p>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#D4AF37]/20 pt-4"><span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#D9C4F0]"><span className="h-1.5 w-1.5 rounded-full bg-[#B7D6A1] shadow-[0_0_9px_rgba(183,214,161,.8)]"/>{product.stock > 0 && product.stock <= 3 ? "Limited pieces" : "Available to order"}</span><span className="font-cormorant text-sm italic text-[#F5D67B]">Made meaningful</span></div>
            <a href={whatsapp+"?text="+encodeURIComponent("Namaste Indu, I would love to know more about: "+product.name+(product.price ? " (Price: "+product.price+")" : ""))} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center gap-2 rounded-full border border-[#E4C66B] bg-gradient-to-r from-[#E8CE83] via-[#D4AF37] to-[#C79B38] px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#241035] shadow-[0_8px_24px_rgba(212,175,55,.16)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(212,175,55,.28)]"><MessageCircle size={15}/> Enquire on WhatsApp</a>
          </div>
        </div>
      </article>)}</div>}
      <div className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-3 border-t border-[#D4AF37]/20 pt-8 text-center sm:mt-16"><p className="font-cormorant text-xl italic text-[#E7D9F4]">“Choose with intention. Welcome with gratitude.”</p><p className="text-[9px] font-bold uppercase tracking-[.28em] text-[#BCA7D2]">Personal assistance · Delhi appointments · WhatsApp orders</p><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-[#F5D67B] transition hover:text-white"><MessageCircle size={15}/> Speak with Indu <span aria-hidden="true">↗</span></a></div>
    </div>
  </section>;
}

export function AdminPortal() {
  const [email, setEmail] = useState(OWNER_EMAIL);
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const loggedIn = Boolean(user && user.email?.toLowerCase() === OWNER_EMAIL && user.emailVerified);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product>(blankProduct());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");

  async function adminHeaders(json = true) {
    const current = auth.currentUser;
    if (!current || current.email?.toLowerCase() !== OWNER_EMAIL || !current.emailVerified) throw new Error("Please sign in with the verified owner account.");
    const token = await current.getIdToken();
    return { ...(json ? { "Content-Type": "application/json" } : {}), Authorization: "Bearer " + token };
  }
  async function loadProducts() {
    const r = await fetch("/api/admin-products", { headers: await adminHeaders(false) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Could not load products.");
    setProducts(data.products || []);
  }
  async function login(e: React.FormEvent) {
    e.preventDefault(); setChecking(true); setError("");
    try {
      if (email.trim().toLowerCase() !== OWNER_EMAIL) throw new Error("Only the owner email account can access Stock Manager.");
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (credential.user.email?.toLowerCase() !== OWNER_EMAIL) { await signOut(auth); throw new Error("This account is not authorised."); }
      if (!credential.user.emailVerified) throw new Error("Please verify the owner email address first, then sign in again.");
      setUser(credential.user); setPassword(""); await loadProducts();
    } catch (e) { setError(e instanceof Error ? e.message.replace("Firebase: ", "") : "Unable to sign in."); }
    finally { setChecking(false); }
  }
  useEffect(() => onAuthStateChanged(auth, async current => {
    if (current?.email?.toLowerCase() === OWNER_EMAIL && current.emailVerified) {
      setUser(current);
      try { await loadProducts(); } catch (e) { setError(e instanceof Error ? e.message : "Could not load products."); }
    } else {
      setUser(null); setProducts([]);
    }
  }), []);
  async function saveProducts(next: Product[]) {
    const r = await fetch("/api/admin-products",{method:"PUT",headers:await adminHeaders(),body:JSON.stringify({products:next})});
    const data=await r.json(); if(!r.ok) throw new Error(data.error || "Could not save catalogue.");
    setProducts(data.products || next);
  }
  async function saveProduct(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      if(!editing.name.trim()) throw new Error("Please enter a product name.");
      const product={...editing,id:editing.id || (typeof crypto!=="undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now())),name:editing.name.trim(),description:editing.description.trim(),price:editing.price.trim(),stock:Math.max(0,Number(editing.stock)||0),availability:editing.stock<=0 && editing.availability==="Available" ? "Out of Stock" as const : editing.availability,updatedAt:new Date().toISOString()};
      const next=[...products.filter(p=>p.id!==product.id),product];
      await saveProducts(next); setEditing(blankProduct()); setNotice("Product saved successfully.");
    } catch(e) {setError(e instanceof Error?e.message:"Could not save product.");}
    finally {setSaving(false);}
  }
  async function uploadImage(file?: File) {
    if(!file) return;
    setError(""); setNotice("");
    if(!file.type.startsWith("image/")) {setError("Please choose an image file.");return;}
    if(file.size>3*1024*1024) {setError("Please choose an image smaller than 3 MB.");return;}
    setUploading(true);setNotice("Uploading your image…");
    try {
      const base64=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>{const result=String(reader.result||"");const comma=result.indexOf(",");if(comma<0)reject(new Error("Could not read the selected image. Please try again."));else resolve(result.slice(comma+1));};reader.onerror=()=>reject(new Error("Could not read the selected image. Please try again."));reader.readAsDataURL(file);});
      const r=await fetch("/api/admin-upload",{method:"POST",headers:await adminHeaders(),body:JSON.stringify({filename:file.name,mimeType:file.type||"image/jpeg",base64})});
      const responseText=await r.text();
      let data:any={};
      try { data=JSON.parse(responseText); } catch { throw new Error("The upload server returned an unexpected response (HTTP "+r.status+"). Please try again."); }
      if(!r.ok) throw new Error(data.error||("Image upload failed (HTTP "+r.status+")."));
      if(typeof data.url!=="string" || !data.url.startsWith("https://")) throw new Error("The image was received, but the server did not return a valid image link. Please try again.");
      setEditing(p=>({...p,imageUrl:data.url}));setNotice("Product image uploaded successfully. You can now save the product.");
    } catch(e){setNotice("");setError(e instanceof Error?e.message:"Image upload failed. Please try again.");}
    finally{setUploading(false);}
  }
  async function removeProduct(id:string) {
    if(!window.confirm("Delete this product from your catalogue?"))return;
    try{await saveProducts(products.filter(p=>p.id!==id));if(editing.id===id)setEditing(blankProduct());setNotice("Product deleted.");}
    catch(e){setError(e instanceof Error?e.message:"Could not delete product.");}
  }
  async function logout() {
    await signOut(auth);setUser(null);setProducts([]);setEditing(blankProduct());
  }
  const input="mt-2 w-full rounded-xl border border-[#d7c8e7] bg-white px-4 py-3 text-[#241331] outline-none focus:border-[#B68A24]";
  return <div className="min-h-screen bg-[#160624] px-4 py-8 text-[#F7F0FF] sm:px-6">
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex items-center justify-between gap-4 border-b border-[rgba(212,175,55,.35)] pb-5"><div><a href="/" className="text-xs uppercase tracking-[.2em] text-[#D4AF37]">← Divine Healer Indu</a><h1 className="font-serif-display mt-2 text-3xl font-bold sm:text-4xl">Product Admin</h1><p className="mt-1 text-sm text-[#CBBAD9]">Manage your collection, prices, stock and availability.</p></div>{loggedIn&&<button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] px-4 py-2 text-sm font-bold text-[#F1D98B]"><LogOut size={16}/> Sign out</button>}</header>
      {!loggedIn ? <form onSubmit={login} className="mx-auto mt-16 max-w-md rounded-[28px] border border-[rgba(212,175,55,.45)] bg-white/5 p-7 shadow-2xl"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#D4AF37] text-[#D4AF37]"><Boxes size={26}/></div><h2 className="font-serif-display mt-5 text-center text-2xl font-bold">Admin access</h2><p className="mt-2 text-center text-sm text-[#CBBAD9]">Only the verified owner account can manage products and stock.</p><label className="mt-6 block text-sm font-bold" htmlFor="admin-email">Owner email</label><input id="admin-email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} className={input} required/><label className="mt-4 block text-sm font-bold" htmlFor="admin-password">Account password</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className={input} required/><button disabled={checking} className="mt-5 w-full rounded-full bg-[#D4AF37] px-5 py-3 font-extrabold text-[#241331] disabled:opacity-60">{checking?"Signing in…":"Sign in with owner account"}</button>{error&&<p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}</form> :
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <form onSubmit={saveProduct} className="h-fit rounded-[26px] border border-[rgba(212,175,55,.4)] bg-white/5 p-6">
          <div className="flex items-center justify-between gap-3"><h2 className="font-serif-display text-2xl font-bold">{editing.id?"Edit product":"Add a product"}</h2><button type="button" onClick={()=>{setEditing(blankProduct());setError("");}} className="text-sm text-[#F1D98B]">Clear form</button></div>
          <label className="mt-5 block text-sm font-bold">Product name<input className={input} value={editing.name} onChange={e=>setEditing(p=>({...p,name:e.target.value}))} placeholder="e.g. Crystal Healing Set" required/></label>
          <label className="mt-4 block text-sm font-bold">Description<textarea className={input} rows={3} value={editing.description} onChange={e=>setEditing(p=>({...p,description:e.target.value}))} placeholder="Describe your product…"/></label>
          <div className="mt-4 grid grid-cols-2 gap-4"><label className="block text-sm font-bold">Price<input className={input} value={editing.price} onChange={e=>setEditing(p=>({...p,price:e.target.value}))} placeholder="e.g. 999"/></label><label className="block text-sm font-bold">Stock quantity<input className={input} type="number" min="0" step="1" value={editing.stock} onChange={e=>setEditing(p=>({...p,stock:Math.max(0,Number(e.target.value))}))}/></label></div>
          <label className="mt-4 block text-sm font-bold">Availability<select className={input} value={editing.availability} onChange={e=>setEditing(p=>({...p,availability:e.target.value as Product["availability"]}))}><option>Available</option><option>Out of Stock</option><option>Hidden</option></select></label>
          <div className="mt-5"><span className="text-sm font-bold">Product image</span><div className="mt-2 flex items-center gap-4">{editing.imageUrl?<img src={editing.imageUrl} alt="Product preview" className="h-24 w-24 rounded-xl object-cover"/>:<div className="grid h-24 w-24 place-items-center rounded-xl border border-dashed border-[#9E86B5] text-[#D4AF37]"><ImagePlus size={28}/></div>}<label className="cursor-pointer rounded-full border border-[#D4AF37] px-4 py-2 text-sm font-bold text-[#F1D98B]">{uploading?"Uploading…":<><Upload className="mr-2 inline" size={15}/>Upload image</>}<input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif" className="hidden" disabled={uploading} onChange={e=>{const file=e.currentTarget.files?.[0];e.currentTarget.value="";void uploadImage(file);}}/></label></div><p className="mt-2 text-xs text-[#CBBAD9]">Choose a photo from your phone or computer • JPG, PNG, WebP or GIF • maximum 3 MB</p></div>
          {error&&<p role="alert" className="mt-4 rounded-xl bg-red-950/60 p-3 text-sm text-red-200">{error}</p>}{notice&&<p className="mt-4 rounded-xl bg-emerald-950/60 p-3 text-sm text-emerald-200">{notice}</p>}
          <button disabled={saving||uploading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 font-extrabold text-[#241331] disabled:opacity-60"><Save size={17}/>{saving?"Saving…":"Save product"}</button>
        </form>
        <section><div className="mb-4 flex items-center justify-between"><h2 className="font-serif-display text-2xl font-bold">Stock manager</h2><span className="rounded-full border border-[#D4AF37]/50 px-3 py-1 text-sm text-[#F1D98B]">{products.length} products</span></div>
          {products.length===0?<div className="rounded-2xl border border-dashed border-[#806A91] p-8 text-center text-[#CBBAD9]"><Package className="mx-auto mb-3 text-[#D4AF37]" size={32}/>No products yet. Add your first product using the form.</div>:<div className="space-y-3">{products.map(p=><article key={p.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-4">{p.imageUrl?<img src={p.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover"/>:<div className="grid h-16 w-16 place-items-center rounded-xl bg-black/20 text-[#D4AF37]"><Package/></div>}<div className="min-w-0"><h3 className="truncate font-bold">{p.name}</h3><p className="text-sm text-[#CBBAD9]">{p.price ? "₹"+p.price.replace(/^₹/,"") : "Price on request"} • Stock: {p.stock}</p><span className="mt-1 inline-block text-xs text-[#F1D98B]">{p.availability}</span></div></div><div className="flex flex-wrap gap-2"><button onClick={()=>{setEditing(p);setError("");setNotice("");window.scrollTo({top:0,behavior:"smooth"});}} className="rounded-full border border-[#D4AF37] px-4 py-2 text-sm font-bold text-[#F1D98B]">Edit</button><button onClick={()=>saveProducts(products.map(x=>x.id===p.id?{...x,stock:Math.max(0,x.stock-1),availability:x.stock-1<=0?"Out of Stock":x.availability}:x))} className="rounded-full border border-white/20 px-3 py-2 text-sm">−1</button><button onClick={()=>saveProducts(products.map(x=>x.id===p.id?{...x,stock:x.stock+1,availability:x.availability==="Out of Stock"?"Available":x.availability}:x))} className="rounded-full border border-white/20 px-3 py-2 text-sm">+1</button><button onClick={()=>removeProduct(p.id)} aria-label={"Delete "+p.name} className="rounded-full border border-red-400/40 px-3 py-2 text-red-300"><Trash2 size={16}/></button></div></article>)}</div>}
          <div className="mt-5 rounded-2xl border border-[rgba(212,175,55,.25)] bg-white/5 p-4 text-sm text-[#CBBAD9]"><p className="flex items-center gap-2 font-bold text-[#F1D98B]"><Eye size={16}/> Store visibility</p><p className="mt-1">Only products marked “Available” with stock above zero appear in the public shop. Choose “Hidden” to keep a product private.</p></div>
        </section>
      </div>}
      <p className="mt-12 text-center text-xs text-[#8F7B9E]">Divine Healer Indu • Secure product administration</p>
    </div></div>;
}
