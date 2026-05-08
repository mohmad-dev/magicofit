import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function POST(
  _req: MedusaRequest,
  res: MedusaResponse
) {
  res.status(404).json({ message: "Not Found" })
}
