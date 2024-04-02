import express from "express";
import requester from "../../requester.mjs";
import { EU_WEST_1_DASHBOARD_SERVICE_URL } from "../../config.mjs";

const routes = express.Router();

routes.put("/analytics/power", (req, res) =>
    requester(
        req,
        res,
        `${EU_WEST_1_DASHBOARD_SERVICE_URL}/api/v1/analytics/power`,
        "put",
        (data) => res.json(data),
        true
    )
);

export default routes;
