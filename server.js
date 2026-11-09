const http = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");

process.on("uncaughtException", (err) => {
  const msg = `[${new Date().toISOString()}] Uncaught Exception: ${err?.stack || err}\n`;
  console.error(msg);
  fs.appendFileSync(path.join(__dirname, "server_crash.log"), msg);
});

process.on("unhandledRejection", (reason) => {
  const msg = `[${new Date().toISOString()}] Unhandled Rejection: ${reason?.stack || reason}\n`;
  console.error(msg);
  fs.appendFileSync(path.join(__dirname, "server_crash.log"), msg);
});

const dev = false;
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = http.createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Request error:", req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        }
      }
    });

    server.on("error", (err) => {
      console.error("Server listen error:", err);
      fs.appendFileSync(path.join(__dirname, "server_crash.log"), `Listen error: ${err}\n`);
    });

    server.listen(port, "0.0.0.0", () => {
      console.log(`> Server ready on http://localhost:${port} and http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => {
    console.error("app.prepare error:", err);
    fs.appendFileSync(path.join(__dirname, "server_crash.log"), `Prepare error: ${err}\n`);
  });
