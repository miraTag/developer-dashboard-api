import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

// visitor sessions
// /api/v1/key/:siteKey/profile/:visitorId
routes.get("/site/:siteKey/profile/:visitorId", (req, res) => {
  requester(
    req,
    res,
    {
      service: "profile",
      path: `/api/v1/key/${req.params?.siteKey}/profile/${req.params?.visitorId}?${Object.keys(
        req.query
      )
        .map((key) => `${key}=${req.query[key]}`)
        .join("&")}`,
      partition: Number(req.query.part || 0),
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  );
});

// user sessions
// /api/v1/key/:siteKey/user/:userId/profile?visitorId=all
routes.get("/site/:siteKey/user/:userId/profile", (req, res) => {
    requester(
      req,
      res,
      {
        service: "profile",
        path: `/api/v1/key/${req.params?.siteKey}/user/${req.params?.userId}/profile?visitorId=all&${Object.keys(
          req.query
        )
          .map((key) => `${key}=${req.query[key]}`)
          .join("&")}`,
        partition: Number(req.query.part || 0),
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
      },
      "get",
      (data) => res.json(data)
    );
  });

// user orders
// /api/v1/key/:siteKey/user/:userId/orders
routes.get("/site/:siteKey/user/:userId/orders", (req, res) => {
    requester(
      req,
      res,
      {
        service: "profile",
        path: `/api/v1/key/${req.params?.siteKey}/user/${req.params?.userId}/orders?${Object.keys(
          req.query
        )
          .map((key) => `${key}=${req.query[key]}`)
          .join("&")}`,
        partition: Number(req.query.part || 0),
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
      },
      "get",
      (data) => res.json(data)
    );
  });


// delete orders
// /api/v1/key/:siteKey/user/:userId/orders
routes.delete("/site/:siteKey/user/:userId/orders", (req, res) => {
    requester(
      req,
      res,
      {
        service: "profile",
        path: `/api/v1/key/${req.params?.siteKey}/user/${req.params?.userId}/orders`,
        partition: Number(req.query.part || 0),
        roles: ["CA", "SU", "CSM", "ENG", "TC"],
      },
      "delete",
      (data) => res.json(data)
    );
  });

export default routes;
