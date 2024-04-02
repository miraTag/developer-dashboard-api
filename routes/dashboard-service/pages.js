import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

// page list
routes.get("/site/:siteKey/pages", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/${req.params?.siteKey}/pageTypes?${Object.keys(
        req.query
      )
        .map((key) => `${key}=${req.query[key]}`)
        .join("&")}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// page create
routes.post("/site/:siteKey/pages", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/${req.params?.siteKey}/pageTypes`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "post",
    (data) => res.json(data)
  )
);

// page update
routes.put("/site/:siteKey/pages", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/${req.params?.siteKey}/pageTypes`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "put",
    (data) => res.json(data)
  )
);

// page template
routes.delete("/site/:siteKey/pages/:type/:pageId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/${req.params?.siteKey}/pageType/${req.params?.type}/${req.params?.pageId}`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "delete",
    (data) => res.json(data)
  )
);

export default routes;
