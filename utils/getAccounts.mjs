import requester from "../requester.mjs";
import {
    EU_WEST_1_DASHBOARD_SERVICE_URL,
    US_EAST_2_DASHBOARD_SERVICE_URL,
} from "../config.mjs";

const getWestAccounts = (req, res, accounts, cb) => {
    if (accounts.length > 0) {
        requester(
            req,
            res,
            `${EU_WEST_1_DASHBOARD_SERVICE_URL}/api/v2/accounts?${accounts
                ?.map((x) => `id=${x}`)
                ?.join("&")}`,
            "get",
            (data) => cb(data.accounts),
            true
        );
    } else {
        cb([]);
    }
};

const getEastAccounts = (req, res, accounts, cb) => {
    if (accounts.length > 0) {
        requester(
            req,
            res,
            `${US_EAST_2_DASHBOARD_SERVICE_URL}/api/v2/accounts?${accounts
                ?.map((x) => `id=${x}`)
                ?.join("&")}`,
            "get",
            (data) => cb(data.accounts),
            true
        );
    } else {
        cb([]);
    }
};

const getAccounts = (req, res, cb, accounts) => {
    const result = (accounts || req.user?.managedAccounts)?.reduce(
        (arr, cur) => {
            if (cur.awsRegion?.toLowerCase() === "us-east-2") {
                arr.east.push(cur.accountNum);
            } else {
                arr.west.push(cur.accountNum);
            }
            return arr;
        },
        { west: [], east: [] }
    );

    getWestAccounts(req, res, result.west, (westAccounts) => {
        getEastAccounts(req, res, result.east, (eastAccounts) => {
            cb(westAccounts.concat(eastAccounts));
        });
    });
};

export default getAccounts;
