import express from "express";
import jwt from "jsonwebtoken";
import { differenceInDays } from "date-fns";
import { AUTH_SERVICE_URL, JWT_SECRET } from "../config.mjs";
import requester from "../requester.mjs";
import getAccounts from "../utils/getAccounts.mjs";

const login = express.Router();

const jwtSign = (req, res, data, remember, cb) => {
  getAccounts(
    req,
    res,
    (accounts) => {
      const jwtData = {
        ...data.user,
        ...data.userData,

      };

      // If remember is undefined, set iat and exp from data
      if (typeof remember === "undefined") {
        jwtData.iat = data.iat;
        jwtData.exp = data.exp;
      }

      // Generate the JWT
      const token =
        typeof remember !== "undefined"
          ? jwt.sign(jwtData, JWT_SECRET, { expiresIn: "7d" })
          : jwt.sign(jwtData, JWT_SECRET);

      // Pass the token and jwtData to the callback
      cb(token, jwtData);
    },
    [
      {
        accountNum: data?.userData?.account?.accountNum,
        awsRegion: data?.userData?.account?.awsRegion,
      },
    ]

  );
};

const loginProcess = (req, res, data, remember) => {
  if (data.user) {
    jwtSign(req, res, data, remember, (token, jwtData) => {
      // If remember is undefined, set iat and exp from data
      if (typeof remember === "undefined") {
        jwtData.iat = data.iat;
        jwtData.exp = data.exp;
      }
      res.status(200);
      res.send({ ...data, token: token });
    });
  } else {
    res.status(200);
    res.send(data);
  }
};

login.post("/login", (req, res) =>
  requester(
    req,
    res,
    `${AUTH_SERVICE_URL}/api/v1/domain/developer/authenticate`,
    "post",
    (data) => loginProcess(req, res, data, req.body.remember)
  )

);

login.post("/2fa", (req, res) =>
  requester(
    req,
    res,
    `${AUTH_SERVICE_URL}/api/v1/domain/developer/authenticate/verify`,
    "post",
    (data) => loginProcess(req, res, data, req.body.remember)
  )
);

login.post("/code", (req, res) =>
  requester(
    req,
    res,
    `${AUTH_SERVICE_URL}/api/v1/domain/developer/authenticate/verify/resend`,
    "post",
    (data) => res.json(data)
  )
);

login.post("/forgot-password", async (req, res) => {
  req.body.url =
    process.env.ENV === "prd" &&
    "https://developer.taggstar.com/reset-password"


  requester(
    req,
    res,
    `${AUTH_SERVICE_URL}/api/v1/domain/developer/password/reset`,
    "post",
    (data) => res.json(data)
  );
});

login.post("/reset-password", (req, res) =>
  requester(
    req,
    res,
    `${AUTH_SERVICE_URL}/api/v1/domain/developer/password/reset/update`,
    "put",
    (data) => res.json(data)
  )
);

export { jwtSign };

export default login;
