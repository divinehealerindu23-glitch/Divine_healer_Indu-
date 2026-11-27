import crypto from "node:crypto";
import { list, put } from "@vercel/blob";
import { readProducts, writeProducts } from "./_products-store.js";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRjmMFfcRrroht49V_uS_WkvlmJHA-D8RrEPO1EHwLStD80IJyxTaQWg4EVsSEiRJciA/exec";
const TOKEN = () => process.env.BLOB_READ_WRITE_TOKEN;
const clean = (v, max=1000) => String(v ?? "").replace(/[\u0000-\u001F\u007F]/g," ").trim().slice(0,max);
const priceNumber = value => {
  const raw=String(value ?? "").replace(/[^0-9.]/g,"");
  const n=Number(raw);
  return Number.isFinite(n) && n>0 ? n : 0;
};
const auth = () => {
  const keyId=process.env.raz_Live_API_Key, keySecret=process.env.raz_Live_Key_Secret;
  if(!keyId||!keySecret) throw new Error("Online payments are not configured. Please contact the website administrator.");
  return {keyId,keySecret,header:"Basic "+Buffer.from(keyId+":"+keySecret).toString("base64")};
};
async function readBlobJson(path) {
  const result=await list({prefix:path,limit:1,token:TOKEN()});
  const blob=result.blobs?.find(x=>x.pathname===path);
  if(!blob)return null;
  const response=await fetch(blob.url,{cache:"no-store"});
  if(!response.ok)throw new Error("Could not read the pending order.");
  return response.json();
}
async function writeBlobJson(path,data) {
  return put(path,JSON.stringify(data),{access:"public",token:TOKEN(),addRandomSuffix:false,allowOverwrite:true,contentType:"application/json",cacheControlMaxAge:0});
}
async function razorpay(path, options={}) {
  const {header}=auth();
  const response=await fetch("https://api.razorpay.com/v1"+path,{...options,headers:{Authorization:header,...(options.headers||{})}});
  const data=await response.json();
  if(!response.ok)throw new Error(data?.error?.description||"Razorpay could not process the request.");
  return data;
}
export default async function handler(req,res) {
  if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({success:false,error:"Method not allowed."});}
  try {
    const body=req.body||{};
    if(body.action==="create") {
      const {keyId}=auth();
      if(!Array.isArray(body.items)||!body.items.length||body.items.length>12) return res.status(400).json({success:false,error:"Please add between 1 and 12 products to your bag."});
      const products=await readProducts();
      const items=[];
      let amount=0;
      for(const raw of body.items) {
        const id=clean(raw.id,100), quantity=Number(raw.quantity);
        const product=products.find(p=>p.id===id && p.availability==="Available");
        if(!product) return res.status(400).json({success:false,error:"One of the selected products is no longer available. Please refresh your bag."});
        if(!Number.isInteger(quantity)||quantity<1||quantity>product.stock) return res.status(400).json({success:false,error:"The available stock for "+product.name+" has changed. Please update your bag."});
        const unitPrice=priceNumber(product.price);
        if(!unitPrice) return res.status(400).json({success:false,error:"A valid price is required for "+product.name+". Please contact Indu."});
        items.push({id:product.id,name:clean(product.name,160),quantity,unitPrice});
        amount+=Math.round(unitPrice*100)*quantity;
      }
      if(!Number.isSafeInteger(amount)||amount<100) return res.status(400).json({success:false,error:"The order total is invalid."});
      const order=await razorpay("/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        amount,currency:"INR",receipt:"DHI-SHOP-"+Date.now(),notes:{store:"Divine Healer Indu"}
      })});
      await writeBlobJson("products/pending-orders/"+order.id+".json",{orderId:order.id,amount,currency:"INR",items,createdAt:new Date().toISOString()});
      return res.status(200).json({success:true,keyId,orderId:order.id,amount:order.amount,currency:order.currency});
    }

    if(body.action==="verify") {
      const {keySecret}=auth();
      const orderId=clean(body.razorpay_order_id,100), paymentId=clean(body.razorpay_payment_id,100), signature=clean(body.razorpay_signature,200);
      if(!orderId||!paymentId||!signature)return res.status(400).json({success:false,error:"Payment verification details are missing."});
      const expected=crypto.createHmac("sha256",keySecret).update(orderId+"|"+paymentId).digest("hex");
      const a=Buffer.from(signature),b=Buffer.from(expected);
      if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(400).json({success:false,error:"Payment signature verification failed."});
      const existing=await readBlobJson("products/paid-orders/"+orderId+".json");
      if(existing?.success)return res.status(200).json({success:true,orderId,alreadyConfirmed:true});
      const pending=await readBlobJson("products/pending-orders/"+orderId+".json");
      if(!pending||pending.orderId!==orderId)return res.status(400).json({success:false,error:"This order could not be found. Please contact Indu with your payment ID."});
      const order=await razorpay("/orders/"+encodeURIComponent(orderId));
      if(order.amount!==pending.amount||order.currency!=="INR"||order.status!=="paid"&&order.status!=="created")return res.status(400).json({success:false,error:"The payment order does not match this product purchase."});
      let payment=await razorpay("/payments/"+encodeURIComponent(paymentId));
      if(payment.order_id!==orderId||payment.amount!==pending.amount||payment.currency!=="INR")return res.status(400).json({success:false,error:"Payment details do not match this product order."});
      if(payment.status==="authorized")payment=await razorpay("/payments/"+encodeURIComponent(paymentId)+"/capture",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:pending.amount,currency:"INR"})});
      if(payment.status!=="captured")return res.status(402).json({success:false,error:"Payment has not been captured. Your order is not confirmed yet."});

      const customer=body.customer||{};
      const name=clean(customer.name,120),phone=clean(customer.phone,40),address=clean(customer.address,500),email=clean(customer.email,160);
      if(!name||phone.replace(/\D/g,"").length<10||!address)return res.status(400).json({success:false,error:"Payment was received, but customer details are incomplete. Please contact Indu with payment ID "+paymentId+"."});
      const itemText=pending.items.map(x=>x.name+" × "+x.quantity+" @ ₹"+x.unitPrice).join("; ");
      const message=clean(["Online product order", "Order ID: "+orderId, "Items: "+itemText, "Total paid: ₹"+(pending.amount/100), "Payment ID: "+paymentId, "Delivery address: "+address, email?"Email: "+email:""].filter(Boolean).join(" | "),1800);
      const upstream=await fetch(APPS_SCRIPT_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({name,phone,service:"Online Product Order",message}),redirect:"follow"});
      const raw=await upstream.text(); let saved;
      try{saved=JSON.parse(raw);}catch{throw new Error("Payment succeeded, but order details could not be recorded. Please contact Indu with payment ID "+paymentId+".");}
      if(!upstream.ok||!saved.success)throw new Error(saved.error||"Payment succeeded, but the order could not be recorded. Please contact Indu with payment ID "+paymentId+".");

      let stockUpdated=true;
      try {
        const current=await readProducts();
        const next=current.map(p=>{
          const item=pending.items.find(x=>x.id===p.id);
          if(!item)return p;
          const stock=Math.max(0,Number(p.stock||0)-item.quantity);
          return {...p,stock,availability:stock===0?"Out of Stock":p.availability,updatedAt:new Date().toISOString()};
        });
        await writeProducts(next);
      } catch { stockUpdated=false; }
      await writeBlobJson("products/paid-orders/"+orderId+".json",{success:true,orderId,paymentId,amount:pending.amount,stockUpdated,confirmedAt:new Date().toISOString()});
      return res.status(200).json({success:true,orderId,paymentId,amountPaid:pending.amount/100,stockUpdated});
    }
    return res.status(400).json({success:false,error:"Unknown shop order action."});
  } catch(error) {
    return res.status(502).json({success:false,error:error instanceof Error?error.message:"Unable to process this product order."});
  }
}
