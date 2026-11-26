import crypto from "node:crypto";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRjmMFfcRrroht49V_uS_WkvlmJHA-D8RrEPO1EHwLStD80IJyxTaQWg4EVsSEiRJciA/exec";
const AMOUNT_PAISE = 30000;

function clean(value, max = 1000) {
  return String(value || "").trim().replace(/[\u0000-\u001F\u007F]/g, "").slice(0, max);
}

function razorpayAuth() {
  const keyId = process.env.raz_Live_API_Key;
  const keySecret = process.env.raz_Live_Key_Secret;
  if (!keyId || !keySecret) throw new Error("Razorpay is not configured on the server. Please contact the website administrator.");
  return { keyId, keySecret, authorization: "Basic " + Buffer.from(keyId + ":" + keySecret).toString("base64") };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }

  try {
    const { keySecret, authorization } = razorpayAuth();
    const { name, phone, service, readingOption = "", knot = "", message = "", razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    const booking = {
      name: clean(name, 120),
      phone: clean(phone, 40),
      service: clean(service, 160),
      readingOption: clean(readingOption, 100),
      knot: clean(knot, 100),
      message: clean(message, 1000)
    };

    if (!booking.name || !booking.phone || !booking.service) {
      return res.status(400).json({ success: false, error: "Please provide your name, phone number, and service." });
    }
    if (booking.phone.replace(/\D/g, "").length < 10) {
      return res.status(400).json({ success: false, error: "Please enter a valid phone number with at least 10 digits." });
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: "Payment verification details are missing. No booking was confirmed." });
    }

    const expected = crypto.createHmac("sha256", keySecret).update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");
    const providedBuffer = Buffer.from(String(razorpay_signature));
    const expectedBuffer = Buffer.from(expected);
    if (providedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
      return res.status(400).json({ success: false, error: "Payment signature could not be verified. No booking was confirmed." });
    }

    const paymentResponse = await fetch("https://api.razorpay.com/v1/payments/" + encodeURIComponent(razorpay_payment_id), {
      headers: { Authorization: authorization }
    });
    const payment = await paymentResponse.json();
    if (!paymentResponse.ok || payment.order_id !== razorpay_order_id || payment.amount !== AMOUNT_PAISE || payment.currency !== "INR") {
      return res.status(400).json({ success: false, error: "Payment details do not match this ₹300 booking. No booking was confirmed." });
    }

    let finalPayment = payment;
    if (payment.status === "authorized") {
      const captureResponse = await fetch("https://api.razorpay.com/v1/payments/" + encodeURIComponent(razorpay_payment_id) + "/capture", {
        method: "POST",
        headers: { Authorization: authorization, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: AMOUNT_PAISE, currency: "INR" })
      });
      finalPayment = await captureResponse.json();
      if (!captureResponse.ok) {
        return res.status(502).json({ success: false, error: "Payment was authorised but capture is still pending. Please contact Indu with payment ID " + razorpay_payment_id + "." });
      }
    }
    if (finalPayment.status !== "captured") {
      return res.status(402).json({ success: false, error: "Razorpay has not confirmed a captured payment yet. Your appointment is not confirmed; please contact Indu if money was deducted." });
    }

    const sheetBooking = {
      name: booking.name,
      phone: booking.phone,
      service: booking.service,
      message: clean([
        booking.readingOption ? "Reading option: " + booking.readingOption : "",
        booking.knot ? "Knot: " + booking.knot : "",
        "Consultation and booking fee: ₹300",
        "Payment ID: " + razorpay_payment_id,
        "Payment status: captured",
        booking.message
      ].filter(Boolean).join(" | "), 1000)
    };

    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(sheetBooking),
      redirect: "follow"
    });
    const raw = await upstream.text();
    let result;
    try { result = JSON.parse(raw); }
    catch { throw new Error("Payment succeeded, but the booking sheet did not return a valid response. Please contact Indu with payment ID " + razorpay_payment_id + "."); }

    if (!upstream.ok || !result.success) {
      throw new Error(result.error || "Payment succeeded, but the booking could not be saved. Please contact Indu with payment ID " + razorpay_payment_id + ".");
    }

    return res.status(200).json({
      success: true,
      bookingId: result.bookingId,
      paymentId: razorpay_payment_id,
      amountPaid: 300,
      status: "confirmed"
    });
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: error instanceof Error ? error.message : "Unable to verify payment or save the booking."
    });
  }
}
