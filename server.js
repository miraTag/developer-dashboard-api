import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import fs from "fs";
import listEndpoints from "express-list-endpoints";
import login from "./routes/login.js";
import proxyRoutes from "./routes/proxy.js";
import "./auth/auth.mjs";
import { writeError } from "./logger.mjs";
import { DEPLOYMENT_ID } from "./config.mjs";
import { sequelize } from "./models/index.js";

const corsSettings = {
  credentials: true,
  origin: [
    "https://dashboard.taggstar.com",
    "https://newdashboard.taggstar.com",
    "https://qadashboard.taggstar.com",
    "http://localhost:3000",
  ],
  exposedHeaders: "*",
};

const app = express();

try {
  app.locals.badWordList = fs
    .readFileSync("badwordlist.txt")
    .toString()
    .split("\n");
} catch (err) {
  writeError(`Error reading file: ${err}`);
}

app.use(cors(corsSettings));
app.options("*", cors(corsSettings));
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});
app.use(bodyParser.json());

app.use(passport.initialize());

app.use("/api/auth", login);

app.use(
  "/api/proxy",
  passport.authenticate("jwt", { session: false }),
  proxyRoutes
);

(async () => {
  if (process.env.ENV) {
    try {
      await sequelize
        .sync()
        .then(() => {
          console.log("Synced DB");
        })
        .catch((err) => {
          writeError("Failed to sync db: " + err.message);
        });
    } catch (error) {
      writeError("DB Connection problem");
    }
  }
})();

app.get("/api/check-health", (req, res) => {
  res.status(200);
  res.send({ status: 200, deploymentID: DEPLOYMENT_ID });
});

app.get("/api/get-all-routes", (req, res) => {
  res.send(listEndpoints(app).map(({ path, methods }) => ({ path, methods })));
});

const port = 8081;

app.listen(port, () => {
  console.log(`Nodejs server started on port ${port}`);
});

process.on("unhandledRejection", (reason) => {
  writeError(`unhandledRejection: ${reason}`);
});
