import express from "express";
import multer from "multer";
import { axiosNodeInstanse } from "../../axiosNodeInstanse.mjs";
import {
    ZENDESK_SERVICE_URL,
    ZENDESK_USERNAME,
    ZENDESK_TOKEN,
} from "../../config.mjs";

const routes = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createTicket = (ticket, options) => {
    return new Promise((resolve, reject) => {
        // resolve({ ticket: { id: 12 } });
        axiosNodeInstanse
            .post(`${ZENDESK_SERVICE_URL}/api/v2/tickets.json`, ticket, options)
            .then((service_resp) => {
                resolve(service_resp.data);
            })
            .catch(reject);
    });
};

// create zendesk ticket
routes.post(
    "/account/:accountId/tickets",
    upload.single("screenshot"),
    (req, res, next) => {
        const { firstName, lastName, email } = req.user;
        const { subject, body, priority } = req.body;
        const token = `${ZENDESK_USERNAME}/token:${ZENDESK_TOKEN}`;
        const encodedToken = Buffer.from(token).toString("base64");
        const headers = { Authorization: "Basic " + encodedToken };

        const formData = {
            ticket: {
                subject,
                priority,
                comment: {
                    body,
                },
                requester: {
                    email,
                    name: `${firstName} ${lastName}`,
                },
            },
        };

        const filename = req.file?.originalname.replace(/[^\w\.\-_]/gi, "");

        if (filename) {
            const limit = 2;
            const isSizeValid =
                req.file.buffer.toString().length / 1024 / 1024 < limit;

            if (!isSizeValid) {
                res.status(400).send(
                    `Screenshot must be smaller than ${limit}MB!`
                );
            }

            axiosNodeInstanse
                .post(
                    `${ZENDESK_SERVICE_URL}/api/v2/uploads?filename=${filename}`,
                    req.file.buffer,
                    {
                        headers: {
                            ...headers,
                            "Content-Type": "application/binary",
                        },
                    }
                )
                .then((service_resp) => {
                    const utoken = service_resp.data.upload.token;
                    formData.ticket.comment.uploads = [utoken];
                    createTicket(formData, { headers })
                        .then((result) => {
                            res.json({ id: result.ticket.id });
                            next();
                        })
                        .catch((err) => {
                            res.status(err.response.status);
                            res.send(err.response.data);
                            next();
                        });
                })
                .catch((err) => {
                    res.status(err.response.status);
                    res.send(err.response.data);
                    next();
                });
        } else {
            createTicket(formData, { headers })
                .then((result) => {
                    res.json({ id: result.ticket.id });
                    next();
                })
                .catch((err) => {
                    res.status(err.response.status);
                    res.send(err.response.data);
                    next();
                });
        }
    }
);

export default routes;
