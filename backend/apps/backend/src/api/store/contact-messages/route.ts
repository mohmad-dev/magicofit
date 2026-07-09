import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { name, email, subject, message } = req.body as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      message: "All fields are required (name, email, subject, message).",
    });
  }

  try {
    const pgConnection = req.scope.resolve("pgConnection") as any;
    
    // Knex raw query
    await pgConnection.raw(`
      INSERT INTO contact_messages (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `, [name, email, subject, message]);

    return res.status(200).json({
      success: true,
      message: "Message received successfully.",
    });
  } catch (error: any) {
    console.error("Failed to save contact message:", error);
    return res.status(500).json({
      message: "Failed to save message. Please try again later.",
      error: error.message,
    });
  }
}
