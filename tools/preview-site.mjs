// Minimal, dependency-free static file server for local preview (npm run preview).
// Serves the repo root with no-store caching so edits show up immediately, and
// refuses to serve anything outside the repo. Port: PORT env, argv[2], or 4173.

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number.parseInt(process.env.PORT || process.argv[2] || "4173", 10);
const host = process.env.HOST || "127.0.0.1";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"]
]);

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const decodedPath = decodeURIComponent(url.pathname);
  const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(root, safePath);
}

const server = createServer((request, response) => {
  const filePath = resolveRequestPath(request.url || "/");
  const resolvedPath = existsSync(filePath) && statSync(filePath).isDirectory()
    ? path.join(filePath, "index.html")
    : filePath;

  // Keep preview safe by only serving files inside this repo.
  if (!resolvedPath.startsWith(root) || !existsSync(resolvedPath)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "cache-control": "no-store",
    "content-type": contentTypes.get(path.extname(resolvedPath)) || "application/octet-stream"
  });
  createReadStream(resolvedPath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Preview server running at http://${host}:${port}/`);
});
