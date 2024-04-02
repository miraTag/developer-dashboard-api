import { axiosNodeInstanse } from "./axiosNodeInstanse.mjs";
import { infoLog, writeError } from "./logger.mjs";
import {
  EU_WEST_1_DASHBOARD_SERVICE_URL,
  US_EAST_2_DASHBOARD_SERVICE_URL,
  EU_WEST_1_REPORT_SERVICE,
  US_EAST_2_REPORT_SERVICE_URL,
  PRODUCT_SERVICE_URL,
  PROFILE_SERVICE_URL,
  US_EXTERNAL_DATA_SERVICE_URL,
  EU_EXTERNAL_DATA_SERVICE_URL,
  EU_WEST_RECS_REPORT_SERVICE_URL,
  EU_WEST_1_EXP_TRENDS_REPORT_SERVICE_URL,
  US_EAST_2_EXP_TRENDS_REPORT_SERVICE_URL,
} from "./config.mjs";
import { EXCEPT_BODY_LIST } from "./constants.mjs";
import getManagedAccounts from "./utils/getManagedAccounts.mjs";

const methods = ["PUT", "POST", "PATCH", "DELETE"];

const getBody = (obj) => {
  if (!obj) return null;

  const result = {};
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    if (!EXCEPT_BODY_LIST.includes(key)) {
      result[key] =
        typeof obj[key] === "object" && !Array.isArray(obj[key])
          ? (result[key] = getBody(obj[key]))
          : obj[key];
    }
  });

  return Object.keys(result).length === 0 ? null : result;
};

const logGenerate = (req, type, service, url) => {
  const accountId = req.params?.accountId;
  const siteKey = req.params?.siteKey;
  const userId = req.user?.userId;
  const userEmail = req.user?.email;

  // Get the full URL
  const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  const log = {
    type,
    method: req.method,
    url: typeof url === "object" ? url.path : url,
    fullUrl: fullUrl, // Include the full URL in the log object
    serviceUrl: service, // Include the service URL in the log object
  };

  if (type === "response") {
    log.resUrl = `${service}${log.url}`;
  } else {
    log.reqUrl = `${service}${log.url}`;
  }

  if (req.body) {
    log.body = getBody(req.body);
  }

  if (userId) {
    log.userId = userId;
  }
  if (userEmail) {
    log.userEmail = userEmail;
  }

  if (siteKey) {
    log.siteKey = siteKey;
  }

  if (accountId) {
    log.accountId = accountId;
  }

  return JSON.stringify(log);
};

const requester = (req, res, url, method, cb, passRoleCheck = false) => {
  const accountId = req.params?.accountId;
  const siteKey = req.params?.siteKey;
  const data = req.body;
  const siteRegion = req.query?.region;
  let service = "";

  const account = getManagedAccounts(req.user?.managedAccounts)?.find(
    (account) =>
      account.accountNum == accountId ||
      account.siteKeys.find((site) => site.siteKey === siteKey)
  );

  const site = getManagedAccounts(req.user?.managedAccounts)
    ?.find((account) =>
      account.siteKeys.find((site) => site.siteKey === siteKey)
    )
    ?.siteKeys?.find((site) => site.siteKey === siteKey);

  if (
    (siteKey ? site : true) &&
    (accountId
      ? account ||
      accountId == (req.user?.accountNum || req.user?.account?.accountNum)
      : true)
  ) {
    infoLog(logGenerate(req, "request", service, url));

    try {
      let serviceUrl;

      if (typeof url === "object") {
        const region = (site || account)?.awsRegion?.toLowerCase() || siteRegion;
        const isUsEast2 = region === "us-east-2";

        switch (url.service) {
          case "exp-trends-report":
            serviceUrl = isUsEast2 ? US_EAST_2_EXP_TRENDS_REPORT_SERVICE_URL : EU_WEST_1_EXP_TRENDS_REPORT_SERVICE_URL;
            break;
          case "dashboard":
            serviceUrl = isUsEast2 ? US_EAST_2_DASHBOARD_SERVICE_URL : EU_WEST_1_DASHBOARD_SERVICE_URL;
            break;
          case "report":
            serviceUrl = isUsEast2 ? US_EAST_2_REPORT_SERVICE_URL : EU_WEST_1_REPORT_SERVICE;
            break;
          case "us-report":
            serviceUrl = US_EAST_2_REPORT_SERVICE_URL;
            break;
          case "eu-report":
            serviceUrl = EU_WEST_1_REPORT_SERVICE;
            break;
          case "product":
            serviceUrl = isUsEast2 ? (typeof PRODUCT_SERVICE_URL === "string" ? PRODUCT_SERVICE_URL : PRODUCT_SERVICE_URL.us[url.partition - 1]) : (typeof PRODUCT_SERVICE_URL === "string" ? PRODUCT_SERVICE_URL : PRODUCT_SERVICE_URL.eu[url.partition - 1]);
            break;
          case "profile":
            serviceUrl = isUsEast2 ? (typeof PROFILE_SERVICE_URL === "string" ? PROFILE_SERVICE_URL : PROFILE_SERVICE_URL.us[url.partition - 1]) : (typeof PROFILE_SERVICE_URL === "string" ? PROFILE_SERVICE_URL : PROFILE_SERVICE_URL.eu[url.partition - 1]);
            break;
          case "external-service":
            serviceUrl = isUsEast2 ? US_EXTERNAL_DATA_SERVICE_URL : EU_EXTERNAL_DATA_SERVICE_URL;
            break;
          case "recs-report":
            serviceUrl = EU_WEST_RECS_REPORT_SERVICE_URL;
            break;
        }
      }

      if (!passRoleCheck && url.roles && !url.roles.includes(req.user?.role)) {
        throw new Error("Unauthorized Content! role check");
      }

      if (!passRoleCheck && methods.includes(req.method) && req.user?.domainId === "customer" && !(site || account)?.socialProof) {
        throw new Error("Unauthorized Content! method check");
      }

      axiosNodeInstanse({
        method,
        url: serviceUrl ? `${serviceUrl}${url.path}` : url,
        data,
      })
        .then(({ data }) => {
          if (req.url === "/login" && data.user) {
            const log = JSON.parse(logGenerate(req, "response", serviceUrl, url));
            const accountNum = data.userData?.accountNum || data.userData?.account?.accountNum;
            log.accountNumber = {
              accountId: accountNum ? [accountNum] : data.userData?.managedAccounts?.map(account => account.accountNum),
            };
            infoLog(JSON.stringify(log));
          }
          cb(data);
        })
        .catch(error => {
          const log = JSON.parse(logGenerate(req, "response", serviceUrl, url));
          log.status = error.response?.status || 500;
          log.data = error.response?.data || "Internal Server Error";
          writeError(JSON.stringify(log));
          res.status(log.status);
          res.send(url.errorMessage || log.data);
        });
    } catch (error) {
      writeError(`requester error: ${error}`);
    }

  } else {
    writeError({
      type: "Unauthorized Content!",
      method: req.method,
      url: typeof url === "object" ? url.path : url,
      status: 401,
      data: "first check",
      userId: req.user?.userId,
    });
    res.status(401);
    res.send("Unauthorized Content!");
  }
};

export default requester;
