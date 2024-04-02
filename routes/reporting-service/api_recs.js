import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();
//http://qa.taggstar.net:8100/api/v4/site/fatfaceuk/module/recs/algorithm/sessions/series?interval=day&startDate=2023-04-12&endDate=2023-06-10
routes.get("/recs-analytics/site/:siteKey", (req, res) => {
  const { siteKey } = req.params;
  const { startDate, endDate, experimentId, interval, experienceId, pageType, pageId,device, locale,algorithm } =
    req.query;

  const queryParams = {
    startDate: startDate ? `startDate=${startDate}` : "",
    endDate: endDate ? `endDate=${endDate}` : "",
    experimentId: experimentId ? `experimentId=${experimentId}` : "",
    experienceId: experienceId ? `experienceId=${experienceId}` : "",
    interval: interval ? `interval=${interval}` : "interval=day",
    pageType: pageType ? `pageType=${pageType}` : "",
    pageId: pageId ? `pageId=${pageId}` : "",
    device: device === 'all' ? 'device=desktop&device=tablet&device=mobile' :  device === 'desktop' ? 'device=desktop&device=tablet' : device === 'mobile' ?`device=${device}` :"" ,
    algorithm: algorithm ? `algorithm=${algorithm}` : "",
    locale: locale ? `locale=${locale}` : "",
  };

  const query = Object.values(queryParams)
    .filter((param) => param !== "")
    .join("&");

  const url = `/api/v4/site/${siteKey}/module/recs/algorithm/sessions/series${
    query ? `?${query}` : ""
  }`;
  requester(
    req,
    res,
    {
      service: "recs-report",
      path: url,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
      errorMessage: "Recommendations Report is not available",
    },
    "get",
    (data) => res.json(data)
  );
});

// http://qa.taggstar.net:8100/api/v4/site/fatfaceuk/module/recs/report?interval=day&startDate=2023-05-03&endDate=2023-05-03&experimentId=recs-tvc1&device=desktop&locale=en_GB
routes.get("/recs-report/site/:siteKey", (req, res) => {
  const { siteKey } = req.params;
  const { startDate, endDate, experimentId, interval, device, locale } =
    req.query;
    const queryParams = {
      startDate: startDate ? `startDate=${startDate}` : "",
      endDate: endDate ? `endDate=${endDate}` : "",
      experimentId: experimentId ? `experimentId=${experimentId}` : "",
      interval: interval ? `interval=${interval}` : "",
      device: device && device === 'all' ? 'device=desktop&device=tablet&device=mobile' :  device === 'desktop' ? 'device=desktop&device=tablet' : device === 'mobile' ?`device=${device}` :"" ,
      locale: locale ? `locale=${locale}` : "",
    };
    
  
    const query = Object.values(queryParams)
      .filter((param) => param !== "")
      .join("&");
    const url = `/api/v4/site/${siteKey}/module/recs/report${
      query ? `?${query}` : ""
    }`;
    requester(
      req,
      res,
      {
        service: "recs-report",
        path: url,
        roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
        errorMessage: "Recommendations Report is not available",
      },
      "get",
      (data) => res.json(data)
    );
  });
export default routes;
