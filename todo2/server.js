const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const WEB_ROOT = __dirname;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
    res.end(data);
  });
}

function sendItem(res, name, price) {
  const itemName = decodeURIComponent(name);
  const itemPrice = decodeURIComponent(price);

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${itemName} | Warm Bakery Cafe</title>
  <link rel="stylesheet" href="/public/css/style.css">
</head>
<body>
  <header>
    <div class="brand">Warm Bakery Cafe</div>
    <nav aria-label="Main navigation">
      <a href="/home">หน้าแรก</a>
      <a href="/menu">เมนู</a>
      <a href="/order">สั่งอาหาร</a>
    </nav>
  </header>
  <main>
    <section class="item-card">
      <h1>${itemName}</h1>
      <p class="price">ราคา ${itemPrice} บาท</p>
      <p><a href="/menu">กลับไปหน้าเมนู</a></p>
    </section>
  </main>
</body>
</html>`);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/" || pathname === "/home") {
    sendFile(res, path.join(WEB_ROOT, "index.htm"));
    return;
  }

  if (pathname === "/menu") {
    sendFile(res, path.join(WEB_ROOT, "info", "menu.htm"));
    return;
  }

  if (pathname === "/order") {
    sendFile(res, path.join(WEB_ROOT, "info", "order.htm"));
    return;
  }

  const itemMatch = url.pathname.match(/^\/item\/([^/]+)\/price\/([^/]+)$/);
  if (itemMatch) {
    sendItem(res, itemMatch[1], itemMatch[2]);
    return;
  }

  if (pathname.startsWith("/public/")) {
    const safePath = path.normalize(path.join(WEB_ROOT, pathname));
    if (safePath.startsWith(path.join(WEB_ROOT, "public"))) {
      sendFile(res, safePath);
      return;
    }
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 Not Found");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
