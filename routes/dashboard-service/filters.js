import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

// get product filters
routes.get("/site/:siteKey/filters/products", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/site/${req.params?.siteKey}/filters/products`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR", "CFA"],
    },
    "get",
    (data) => res.json(data)
  )
);

// update product filters
routes.put("/site/:siteKey/filters/products", (req, res) => {
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/site/${req.params?.siteKey}/filters/products`,
      roles: ["CA", "SU", "CSM", "ENG", "TC", "CFA"],
    },
    "put",
    (data) => res.json(data),
    true
  );
});

// get categories filters
routes.get("/site/:siteKey/filters/categories", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/site/${req.params?.siteKey}/filters/categories`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR", "CFA"],
    },
    "get",
    (data) => res.json(data)
  )
);

// update categories filters
routes.put("/site/:siteKey/filters/categories", (req, res) => {
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/site/${req.params?.siteKey}/filters/categories`,
      roles: ["CA", "SU", "CSM", "ENG", "TC", "CFA"],
    },
    "put",
    (data) => res.json(data),
    true
  );
});

export default routes;
