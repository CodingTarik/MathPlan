// Libaries
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const morgan = require("morgan");
const http = require("http");
const https = require("https");
const fs = require("fs");

// Config
const config = require(path.join(__dirname, "config.js"));

// Router
const api = require(path.join(__dirname, "routes/api"));
const pages = require(path.join(__dirname, "routes/pages"));

// Objects
const app = express();
const port = config.server.PORT;

// Register logger
if (config.dev.DEBUG) {
  app.use(morgan("dev"));
}

// Static assets
app.use("/assets", express.static("public"));
app.use(
  "/assets/bootstrap",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist"))
);
app.use(
  "/assets/jquery",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);
app.use(
  "/assets/fontawesome",
  express.static(path.join(__dirname, "/node_modules/font-awesome"))
);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routing
app.use("/", pages);
app.use("/api", api);

if (process.env.NODE_ENV != 'test') {
  // HTTP-Server
  if (config.server.ALLOW_HTTP) {
    let httpServer = null;
    if (config.HTTP_REDIRECT) {
      httpServer = http.createServer((req, res) => {
        res.writeHead(301, { "Location": "https://" + config.server.host + ":" + config.PORT_HTTPS + req.url });
        res.end();
      });
    } else {
      httpServer = http.createServer(app);
    }

    httpServer.listen(config.server.PORT_HTTP, () => {
      console.log(`HTTP server listening on port ${config.server.PORT_HTTP}`);
    });
  }

  // HTTPS-Server
  if (config.server.ALLOW_HTTPS) {
    const options = {
      key: fs.readFileSync(config.server.CERT_PATH, "utf8"),
      cert: fs.readFileSync(config.server.CERT_SECRET_PATH, "utf8"),
    };

    https.createServer(options, app).listen(config.server.PORT_HTTPS, () => {
      console.log(
        `Die Anwendung ist auf https://${config.server.HOST}:${config.server.PORT_HTTPS} verfügbar.`
      );
    });
  }
}
module.exports.app = app;