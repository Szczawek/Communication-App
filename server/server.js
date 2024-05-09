import express from "express";
import cors from "cors";
import "dotenv/config";
import https from "https";
import helmet from "helmet";
const PORT = 443;
const app = express();

app.use(cors());
app.use(express());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "blob:"],
        "script-src": ["'self'"],
      },
    },
  })
);

const options = {
  key: process.env.KEY_SSH,
  cert: process.env.CERT_SSH,
};
const server = https.createServer(options, app);
// START POINT
app.get("/", (req, res) => {
  res.send("Szczawik");
});

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`https://localhost:${PORT}`);
});
