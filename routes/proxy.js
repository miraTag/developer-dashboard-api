import express from "express";
import siteRoutes from "./dashboard-service/site.js";
import logsRoute from "./logs-service/logs-api.js";
import userRoutes from "./user-service/user.js";

const proxyRouter = express.Router();

proxyRouter.use("", siteRoutes);
proxyRouter.use("", logsRoute);
proxyRouter.use("", userRoutes);

export default proxyRouter;
