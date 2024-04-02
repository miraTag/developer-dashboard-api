import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

// configuration list
routes.get("/site/:siteKey/configurations", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/assistants`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// configuration details
routes.get("/site/:siteKey/configurations/:configurationId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/assistant/${req.params?.configurationId}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// configuration create
routes.post("/site/:siteKey/configurations", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/assistants`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "post",
    (data) => res.json(data)
  )
);

// configuration update
routes.post("/site/:siteKey/configurations/:configurationId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/assistant/${req.params?.configurationId}`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "patch",
    (data) => res.json(data)
  )
);

// delete configuration
routes.delete("/site/:siteKey/configurations/:configurationId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/assistant/${req.params?.configurationId}`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "delete",
    (data) => res.json(data)
  )
);

export default routes;
