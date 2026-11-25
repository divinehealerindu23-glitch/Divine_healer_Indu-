import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "./_admin-auth.js";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return;
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  try {
    const { filename, mimeType, base64 } = req.body || {};
    if (!allowed.has(mimeType) || typeof base64 !== "string") return res.status(400).json({ error: "Please upload a JPG, PNG, WebP or GIF image." });
    const buffer = Buffer.from(base64, "base64");
    if (!buffer.length || buffer.length > 3 * 1024 * 1024) return res.status(400).json({ error: "Image must be smaller than 3 MB." });
    const ext = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1];
    const safeName = String(filename || "product").replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 50);
    const blob = await put("products/images/" + safeName + "-" + randomUUID() + "." + ext, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
      contentType: mimeType
    });
    return res.status(200).json({ url: blob.url });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Image upload failed." });
  }
}
