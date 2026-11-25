const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzRjmMFfcRrroht49V_uS_WkvlmJHA-D8RrEPO1EHwLStD80IJyxTaQWg4EVsSEiRJciA/exec";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }

  try {
    const { name, phone, service, readingOption = "", readingFee = 0, knot = "", consultationFee = 0, knotPrice = 0, totalFee = 0, message = "" } = req.body || {};
    const clean = (value, max = 1000) => String(value || "").trim().replace(/[\u0000-\u001F\u007F]/g, "").slice(0, max);
    const booking = {
      name: clean(name, 120),
      phone: clean(phone, 40),
      service: clean(service, 160),
      message: clean([readingOption ? `Reading option: ${clean(readingOption, 100)}` : "", Number(readingFee) > 0 ? `Reading fee: ₹${Number(readingFee)}` : "", knot ? `Knot: ${clean(knot, 100)}` : "", Number(consultationFee) === 300 ? "Consultation fee: ₹300" : "", Number(knotPrice) === 550 ? "Knot price: ₹550" : "", `Total: ₹${Number(totalFee) || 0}`, message].filter(Boolean).join(" | "), 1000)
    };

    if (!booking.name || !booking.phone || !booking.service) {
      return res.status(400).json({ success: false, error: "Please provide your name, phone number, and service." });
    }
    if (booking.phone.replace(/\D/g, "").length < 10) {
      return res.status(400).json({ success: false, error: "Please enter a valid phone number with at least 10 digits." });
    }

    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(booking),
      redirect: "follow"
    });
    const raw = await upstream.text();
    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      throw new Error("The booking sheet did not return a valid response. Please try WhatsApp directly.");
    }

    if (!upstream.ok || !result.success) {
      throw new Error(result.error || "The booking request could not be saved.");
    }

    return res.status(200).json({ success: true, bookingId: result.bookingId });
  } catch (error) {
    return res.status(502).json({
      success: false,
      error: error instanceof Error ? error.message : "Unable to save your request right now."
    });
  }
}
