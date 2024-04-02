import express from "express";
import requester from "../../requester.mjs";
import { REST_API_SERVICE_URL } from "../../config.mjs";

const routes = express.Router();

// experience config view
routes.post("/rest-api/:siteKey/recs/query", (req, res) =>
    requester(
        req,
        res,
        `${REST_API_SERVICE_URL}/api/v2/key/${req.params?.siteKey}/recs/query`,
        "post",
        (data) => res.json(data)
    )
);

export default routes;
