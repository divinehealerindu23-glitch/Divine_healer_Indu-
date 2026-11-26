export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }

  try {
    const keyId = process.env.raz_Live_API_Key;
    const keySecret = process.env.raz_Live_Key_Secret;
    if (!keyId || !keySecret) {
      return res.status(500).json({ success: false, error: "Razorpay is not configured on the server. Please contact the website administrator." });
    }

    const { name = "", service = "" } = req.body || {};
    const clean = value => String(value || "").trim().replace(/[\u0000-\u001F\u007F]/g, "").slice(0, 160);
    if (!clean(name) || !clean(service)) {
      return res.status(400).json({ success: false, error: "Please provide your name and choose a service." });
    }

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(keyId + ":" + keySecret).toString("base64"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: 30000,
        currency: "INR",
        receipt: "DHI-" + Date.now(),
        notes: { service: clean(service) }
      })
    });
    const order = await response.json();
    if (!response.ok || !order.id) {
      return res.status(502).json({ success: false, error: order?.error?.description || "Razorpay could not create a payment order. Please try again." });
    }

    return res.status(200).json({
      success: true,
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch {
    return res.status(500).json({ success: false, error: "Unable to start secure payment. Please try again." });
  }
}
