import { readProducts } from "./_products-store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed." });
  }
  try {
    const products = (await readProducts()).filter(p => p.availability === "Available" && Number(p.stock) > 0);
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Could not load products." });
  }
}
