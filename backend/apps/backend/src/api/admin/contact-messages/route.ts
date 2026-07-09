import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const pgConnection = req.scope.resolve("pgConnection") as any;
    const result = await pgConnection.raw(`
      SELECT * FROM contact_messages ORDER BY created_at DESC
    `);
    
    // pg returns rows on .rows, Knex returns result directly in some dialects.
    const messages = result.rows || result;

    return res.status(200).json({
      messages,
    });
  } catch (error: any) {
    console.error("Failed to fetch contact messages:", error);
    return res.status(500).json({
      message: "Failed to fetch messages.",
      error: error.message,
    });
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { id } = req.query as { id: string };

  if (!id) {
    return res.status(400).json({
      message: "Message ID is required.",
    });
  }

  try {
    const pgConnection = req.scope.resolve("pgConnection") as any;
    await pgConnection.raw(`
      DELETE FROM contact_messages WHERE id = ?
    `, [id]);

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error: any) {
    console.error("Failed to delete contact message:", error);
    return res.status(500).json({
      message: "Failed to delete message.",
      error: error.message,
    });
  }
}
