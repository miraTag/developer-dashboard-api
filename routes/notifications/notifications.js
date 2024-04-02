import express from "express";
import { AUTH_SERVICE_URL } from "../../config.mjs";
import requester from "../../requester.mjs";

const routes = express.Router();

// GET api/v1/domain/:domainId/user/:id/messages?ids=100,101,102,read=true
// GET api/v1/domain/:domainId/user/:id/messages?read=false

// get notifications
routes.get("/notifications", (req, res) =>
    requester(
        req,
        res,
        `${AUTH_SERVICE_URL}/api/v1/domain/developer/user/${req.user?.userId}/messages`,
        "get",
        (data) => res.json(data)
    )
);

// update notifications - mark as read, mark as deleted
routes.put("/notifications", (req, res) =>
    requester(
        req,
        res,
        `${AUTH_SERVICE_URL}/api/v1/domain/developer/user/${req.user?.userId}/messages?ids=${req.query?.ids}`,
        "put",
        (data) => res.json(data),
        true
    )
);

// delete notifications
routes.delete("/notifications", (req, res) =>
    requester(
        req,
        res,
        `${AUTH_SERVICE_URL}/api/v1/domain/developer/user/${req.user?.userId}/messages?id=${req.query?.ids}`,
        "delete",
        (data) => res.json(data),
        true
    )
);

export default routes;
