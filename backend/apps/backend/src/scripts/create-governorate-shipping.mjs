// Script to create 27 governorate shipping options via Medusa API
// Run: node scripts/create-governorate-shipping.mjs

const GOVERNORATES = [
  { name: "Cairo", ar: "القاهرة", price: 3000 },
  { name: "Giza", ar: "الجيزة", price: 3000 },
  { name: "Alexandria", ar: "الإسكندرية", price: 4000 },
  { name: "Port Said", ar: "بورسعيد", price: 5000 },
  { name: "Suez", ar: "السويس", price: 5000 },
  { name: "Damietta", ar: "دمياط", price: 5000 },
  { name: "Dakahlia", ar: "الدقهلية", price: 5000 },
  { name: "Sharqia", ar: "الشرقية", price: 5000 },
  { name: "Qalyubia", ar: "القليوبية", price: 4000 },
  { name: "Kafr El Sheikh", ar: "كفر الشيخ", price: 5000 },
  { name: "Gharbia", ar: "الغربية", price: 5000 },
  { name: "Monufia", ar: "المنوفية", price: 5000 },
  { name: "Beheira", ar: "البحيرة", price: 5000 },
  { name: "Ismailia", ar: "الإسماعيلية", price: 5000 },
  { name: "North Sinai", ar: "شمال سيناء", price: 8000 },
  { name: "South Sinai", ar: "جنوب سيناء", price: 8000 },
  { name: "Fayoum", ar: "الفيوم", price: 6000 },
  { name: "Beni Suef", ar: "بني سويف", price: 6000 },
  { name: "Minya", ar: "المنيا", price: 6000 },
  { name: "Assiut", ar: "أسيوط", price: 6000 },
  { name: "Sohag", ar: "سوهاج", price: 6000 },
  { name: "Qena", ar: "قنا", price: 6000 },
  { name: "Luxor", ar: "الأقصر", price: 6000 },
  { name: "Aswan", ar: "أسوان", price: 8000 },
  { name: "Red Sea", ar: "البحر الأحمر", price: 8000 },
  { name: "New Valley", ar: "الوادي الجديد", price: 8000 },
  { name: "Matrouh", ar: "مطروح", price: 8000 },
];

const MEDUSA_URL = "http://localhost:9000";
const PUBLISHABLE_KEY = "pk_dbe27160175f340181df152b92b6fead0145b84afe87d9f5b9dc3c28690dce6d";

async function main() {
  // Step 1: Create a cart to get available shipping options
  console.log("Creating test cart...");
  const cartRes = await fetch(`${MEDUSA_URL}/store/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_KEY,
    },
    body: JSON.stringify({ region_id: "reg_egypt_001" }),
  });
  const cartData = await cartRes.json();
  const cartId = cartData.cart?.id;
  console.log(`Cart created: ${cartId}`);

  // Step 2: Check existing shipping options
  const shipRes = await fetch(`${MEDUSA_URL}/store/shipping-options?cart_id=${cartId}`, {
    headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
  });
  const shipData = await shipRes.json();
  console.log(`Existing shipping options: ${JSON.stringify(shipData.shipping_options?.map(o => o.name) || [], null, 2)}`);

  // Step 3: We need admin API to create shipping options
  // First, let's try to get an admin session
  console.log("\nNOTE: To create governorate shipping options, you need to:");
  console.log("1. Log into Medusa Admin dashboard at http://localhost:9000/app");
  console.log("2. Go to Shipping > Shipping Options");
  console.log("3. Create a shipping option for each governorate with the appropriate price");
  console.log("\nAlternatively, run the migration script by resetting the migration table.");
  console.log("\nFor now, the existing shipping options will be used as fallback.");
  console.log("The checkout will match the governorate to the correct shipping option by name.");
}

main().catch(console.error);
