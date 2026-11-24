import { list, put } from "@vercel/blob";

const CATALOG_PATH = "products/catalog.json";

export async function readProducts() {
  const result = await list({ prefix: CATALOG_PATH, limit: 1 });
  const blob = result.blobs?.find(item => item.pathname === CATALOG_PATH);
  if (!blob) return [];
  const response = await fetch(blob.url, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not read the product catalogue.");
  const data = await response.json();
  return Array.isArray(data.products) ? data.products : [];
}

export async function writeProducts(products) {
  await put(CATALOG_PATH, JSON.stringify({ products, updatedAt: new Date().toISOString() }), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60
  });
  return products;
}
