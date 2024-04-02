import express from "express";
import requester from "../../requester.mjs";


const routes = express.Router();

const daysBetweenDates = (dateEnd, dateStart) => {
  const date1 = new Date(dateEnd);
  const date2 = new Date(dateStart);
  const diffInMilliseconds = date1.getTime() - date2.getTime();
  const daysBetween = diffInMilliseconds / (1000 * 60 * 60 * 24);
  return daysBetween;
}

routes.get("/trends/site/:siteKey", (req, res) => {

  ///api/proxy/trends/site/demov2?offset=12&deviceType=all&page=2&sortField=tagId&sortOrder=desc&filterField=locale&filterValue=en_GB
  const { siteKey } = req.params;
  const { startDate, endDate, offset, page, sortField, sortOrder, filterField, filterValue, deviceType } =
    req.query;

  const queryParams = {
    offset: offset ? `offset=${offset}` : "",
    page: page ? `page=${page}` : "",
    sortField: sortField ? `sortField=${sortField}` : "",
    sortOrder: sortOrder ? `sortOrder=${sortOrder}` : "",
    startDate: startDate ? `startDate=${startDate}` : "",
    endDate: endDate ? `endDate=${endDate}` : "",
    interval: `interval=day`,
    aggregate: deviceType === 'all' ? `aggregate=deviceType` : "",
    deviceType: deviceType === 'all' ? '' : `deviceType=${deviceType}`
  };

  if(filterField !== 'locale') {
    queryParams.filterField = filterField ? `filterField=${filterField}` : "";
    queryParams.filterValue = filterValue ? `filterValue=${filterValue}` : "";
  } else {
    queryParams.locale = `locale=${filterValue}`;
  }

  const query = Object.values(queryParams)
    .filter((param) => param !== "")
    .join("&");

    //http://qa:8100/api/v4/site/hugobosscom/tags/conversion/series?startDate=2023-09-11&endDate=2023-09-25&interval=day

  const url = {
    service: "report",
    path: `/api/v4/site/${siteKey}/tags/conversion/series${
      query ? `?${query}` : ""
    }`,
    roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    errorMessage: "Trend list is not available",
  };

  requester(req, res, url, "get", (data) => {
    res.json(data);
  });
});

routes.get("/trends/site/:siteKey/trend/:id", (req, res) => {

  // /api/proxy/trends/site/hugobosscom/trend/tag-0?locale=en-GB&startDate=2023-09-18&endDate=2023-10-17&analyticsType=sessions-vs-orders
  const { siteKey, id } = req.params;
  const { startDate, endDate, locale } =
    req.query;

  const queryParams = {
    offset: `offset=1` ,
    page: `page=1`,
    sortField:  `sortField=createDate`,
    sortOrder: `sortOrder=ASC`,
    locale: `locale=${locale}`,
    tagId: `tagId=${id}`,
    startDate: startDate ? `startDate=${startDate}` : "",
    endDate: endDate ? `endDate=${endDate}` : "",
    interval: daysBetweenDates(endDate, startDate) > 40 ? `interval=day` :  `interval=hour`,
    aggregate: `aggregate=deviceType`,
  };

  const query = Object.values(queryParams)
    .filter((param) => param !== "")
    .join("&");

    // /api/v4/site/hugobosscom/tags/conversion/series?tagId=tag-01&startDate=2023-09-11&endDate=2023-09-25&interval=day

  const url = {
    service: "report",
    path: `/api/v4/site/${siteKey}/tags/conversion/series${
      query ? `?${query}` : ""
    }`,
    roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    errorMessage: "Trend list is not available",
  };

  requester(req, res, url, "get", (data) => {
    res.json(data);
  });
});

export default routes;
