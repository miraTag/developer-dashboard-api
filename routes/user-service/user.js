import express from "express";
import { differenceInDays } from "date-fns";
import requester from "../../requester.mjs";
import { AUTH_SERVICE_URL } from "../../config.mjs";
import { jwtSign } from "../login.js";

const routes = express.Router();

routes.get("/user/profile", (req, res, next) => {
    requester(
        req,
        res,
        `${AUTH_SERVICE_URL}/api/v1/domain/${req.user.domainId}/user/${req.user.userId}`,
        "get",
        (data) => {
            try {
                const user = { ...data, iat: req.user.iat, exp: req.user.exp };
                jwtSign(req, res, user, undefined, (token, jwtData) => {
                    res.status(200);
                    res.send({ ...data, token: token });
                });
            } catch (error) {
                console.error("error", error);
            }
        },
        true
    );
});

routes.put("/user/update-profile", (req, res) =>
    requester(
        req,
        res,
        `${AUTH_SERVICE_URL}/api/v1/domain/developer/user`,
        "put",
        (data) => {
            res.json(data);
        },
        true
    )
);

routes.put("/user/update-password", (req, res) => {
    const { email } = req.user;
    const { oldPassword, newPassword } = req.body;
    const prevBody = req.body;
    body: Object.assign(prevBody, {
        oldPassword: oldPassword,
        newPassword: newPassword,
        username: email,
    });
    requester(
        req,
        res,
        `${AUTH_SERVICE_URL}/api/v1/domain/developer/password/change`,
        "put",
        (data) => {
            res.json(data);
        },
        true
    );
});

routes.put("/user/:userId/metadata", (req, res) =>
    requester(
        req,
        res,
        `${AUTH_SERVICE_URL}/api/v1/domain/developer/user/${req.params?.userId}/metadata`,
        "put",
        (data) => res.json(data),
        true
    )
);

export default routes;
