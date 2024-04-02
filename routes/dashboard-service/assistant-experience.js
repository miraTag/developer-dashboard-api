import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

// create experience
routes.post("/assistant/site/:siteKey/experiences", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/experiences`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "post",
    (data) => res.json(data)
  )
);

// get experiences list for current site
routes.get("/assistant/site/:siteKey/experiences", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/experiences?${
        req.query?.expand ? `expand=${req.query?.expand}` : ""
      }&${Object.keys(req.query)
        .map((key) => `${key}=${req.query[key]}`)
        .join("&")}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// experience details
routes.get("/assistant/site/:siteKey/experiences/:experienceId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/experience/${req.params?.experienceId}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// experience update
routes.put("/assistant/site/:siteKey/experiences", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/experiences`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "put",
    (data) => res.json(data)
  )
);

// experience update
routes.patch("/assistant/site/:siteKey/experiences/:experienceId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/experience/${req.params?.experienceId}`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "patch",
    (data) => res.json(data)
  )
);

// experience delete
routes.delete(
  "/assistant/site/:siteKey/experiences/:experienceId",
  (req, res, next) =>
    requester(
      req,
      res,
      {
        service: "dashboard",
        path: `/api/v1/assistant/site/${req.params?.siteKey}/experience/${req.params?.experienceId}`,
        roles: ["CA", "SU", "CSM", "ENG", "TC"],
      },
      "delete",
      (data) => res.json(data)
    )
);

export default routes;
