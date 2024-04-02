export const EU_WEST_1_DASHBOARD_SERVICE_URL =
  process.env.EU_WEST_1_DASHBOARD_SERVICE_URL;
export const US_EAST_2_DASHBOARD_SERVICE_URL =
  process.env.US_EAST_2_DASHBOARD_SERVICE_URL;
export const EU_WEST_1_REPORT_SERVICE = process.env.EU_WEST_1_REPORT_SERVICE;
export const US_EAST_2_REPORT_SERVICE_URL =
  process.env.US_EAST_2_REPORT_SERVICE_URL;
export const EU_WEST_RECS_REPORT_SERVICE_URL =
  process.env.EU_WEST_RECS_REPORT_SERVICE_URL;
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
export const REST_API_SERVICE_URL = process.env.REST_API_SERVICE_URL;
export const EU_WEST_1_EXP_TRENDS_REPORT_SERVICE_URL = process.env.EU_WEST_1_EXP_TRENDS_REPORT_SERVICE_URL;
export const US_EAST_2_EXP_TRENDS_REPORT_SERVICE_URL = process.env.US_EAST_2_EXP_TRENDS_REPORT_SERVICE_URL;
export const PRODUCT_SERVICE_URL =
  process.env.ENV === "qa"
    ? process.env.PRODUCT_SERVICE_URL
    : {
        eu: [
          "http://172.31.6.252:9100",
          "http://172.31.39.59:9100",
          "http://172.31.26.202:9100",
          "http://172.31.22.82:9100",
          "http://172.31.28.170:9100",
        ],
        us: ["http://172.16.11.38:9100"],
      };

// ZENDESK constants
export const ZENDESK_SERVICE_URL = process.env.ZENDESK_SERVICE_URL;
export const ZENDESK_USERNAME = process.env.ZENDESK_USERNAME;
export const ZENDESK_TOKEN = process.env.ZENDESK_TOKEN;

export const DB_NAME = process.env.DB_NAME;
export const DB_TABLE = process.env.DB_TABLE;
export const DB_HOST = process.env.DB_HOST;
export const DB_CONNECTION = JSON.parse(process.env.DB_CONNECTION);
export const DB_PORT = process.env.DB_PORT;
export const JWT_SECRET = JSON.parse(process.env.JWT_SECRET).jwt_secret;
export const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID;
export const EU_EXTERNAL_DATA_SERVICE_URL =
  process.env.EU_EXTERNAL_DATA_SERVICE_URL;
export const US_EXTERNAL_DATA_SERVICE_URL =
  process.env.US_EXTERNAL_DATA_SERVICE_URL;

export const PROFILE_SERVICE_URL =
  process.env.ENV === "qa"
    ? process.env.PROFILE_SERVICE_URL
    : {
        eu: [
          "http://internal-prdcoreapi01-2133165084.eu-west-1.elb.amazonaws.com:9200",
          "http://internal-prdcoreapi02-1305793411.eu-west-1.elb.amazonaws.com:9200",
          "http://internal-prdcoreapi03-606910195.eu-west-1.elb.amazonaws.com:9200",
          "http://internal-prdcoreapi04-lb-304480516.eu-west-1.elb.amazonaws.com:9200",
          "http://internal-prdcoreapi05-744927449.eu-west-1.elb.amazonaws.com:9200",
        ],
        us: ["http://internal-CoreParti-Core01Lb-1GVQ1ZC6TUDCW-934375864.us-east-2.elb.amazonaws.com:9200"],
      };
