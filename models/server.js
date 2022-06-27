const { createServer } = require("http");
const express = require("express");
const cors = require("cors");
const { Server: SocketIO } = require("socket.io");
const path = require("path");
const { socketController } = require("../sockets/controller");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.paths = {};
    this.server = createServer(this.app);
    this.io = new SocketIO(this.server);

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();

    // Socket.io
    this.sockets();
  }

  listen() {
    this.app.get("/api*", (req, res) => {
      res.status(404).json({
        msg: "404 | NOT FOUND",
      });
    });

    this.app.get("*", (req, res) => {
      res.status(404).sendFile(path.join(__dirname, "../", "/public/404.html"));
    });

    this.server.listen(this.port, () => {
      console.log(`Server is starting on port: ${this.port}`);
    });
  }

  middlewares() {
    // Cors
    this.app.use(cors());

    // Static Directory
    this.app.use(express.static("public"));
  }

  routes() {
    //this.app.use(this.paths.users, require("../routes/user"));
  }

  sockets() {
    this.io.on("connection", socketController);
  }
}

module.exports = Server;
