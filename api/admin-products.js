import { requireAdmin } from "./_admin-auth.js";
import { readProducts, writeProducts } from "./_products-store.js";

function clean(value, max = 2000) {
  return String(value ?? "").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
}
function normalize(product) {
  const stock = Math.max(0, Math.floor(Number(product.stock) || 0));
  const requested = ["Available", "Out of Stock", "Hidden"].includes(product.availability) ? product.availability : "Available";
  return {
    id: clean(product.id, 100) || crypto.randomUUID(),
    name: clean(product.name, 160),
    description: clean(product.description, 2000),
    price: clean(product.price, 50),
    stock,
    imageUrl: clean(product.imageUrl, 2000),
    imageUrls: (Array.isArray(product.imageUrls) ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : [])).slice(0, 12).map(url => clean(url, 2000)).filter(url => /^https:\/\//.test(url)),
    enableAddToBag: product.enableAddToBag !== false,
    enableWishlist: product.enableWishlist !== false,
    enableBuyNow: product.enableBuyNow !== false,
    availability: stock === 0 && requested === "Available" ? "Out of Stock" : requested,
    updatedAt: new Date().toISOString()
  };
}
export default async function handler(req, res) {
  if (!(await requireAdmin(req, res))) return;
  try {
    if (req.method === "GET") return res.status(200).json({ products: await readProducts() });
    if (req.method === "PUT") {
      const input = req.body?.products;
      if (!Array.isArray(input) || input.length > 300) return res.status(400).json({ error: "Please send a valid product list." });
      const products = input.map(normalize).filter(p => p.name);
      await writeProducts(products);
      return res.status(200).json({ success: true, products });
    }
    res.setHeader("Allow", "GET, PUT");
    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Product catalogue error." });
  }
}
