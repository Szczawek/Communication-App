import { WebSocketServer } from "ws";
import { createServer } from "https";
import {
  corsOptions,
  helemtOptions,
  limitOptions,
} from "../api-config/config.js";
import "dotenv/config";
import express from "express";

const PORT = 8443;
const app = express();

const options = {
  key: process.env.SSL_KEY,
  cert: process.env.SSL_CERT,
};

app.use(corsOptions);
app.use(helemtOptions);
app.use(limitOptions);
const server = createServer(options, app);
const wss = new WebSocketServer({ server });
const collection = new Map();

wss.on("connection", (ws, req) => {
  try {
    const activeUserId = new URL(
      req.url,
      `wss://${req.headers.host}`
    ).searchParams.get("user");
    collection.set(activeUserId, ws);
    console.log("Connected!");

    ws.on("error", (err) => {
      throw err;
    });
    ws.on("message", (e) => {
      console.log(12312312, e);
    });
  } catch (err) {
    console.log(`Error with WebSockert: ${err}`);
  }
});

wss.on("error", (ws, res) => {
  try {
    const activeUserId = new URL(
      req.url,
      `wss://${req.headers.host}`
    ).searchParams.get("user");

    // console.log("Connected!");

    ws.on("error", (err) => {
      throw err;
    });
    ws.on("message", (e) => {
      console.log(12312312, e);
    });
  } catch (err) {
    console.log(`Error with WebSockert: ${err}`);
  }
});

server.listen(PORT, () => {
  console.log("https://127.0.0.1:8443")
  console.log("WebSocket Server is working!");
});
