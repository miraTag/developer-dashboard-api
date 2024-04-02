import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

routes.get("/site/:siteKey", (req, res) =>
    requester(
        req,
        res,
        {
            service: "dashboard",
            path: `/api/v1/site/${req.params?.siteKey}`,
        },
        "get",
        (data) => res.json(data)
    )
);

routes.put("/site/:siteKey", (req, res) =>
    requester(
        req,
        res,
        {
            service: "dashboard",
            path: `/api/v1/site/${req.params?.siteKey}`,
        },
        "put",
        (data) => res.json(data)
    )
);

// categories list
routes.get("/site/:siteKey/categories", (req, res) =>
    requester(
        req,
        res,
        {
            service: "dashboard",
            path: `/api/v1/site/${req.params?.siteKey}/categories`,
        },
        "get",
        (data) => res.json(data)
    )
);

// site list of account
routes.get("/account/:accountId/sites", (req, res) =>
    requester(
        req,
        res,
        {
            service: "dashboard",
            path: `/api/v2/account/${req.params?.accountId}/sites`,
        },
        "get",
        (data) => res.json(data)
    )
);

export default routes;
