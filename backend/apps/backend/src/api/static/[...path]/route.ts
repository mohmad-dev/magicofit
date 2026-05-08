import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import fs from "fs";
import path from "path";

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
};

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return CONTENT_TYPE_BY_EXT[ext] || "application/octet-stream";
}

function safeJoin(baseDir: string, requestPath: string): string | null {
  const normalized = requestPath.replace(/\\/g, "/");
  const withoutLeadingSlash = normalized.replace(/^\/+/, "");

  if (!withoutLeadingSlash || withoutLeadingSlash.includes("..")) {
    return null;
  }

  const resolved = path.resolve(baseDir, withoutLeadingSlash);
  const baseResolved = path.resolve(baseDir);

  if (!resolved.startsWith(baseResolved + path.sep) && resolved !== baseResolved) {
    return null;
  }

  return resolved;
}

const STATIC_DIR_CANDIDATES = [
  path.join(process.cwd(), "static"),
  path.join(process.cwd(), ".medusa", "server", "static"),
  path.join(process.cwd(), ".medusa", "server", "public", "static"),
  path.join(process.cwd(), ".medusa", "server", "public", "uploads"),
  path.join(process.cwd(), "..", "static"),
  path.join(process.cwd(), "..", "..", "static"),
];

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const params = req.params as unknown as { path?: string[] };
  const requestedParts = Array.isArray(params.path) ? params.path : [];
  const requestedPath = requestedParts.join("/");

  for (const baseDir of STATIC_DIR_CANDIDATES) {
    const filePath = safeJoin(baseDir, requestedPath);
    if (!filePath) {
      continue;
    }

    try {
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) {
        continue;
      }

      res.setHeader("Content-Type", getContentType(filePath));
      res.setHeader("Content-Length", stat.size.toString());
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

      const stream = fs.createReadStream(filePath);
      stream.on("error", () => {
        res.status(404).end();
      });

      return stream.pipe(res);
    } catch {
      continue;
    }
  }

  return res.status(404).send("Not Found");
}
