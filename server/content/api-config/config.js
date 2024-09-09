import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "dotenv/config";

const corsOptions = cors({
  origin: [
    "https://127.0.0.1:5173",
    process.env.CLIENT_ADDRESS,
    process.env.SECOND_LOCAL_ADDRESS,
    process.env.LOCAL_NETWORK,
  ],
  credentials: true,
  maxAge: 1000 * 60 * 60,
});

const limitOptions = rateLimit({
  windowMs: 1000 * 60 * 60,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const helemtOptions = helmet({
  crossOriginResourcePolicy: "cross-origin",
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: ["'none'"],
      styleSrc: ["'none'"],
      imgSrc: ["'none'"],
      connectSrc: ["'none'"],
      fontSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      frameSrc: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  frameguard: {
    action: "deny",
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  hidePoweredBy: true,
  referrerPolicy: { policy: "no-referrer" },
  xssFilter: true,
});

export { corsOptions, helemtOptions, limitOptions };
