import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();
// experiments list
routes.get("/assistant/site/:siteKey/experiments", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/experiments${
        req.query?.expand ? `?expand=${req.query?.expand}` : ""
      }`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// experiment details
routes.get("/assistant/site/:siteKey/experiments/:experimentId", (req, res) => {
  const url = {
    service: "dashboard",
    path: `/api/v1/assistant/site/${req.params?.siteKey}/experiment/${
      req.params?.experimentId
    }${req.query?.expand ? `?expand=${req.query?.expand}` : ""}`,
    roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
  };

  requester(req, res, url, "get", (data) => res.json(data));
});

// experiment details update
routes.patch("/assistant/site/:siteKey/experiment/:experimentId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/experiment/${req.params?.experimentId}`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "patch",
    (data) => res.json(data)
  )
);

// create experiment
routes.post("/assistant/site/:siteKey/experiments", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/experiments`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "post",
    (data) => res.json(data)
  )
);

// update experiment
routes.put("/assistant/site/:siteKey/experiments", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/assistant/site/${req.params?.siteKey}/experiments`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "put",
    (data) => res.json(data)
  )
);

// experiment delete
routes.delete(
  "/assistant/site/:siteKey/experiment/:experimentId",
  (req, res, next) =>
    requester(
      req,
      res,
      {
        service: "dashboard",
        path: `/api/v1/assistant/site/${req.params?.siteKey}/experiment/${req.params?.experimentId}`,
        roles: ["CA", "SU", "CSM", "ENG", "TC"],
      },
      "delete",
      (data) => res.json(data)
    )
);

// experiment report
routes.get(
  "/assistant/site/:siteKey/experiments/:experimentId/report",
  (req, res) =>
    requester(
      req,
      res,
      {
        service: "report",
        path: `/api/v3/site/${
          req.params?.siteKey
        }/experiment/report?experimentId=${
          req.params?.experimentId
        }&startDate=${req.query?.startDate}&endDate=${
          req.query?.endDate
        }&deviceType=desktop&deviceType=mobile&deviceType=tablet${
          req.query?.timezone ? `&timezone=${req.query?.timezone}` : ""
        }`,
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
      },
      "get",
      (data) => res.json(data)
    )
);

// related experiment for experience
routes.get(
  "/assistant/site/:siteKey/experiments/experience/:experienceId",
  (req, res) =>
    requester(
      req,
      res,
      {
        service: "dashboard",
        path: `/api/v1/assistant/site/${req.params?.siteKey}/experiments/experience/${req.params?.experienceId}`,
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
      },
      "get",
      (data) => res.json(data)
    )
);

export default routes;
