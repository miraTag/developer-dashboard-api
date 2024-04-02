import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

// experiments list
routes.get("/site/:siteKey/experiments", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/experiments`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// experiment details
routes.get("/site/:siteKey/experiments/:experimentId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/experiment/${req.params?.experimentId}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// experiment details update
routes.patch("/site/:siteKey/experiment/:experimentId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/experiment/${req.params?.experimentId}`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "patch",
    (data) => res.json(data)
  )
);

// create experiment
routes.post("/site/:siteKey/experiments", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/experiments`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "post",
    (data) => res.json(data)
  )
);

// update experiment
routes.put("/site/:siteKey/experiments", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/experiments`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "put",
    (data) => res.json(data)
  )
);

// experiment delete
routes.delete("/site/:siteKey/experiment/:experimentId", (req, res, next) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/experiment/${req.params?.experimentId}`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "delete",
    (data) => res.json(data)
  )
);

// experiment report
routes.get("/site/:siteKey/experiments/:experimentId/report", (req, res) => {
  const { startDate, endDate, timezone, deviceType, locale } = req.query;
  const siteKey = req.params?.siteKey;
  const experimentId = req.params?.experimentId;
  let query = "";
  if (startDate) {
    query += `startDate=${startDate}&`;
  }
  if (endDate) {
    query += `endDate=${endDate}&`;
  }
  if (locale && locale !== "all") {
    query += `locale=${locale}&`;
  }
  if (deviceType) {
    if (deviceType === "desktop") {
      query += `deviceType=desktop&deviceType=tablet`;
    }
    if (deviceType === "mobile") {
      query += `deviceType=mobile`;
    }
    if (deviceType === "all") {
      query += `deviceType=mobile&deviceType=desktop&deviceType=tablet`;
    }
  }
  if (timezone) {
    query += `&timezone=${timezone}`;
  }
  //http://prdreporting01.taggstar.net:8000/api/v3/site/${siteKey}/experiment/report?experimentId=${experimentId}&startDate=2021-01-01&endDate=2021-01-31&locale=en-GB&deviceType=desktop&deviceType=tablet&timezone=Europe/London
  requester(
    req,
    res,
    {
      service: "report",
      path: `/api/v3/site/${siteKey}/experiment/report?experimentId=${experimentId}&${query}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  );
});

// related experiment for experience
routes.get("/site/:siteKey/experiments/experience/:experienceId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/experiments/experience/${req.params?.experienceId}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

export default routes;
