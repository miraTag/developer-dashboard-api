import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

// update tag (including adding new locale)
routes.put("/site/:siteKey/tags", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/tags`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "put",
    (data) => res.json(data)
  )
);

// create tag
routes.post("/site/:siteKey/tags", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/tags`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "post",
    (data) => res.json(data)
  )
);

// get tags list for current site
routes.get("/site/:siteKey/tags", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/tags`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// tag details
routes.get("/site/:siteKey/tags/:tagId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/tag/${req.params?.tagId}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// tag usage
routes.get("/site/:siteKey/tags/:tagId/usage", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/tag/${req.params?.tagId}/usage`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// tag delete
routes.delete("/site/:siteKey/tags/:tagId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/tag/${req.params?.tagId}`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "delete",
    (data) => res.json(data)
  )
);

export default routes;
