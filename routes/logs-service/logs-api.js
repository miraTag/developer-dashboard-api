import express from "express";
import { getLogs } from "../../controller/log.controller.js";
const routes = express.Router();

routes.get("/logs", getLogs);

export default routes;
