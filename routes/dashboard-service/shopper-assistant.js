import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

// get details
routes.get("/site/:siteKey/assistants/:assistantId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/site/${req.params?.siteKey}/assistant/${req.params?.assistantId}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// update assistant
routes.put("/site/:siteKey/assistants", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/site/${req.params?.siteKey}/assistants`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "put",
    (data) => res.json(data)
  )
);

// get list
routes.get("/site/:siteKey/assistants", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/site/${req.params?.siteKey}/assistants`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// create shopper assitance
routes.post("/site/:siteKey/assistants", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/site/${req.params?.siteKey}/assistants`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "post",
    (data) => res.json(data)
  )
);

export default routes;
