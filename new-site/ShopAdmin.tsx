import React, { useEffect, useState } from "react";
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

export function ShopSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/products").then(r => r.ok ? r.json() : Promise.reject()).then(data => setProducts(data.products || [])).catch(() => setProducts([])).finally(() => setLoading(false));
  }, []);
  return <section id="shop" className="scroll-mt-24 border-y border-[rgba(212,175,55,.3)] bg-[linear-gradient(180deg,#1A0833,#2A0A4A)] px-4 py-16 sm:px-6 sm:py-20">
    <div className="mx-auto max-w-7xl">
      <div className="text-center"><p className="text-xs font-extrabold uppercase tracking-[.28em] text-[#D4AF37]">✦ The Divine Collection</p><h2 className="font-serif-display mt-3 text-[clamp(2rem,5vw,3.3rem)] font-bold">Healing <span className="italic" style={{color:gold}}>Products</span></h2><p className="mx-auto mt-3 max-w-2xl leading-relaxed text-[#D8CBE8]">Explore products selected with care. Message Indu on WhatsApp to enquire or place an order.</p></div>
      {loading ? <p className="mt-10 text-center text-[#D8CBE8]">Loading the collection…</p> : products.length === 0 ? <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-[rgba(212,175,55,.35)] bg-white/5 p-8 text-center"><ShoppingBag className="mx-auto text-[#D4AF37]" size={34}/><p className="mt-3 font-semibold">The collection is being prepared.</p><p className="mt-1 text-sm text-[#D8CBE8]">Please check back soon or contact Indu directly.</p><a className="mt-5 inline-flex rounded-full bg-[#D4AF37] px-5 py-3 font-bold text-[#2A0A4A]" href={whatsapp} target="_blank" rel="noreferrer">Enquire on WhatsApp</a></div> :
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map(product => <article key={product.id} className="overflow-hidden rounded-[26px] border border-[rgba(212,175,55,.4)] bg-[rgba(255,255,255,.06)] shadow-[0_18px_45px_rgba(0,0,0,.2)]">
        <div className="aspect-[4/3] overflow-hidden bg-[#12031F]">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center text-[#D4AF37]"><Package size={48}/></div>}</div>
        <div className="p-6"><div className="flex items-start justify-between gap-3"><h3 className="font-serif-display text-2xl font-bold">{product.name}</h3><span className="shrink-0 rounded-full border border-[rgba(212,175,55,.5)] px-3 py-1 text-sm font-bold text-[#F1D98B]">{product.price ? (product.price.match(/[₹$€£]/) ? product.price : "₹"+product.price) : "Price on request"}</span></div><p className="mt-3 min-h-12 text-sm leading-relaxed text-[#D8CBE8]">{product.description}</p><p className="mt-4 text-xs uppercase tracking-wider text-[#D4AF37]">{product.stock > 0 ? "In stock" : "Limited availability"}</p><a href={whatsapp+"?text="+encodeURIComponent("Namaste Indu, I would like to enquire about: "+product.name+(product.price ? " (Price: "+product.price+")" : ""))} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center rounded-full bg-[#D4AF37] px-5 py-3 font-extrabold text-[#2A0A4A]">Book Now on WhatsApp</a></div>
      </article>)}</div>}
    </div>
  </section>;
}

export function AdminPortal() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product>(blankProduct());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");

  async function loadProducts() {
    const r = await fetch("/api/admin-products");
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Could not load products.");
    setProducts(data.products || []);
  }
  async function login(e: React.FormEvent) {
    e.preventDefault(); setChecking(true); setError("");
    try {
      const r = await fetch("/api/admin-login", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Incorrect password.");
      setLoggedIn(true); setPassword(""); await loadProducts();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in."); }
    finally { setChecking(false); }
  }
  async function saveProducts(next: Product[]) {
    const r = await fetch("/api/admin-products",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({products:next})});
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
    if(!file.type.startsWith("image/")) {setError("Please choose an image file.");return;}
    if(file.size>3*1024*1024) {setError("Please choose an image smaller than 3 MB.");return;}
    setUploading(true);setError("");
    try {
      const base64=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(",")[1]);reader.onerror=reject;reader.readAsDataURL(file);});
      const r=await fetch("/api/admin-upload",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:file.name,mimeType:file.type,base64})});
      const data=await r.json();if(!r.ok)throw new Error(data.error||"Image upload failed.");
      setEditing(p=>({...p,imageUrl:data.url}));setNotice("Product image uploaded.");
    } catch(e){setError(e instanceof Error?e.message:"Image upload failed.");}
    finally{setUploading(false);}
  }
  async function removeProduct(id:string) {
    if(!window.confirm("Delete this product from your catalogue?"))return;
    try{await saveProducts(products.filter(p=>p.id!==id));if(editing.id===id)setEditing(blankProduct());setNotice("Product deleted.");}
    catch(e){setError(e instanceof Error?e.message:"Could not delete product.");}
  }
  async function logout() {
    await fetch("/api/admin-login",{method:"DELETE"});setLoggedIn(false);setProducts([]);setEditing(blankProduct());
  }
  const input="mt-2 w-full rounded-xl border border-[#d7c8e7] bg-white px-4 py-3 text-[#241331] outline-none focus:border-[#B68A24]";
  return <div className="min-h-screen bg-[#160624] px-4 py-8 text-[#F7F0FF] sm:px-6">
    <div className="mx-auto max-w-6xl">
      <header className="mb-8 flex items-center justify-between gap-4 border-b border-[rgba(212,175,55,.35)] pb-5"><div><a href="/" className="text-xs uppercase tracking-[.2em] text-[#D4AF37]">← Divine Healer Indu</a><h1 className="font-serif-display mt-2 text-3xl font-bold sm:text-4xl">Product Admin</h1><p className="mt-1 text-sm text-[#CBBAD9]">Manage your collection, prices, stock and availability.</p></div>{loggedIn&&<button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] px-4 py-2 text-sm font-bold text-[#F1D98B]"><LogOut size={16}/> Sign out</button>}</header>
      {!loggedIn ? <form onSubmit={login} className="mx-auto mt-16 max-w-md rounded-[28px] border border-[rgba(212,175,55,.45)] bg-white/5 p-7 shadow-2xl"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#D4AF37] text-[#D4AF37]"><Boxes size={26}/></div><h2 className="font-serif-display mt-5 text-center text-2xl font-bold">Admin access</h2><p className="mt-2 text-center text-sm text-[#CBBAD9]">Sign in to manage your Divine Collection.</p><label className="mt-6 block text-sm font-bold" htmlFor="admin-password">Admin password</label><input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className={input} required/><button disabled={checking} className="mt-5 w-full rounded-full bg-[#D4AF37] px-5 py-3 font-extrabold text-[#241331] disabled:opacity-60">{checking?"Signing in…":"Sign in securely"}</button>{error&&<p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}</form> :
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
        <form onSubmit={saveProduct} className="h-fit rounded-[26px] border border-[rgba(212,175,55,.4)] bg-white/5 p-6">
          <div className="flex items-center justify-between gap-3"><h2 className="font-serif-display text-2xl font-bold">{editing.id?"Edit product":"Add a product"}</h2><button type="button" onClick={()=>{setEditing(blankProduct());setError("");}} className="text-sm text-[#F1D98B]">Clear form</button></div>
          <label className="mt-5 block text-sm font-bold">Product name<input className={input} value={editing.name} onChange={e=>setEditing(p=>({...p,name:e.target.value}))} placeholder="e.g. Crystal Healing Set" required/></label>
          <label className="mt-4 block text-sm font-bold">Description<textarea className={input} rows={3} value={editing.description} onChange={e=>setEditing(p=>({...p,description:e.target.value}))} placeholder="Describe your product…"/></label>
          <div className="mt-4 grid grid-cols-2 gap-4"><label className="block text-sm font-bold">Price<input className={input} value={editing.price} onChange={e=>setEditing(p=>({...p,price:e.target.value}))} placeholder="e.g. 999"/></label><label className="block text-sm font-bold">Stock quantity<input className={input} type="number" min="0" step="1" value={editing.stock} onChange={e=>setEditing(p=>({...p,stock:Math.max(0,Number(e.target.value))}))}/></label></div>
          <label className="mt-4 block text-sm font-bold">Availability<select className={input} value={editing.availability} onChange={e=>setEditing(p=>({...p,availability:e.target.value as Product["availability"]}))}><option>Available</option><option>Out of Stock</option><option>Hidden</option></select></label>
          <div className="mt-5"><span className="text-sm font-bold">Product image</span><div className="mt-2 flex items-center gap-4">{editing.imageUrl?<img src={editing.imageUrl} alt="Product preview" className="h-24 w-24 rounded-xl object-cover"/>:<div className="grid h-24 w-24 place-items-center rounded-xl border border-dashed border-[#9E86B5] text-[#D4AF37]"><ImagePlus size={28}/></div>}<label className="cursor-pointer rounded-full border border-[#D4AF37] px-4 py-2 text-sm font-bold text-[#F1D98B]">{uploading?"Uploading…":<><Upload className="mr-2 inline" size={15}/>Upload image</>}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={e=>uploadImage(e.target.files?.[0])}/></label></div><p className="mt-2 text-xs text-[#CBBAD9]">JPG, PNG or WebP • maximum 3 MB</p></div>
          {error&&<p role="alert" className="mt-4 rounded-xl bg-red-950/60 p-3 text-sm text-red-200">{error}</p>}{notice&&<p className="mt-4 rounded-xl bg-emerald-950/60 p-3 text-sm text-emerald-200">{notice}</p>}
          <button disabled={saving||uploading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 font-extrabold text-[#241331] disabled:opacity-60"><Save size={17}/>{saving?"Saving…":"Save product"}</button>
        </form>
        <section><div className="mb-4 flex items-center justify-between"><h2 className="font-serif-display text-2xl font-bold">Stock manager</h2><span className="rounded-full border border-[#D4AF37]/50 px-3 py-1 text-sm text-[#F1D98B]">{products.length} products</span></div>
          {products.length===0?<div className="rounded-2xl border border-dashed border-[#806A91] p-8 text-center text-[#CBBAD9]"><Package className="mx-auto mb-3 text-[#D4AF37]" size={32}/>No products yet. Add your first product using the form.</div>:<div className="space-y-3">{products.map(p=><article key={p.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-4">{p.imageUrl?<img src={p.imageUrl} alt="" className="h-16 w-16 rounded-xl object-cover"/>:<div className="grid h-16 w-16 place-items-center rounded-xl bg-black/20 text-[#D4AF37]"><Package/></div>}<div className="min-w-0"><h3 className="truncate font-bold">{p.name}</h3><p className="text-sm text-[#CBBAD9]">{p.price ? "₹"+p.price.replace(/^₹/,"") : "Price on request"} • Stock: {p.stock}</p><span className="mt-1 inline-block text-xs text-[#F1D98B]">{p.availability}</span></div></div><div className="flex flex-wrap gap-2"><button onClick={()=>{setEditing(p);setError("");setNotice("");window.scrollTo({top:0,behavior:"smooth"});}} className="rounded-full border border-[#D4AF37] px-4 py-2 text-sm font-bold text-[#F1D98B]">Edit</button><button onClick={()=>saveProducts(products.map(x=>x.id===p.id?{...x,stock:Math.max(0,x.stock-1),availability:x.stock-1<=0?"Out of Stock":x.availability}:x))} className="rounded-full border border-white/20 px-3 py-2 text-sm">−1</button><button onClick={()=>saveProducts(products.map(x=>x.id===p.id?{...x,stock:x.stock+1,availability:x.availability==="Out of Stock"?"Available":x.availability}:x))} className="rounded-full border border-white/20 px-3 py-2 text-sm">+1</button><button onClick={()=>removeProduct(p.id)} aria-label={"Delete "+p.name} className="rounded-full border border-red-400/40 px-3 py-2 text-red-300"><Trash2 size={16}/></button></div></article>)}</div>}
          <div className="mt-5 rounded-2xl border border-[rgba(212,175,55,.25)] bg-white/5 p-4 text-sm text-[#CBBAD9]"><p className="flex items-center gap-2 font-bold text-[#F1D98B]"><Eye size={16}/> Store visibility</p><p className="mt-1">Only products marked “Available” with stock above zero appear in the public shop. Choose “Hidden” to keep a product private.</p></div>
        </section>
      </div>}
      <p className="mt-12 text-center text-xs text-[#8F7B9E]">Divine Healer Indu • Secure product administration</p>
    </div>;
}
