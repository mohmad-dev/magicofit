import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { randomUUID } from "crypto";

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
    const clientType = pgConnection.client.config.client || "";
    const isSqlite = clientType.includes("sqlite") || (pgConnection.client.driverName && pgConnection.client.driverName.includes("sqlite"));
    
    // Ensure table exists
    if (isSqlite) {
      await pgConnection.raw(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
    } else {
      await pgConnection.raw(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id UUID PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `);
    }
    
    const id = randomUUID();
    const createdAt = new Date().toISOString();

    // Knex raw query
    await pgConnection.raw(`
      INSERT INTO contact_messages (id, name, email, subject, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, name, email, subject, message, createdAt]);

    return res.status(200).json({
      success: true,
      message: "Message received successfully.",
    });
  } catch (error: any) {
    console.error("Failed to save contact message:", error);
    return res.status(500).json({
      message: error.message || "Failed to save message. Please try again later.",
      error: error.message,
    });
  }
}
