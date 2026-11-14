const http = require("node:http");
const { networkInterfaces } = require("node:os");
const { createReadStream } = require("node:fs");
const { join } = require("node:path");

const port = Number(process.env.PORT || 8765);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("PORT must be a whole number between 1 and 65535.");
  process.exit(1);
}

const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/images.png", ["images.png", "image/png"]],
  ["/Daft-Punk-ft-Pharell-Get-Lucky-samcera-20201004170621-nonstop2k.com.mid",
    ["Daft-Punk-ft-Pharell-Get-Lucky-samcera-20201004170621-nonstop2k.com.mid", "audio/midi"]]
]);

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch (error) {
    if (!(error instanceof URIError) && !(error instanceof TypeError)) throw error;
    response.writeHead(400);
    response.end("Invalid request URL");
    return;
  }
  const file = files.get(pathname);
  if (!file) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const stream = createReadStream(join(__dirname, file[0]));
  stream.on("error", (error) => {
    console.error(`Could not serve ${file[0]}: ${error.message}`);
    if (!response.headersSent) {
      response.writeHead(500);
      response.end("Could not read the requested file");
    } else {
      response.destroy(error);
    }
  });
  stream.on("open", () => {
    response.writeHead(200, {
      "Content-Type": file[1],
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff"
    });
    if (request.method === "HEAD") {
      response.end();
      stream.destroy();
    } else {
      stream.pipe(response);
    }
  });
});

server.on("error", (error) => {
  console.error(`Could not start the server: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Invisible Heroes: http://localhost:${port}/`);
  const addresses = Object.values(networkInterfaces())
    .flat()
    .filter((address) => address && address.family === "IPv4" && !address.internal)
    .map((address) => address.address);
  for (const address of new Set(addresses)) {
    console.log(`Phone / host URL: http://${address}:${port}/`);
  }
  if (!addresses.length) console.log("No local-network address found. Connect to Wi-Fi to join from phones.");
  console.log("Open the phone / host URL on the host computer, then scan its QR code.");
  console.log("Press Ctrl+C to stop the server.");
});
