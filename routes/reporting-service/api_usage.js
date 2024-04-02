import express from "express";
import requester from "../../requester.mjs";
import getManagedAccounts from "../../utils/getManagedAccounts.mjs";

const routes = express.Router();

routes.get("/analytics/account/:accountId", (req, res) => {
  const { startDate, endDate, interval, timezone } = req.query;

  const account = getManagedAccounts(req.user?.managedAccounts)?.find(
    (account) => account.accountNum == req.params?.accountId
  );

  const usSites = account?.siteKeys
    ?.filter((s) => s.awsRegion === "us-east-2")
    .map((s) => s.siteKey);
  const euSites = account?.siteKeys
    ?.filter((s) => s.awsRegion === "eu-west-1")
    .map((s) => s.siteKey);

  const usSitesLength = usSites.length;
  const euSitesLength = euSites.length;

  const usPath = `/api/v4/requests/series?startDate=${startDate}&endDate=${endDate}&interval=${interval ?? "day"
    }&aggregate=experience&aggregate=device&aggregate=module&site=${usSites.join(
      "&site="
    )}${timezone ? `&timezone=${timezone}` : ""}`;

  const euPath = `/api/v4/requests/series?startDate=${startDate}&endDate=${endDate}&interval=${interval ?? "day"
    }&aggregate=experience&aggregate=device&aggregate=module&site=${euSites.join(
      "&site="
    )}${timezone ? `&timezone=${timezone}` : ""}`;

  let usData, euData;
  const handleResponse = () => {
    if (!usData || !euData) {
      return;
    }

    const data = {};
    if (usData) data.us = usData;
    if (euData) data.eu = euData;
    const mergedData = {
      siteKeys: [...data.us.siteKeys, ...data.eu.siteKeys],
      type: data.us.type || data.eu.type,
      stats: {
        count: data.us.stats.count + data.eu.stats.count,
        sum: data.us.stats.sum + data.eu.stats.sum,
        min: Math.min(data.us.stats.min, data.eu.stats.min),
        max: Math.max(data.us.stats.max, data.eu.stats.max),
        average: (data.us.stats.average + data.eu.stats.average) / 2,
      },
      listCount: data.us.listCount + data.eu.listCount,
      seriesList: [...data.us.seriesList, ...data.eu.seriesList],
    };
    res.json(mergedData);
  };

  if (usSitesLength === 0 && euSitesLength === 0) {
    res.json({});
    return;
  }

  if (usSitesLength > 0 && euSitesLength > 0) {
    requester(
      req,
      res,
      {
        service: "us-report",
        path: usPath,
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
        errorMessage: "Report is not available",
      },
      "get",
      (data) => {
        usData = data;
        requester(
          req,
          res,
          {
            service: "eu-report",
            path: euPath,
            roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
            errorMessage: "Report is not available",
          },
          "get",
          (data) => {
            euData = data;
            handleResponse();
          }
        );
      }
    );
  } else if (usSitesLength > 0) {
    requester(
      req,
      res,
      {
        service: "us-report",
        path: usPath,
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
        errorMessage: "Report is not available",
      },
      "get",
      (data) => {
        res.json(data);
      }
    );
  } else if (euSitesLength > 0) {
    requester(
      req,
      res,
      {
        service: "eu-report",
        path: euPath,
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
        errorMessage: "Report is not available",
      },
      "get",
      (data) => res.json(data)
    );
  }
});

routes.get("/analytics/:siteKey", (req, res) => {
  const { startDate, endDate, timezone, interval, device } = req.query;

  let query = "";
  if (startDate) {
    query += `startDate=${startDate}&`;
  }
  if (endDate) {
    query += `endDate=${endDate}&`;
  } else {
    query += `endDate=${new Date().toISOString().split("T")[0]}&`;
  }
  if (timezone) {
    query += `timezone=${timezone}`;
  }
  if (device) {
    if (device === 'all') {
      query += `&device=desktop&device=tablet&device=mobile&device=application&aggregate=device`;
    } else {
      if (device === "desktop") {
        query += `&device=desktop&device=tablet&aggregate=device`;
      } else {
        query += `&device=${device}`;
      }
    }
  }
  // http://prdreporting01.taggstar.net:8000/api/v4/site/argoscouk/modules/requests/series?startDate=2023-05-01&endDate=2023-12-20&interval=day
  requester(
    req,
    res,
    {
      service: "report",
      path: `/api/v4/site/${req.params?.siteKey
        }/modules/requests/series?aggregate=category&interval=${interval ?? "day"}&${query}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
      errorMessage: "Report is not available",
    },
    "get",
    (data) => res.json(data)
  );
});

routes.get("/analytics/inline/experience/site/:siteKey", (req, res) => {
  const {
    startDate,
    endDate,
    timezone,
    interval = "day",
    experience,
  } = req.query;
  const { siteKey } = req.params;

  const inlinePath = `/api/v4/requests/series?startDate=${startDate}&endDate=${endDate}&interval=${interval}&site=${siteKey}&aggregate=site&experience=${experience}`;

  const requestOptions = {
    service: "report",
    path: inlinePath,
    roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    errorMessage: "Report is not available",
  };

  requester(req, res, requestOptions, "get", (data) => res.json(data));
});

routes.get("/analytics/inline/site/:siteKey", (req, res) => {
  const { startDate, endDate, timezone, interval } = req.query;

  let query = "";
  if (startDate) {
    query += `startDate=${startDate}&`;
  }
  if (endDate) {
    query += `endDate=${endDate}&`;
  } else {
    query += `endDate=${new Date().toISOString().split("T")[0]}`;
  }
  if (timezone) {
    query += `&timezone=${timezone}`;
  }

  // http://prdreporting01.taggstar.net:8000/api/v4/site/argoscouk/modules/requests/series?startDate=2023-05-01&endDate=2023-12-20&interval=day

  //http://qa.taggstar.net:8100/api/v4/requests/series?startDate=2024-01-01&endDate=2024-01-30&interval=day&site=hugobosscom&aggregate=site&experience=tvt7:treatment
  requester(
    req,
    res,
    {
      service: "report",
      path: `/api/v4/requests/series?interval=${interval ?? "day"
        }&aggregate=site&site=${req.params?.siteKey}&${query}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
      errorMessage: "Report is not available",
    },
    "get",
    (data) => res.json(data)
  );
});
// http://prdreporting01.taggstar.net:8000//api/v4/site/hugobosscom/module/product/impressions/messages/report?startDate=2023-12-01&endDate=2024-01-24&experienceId=tvt7:treatment&timezone=Europe/London
routes.get(
  "/analytics/:siteKey/module/:moduleId/impressions/messages/report",
  (req, res) => {
    const {
      startDate,
      endDate,
      experienceId,
      experimentId,
      experimentGroup,
      deviceType,
      timezone,
      interval,
    } = req.query;

    let query = `${experienceId
      ? `experienceId=${experienceId}&`
      : experimentId
        ? `experimentId=${experimentId}${experimentGroup && experimentGroup !== "both"
          ? `&experimentGroup=${experimentGroup}`
          : ""
        }&`
        : ""
      }`;

    if (startDate) {
      query += `startDate=${startDate}&`;
    }
    if (endDate) {
      query += `endDate=${endDate}&`;
    } else {
      query += `endDate=${new Date().toISOString().split("T")[0]}&`;
    }
    if (timezone) {
      query += `&timezone=${timezone}`;
    }

    if (deviceType) {
      if (deviceType === 'all') {
        query += `&deviceType=desktop&deviceType=tablet&deviceType=mobile&deviceType=application&aggregate=device`;
      } else {
        if (deviceType === "desktop") {
          query += `&deviceType=desktop&deviceType=tablet&aggregate=device`;
        } else {
          query += `&deviceType=${deviceType}`;
        }
      }
    }
    requester(
      req,
      res,
      {
        service: "report",
        path: `/api/v4/site/${req.params?.siteKey}/module/${req.params?.moduleId
          }/impressions/messages/report?interval=${interval ?? "day"}&${query}`,
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
        errorMessage: "Report is not available",
      },
      "get",
      (data) => res.json(data)
    );
  }
);
routes.get(
  "/analytics/site/:siteKey/module/:moduleId/impressions/series",
  (req, res) => {
    const {
      startDate,
      endDate,
      experimentId,
      experimentGroup,
      deviceType,
      timezone,
      interval,
    } = req.query;

    const queryParameters = [];

    if (experimentId) {
      queryParameters.push(`experimentId=${experimentId}`);
      if (experimentGroup && experimentGroup !== "both") {
        queryParameters.push(`experimentGroup=${experimentGroup}`);
      }
    }

    if (startDate) {
      queryParameters.push(`startDate=${startDate}`);
    }
    if (endDate) {
      queryParameters.push(`endDate=${endDate}`);
    } else {
      queryParameters.push(`endDate=${new Date().toISOString().split("T")[0]}`);
    }
    if (timezone) {
      queryParameters.push(`timezone=${timezone}`);
    }
    if (deviceType && (deviceType !== "all" || deviceType !== "All")) {
      const selectedDeviceType =
        deviceType === "desktop" ? "desktop&deviceType=tablet" : deviceType;
      queryParameters.push(`deviceType=${selectedDeviceType}`);
    }

    const queryString = queryParameters.join("&");

    requester(
      req,
      res,
      {
        service: "report",
        path: `/api/v4/site/${req.params?.siteKey}/module/${req.params?.moduleId}/impressions/series?interval=${interval ?? "day"}&${queryString}`,
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
        errorMessage: "Report is not available",
      },
      "get",
      (data) => res.json(data)
    );
  }
);

routes.get(
  "/analytics/site/:siteKey/module/:moduleId/orders/requests/series",
  (req, res) => {
    const {
      startDate,
      endDate,
      experimentId,
      experimentGroup,
      deviceType,
      timezone,
      interval,
    } = req.query;

    let query = `${experimentId
      ? `experimentId=${experimentId}${experimentGroup && experimentGroup !== "both"
        ? `&experimentGroup=${experimentGroup}`
        : ""
      }&`
      : ""
      }`;

    if (startDate) {
      query += `startDate=${startDate}&`;
    }
    if (endDate) {
      query += `endDate=${endDate}&`;
    } else {
      query += `endDate=${new Date().toISOString().split("T")[0]}&`;
    }
    if (timezone) {
      query += `&timezone=${timezone}`;
    }
    if (deviceType) {
      if (deviceType === 'all') {
        query += `&deviceType=desktop&deviceType=tablet&deviceType=mobile&deviceType=application&aggregate=device`;
      } else {
        if (deviceType === "desktop") {
          query += `&deviceType=desktop&deviceType=tablet&aggregate=device`;
        } else {
          query += `&deviceType=${device}`;
        }
      }
    }

    requester(
      req,
      res,
      {
        service: "report",
        path: `/api/v4/site/${req.params?.siteKey}/module/${req.params?.moduleId
          }/requests/series?interval=${interval ?? "day"}&${query}`,
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
        errorMessage: "Report is not available",
      },
      "get",
      (data) => res.json(data)
    );
  }
);
routes.get(
  "/analytics/:siteKey/module/:module/impressions/messages/pairs/report",
  (req, res) => {
    const {
      startDate,
      endDate,
      experienceId,
      // timezone,
      deviceType,
      experimentId,
      group,
    } = req.query;

    let query = "";
    if (experienceId) {
      query += `experienceId=${experienceId}&`;
    }

    if (startDate) {
      query += `startDate=${startDate}&`;
    }
    if (endDate) {
      query += `endDate=${endDate}&`;
    } else {
      query += `endDate=${new Date().toISOString().split("T")[0]}&`;
    }
    // if (timezone) {
    //   query += `&timezone=${timezone}`;
    // }

    if (deviceType) {
      if (deviceType === 'all') {
        query += `&deviceType=desktop&deviceType=tablet&deviceType=mobile&deviceType=application&aggregate=device`;
      } else {
        if (deviceType === "desktop") {
          query += `&deviceType=desktop&deviceType=tablet&aggregate=device`;
        } else {
          query += `&deviceType=${device}`;
        }
      }
    }
    if (experimentId) {
      query += `experimentId=${experimentId}&`;
    }
    if (group) {
      query += `group=${group}&`;
    }
    requester(
      req,
      res,
      {
        service: "report", //api/v4/site/:siteKey/module/:module/impressions/messages/pairs/report?startDate=2023-11-09&endDate=2023-11-14
        path: `/api/v4/site/${req.params?.siteKey}/module/${req.params?.module}/impressions/messages/pairs/report?${query}`,
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
        errorMessage: "Report is not available",
      },
      "get",
      (data) => res.json(data)
    );
  }
);
routes.get("/analytics/site/:sitekey/experiment/report/series", (req, res) => {
  const { startDate, endDate, experimentId, deviceType, locale, interval, region, timezone } =
    req.query;
  const siteKey = req.params?.sitekey;
  let query = "";
  if (startDate) {
    query += `startDate=${startDate}&`;
  }
  if (endDate) {
    query += `endDate=${endDate}&`;
  }
  if (experimentId) {
    query += `experimentId=${experimentId}&`;
  }
  if (deviceType) {
    if (deviceType === 'all') {
      query += `&device=desktop&device=tablet&device=mobile&device=application&aggregate=device`;
    } else {
      if (deviceType === "desktop") {
        query += `&device=desktop&device=tablet&aggregate=device`;
      } else {
        query += `&device=${device}`;
      }
    }
  }
  if (interval) {
    query += `interval=${interval}`;
  }
  if (locale && locale !== "all" && locale !== "All") {
    query += `&locale=${locale}`;
  }
  if (region) {
    query += `&region=${region}`;
  }
  if (timezone) {
    query += `&timezone=${timezone}`;
  }
  //experiment/report/series
  requester(
    req,
    res,
    {
      service: "exp-trends-report",
      path: `/api/v3/site/${siteKey}/experiment/report/series?${query}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
      errorMessage: `Report is not available`,
    },
    "get",
    (data) => res.json(data)
  );
});
export default routes;
