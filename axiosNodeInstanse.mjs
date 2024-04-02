import axios from "axios";
import { writeError, warningLog } from "./logger.mjs";

export const axiosNodeInstanse = axios.create();

const checkResponseTime = (duration, res) => {
    if (duration > 250) {
        warningLog({
            type: "lateResponse",
            duration,
            date: new Date().toISOString(),
            status: res?.status,
            method: res?.config?.method,
            url: res?.config?.url,
        });
    }
};

axiosNodeInstanse.interceptors.request.use((config) => {
    config.meta = config.meta || {};
    config.meta.requestStartedAt = new Date().getTime();

    return config;
});

axiosNodeInstanse.interceptors.response.use(
    (res) => {
        try {
            const duration =
                new Date().getTime() - res.config.meta.requestStartedAt;

            checkResponseTime(duration, res);
        } catch (error) {}
        return res;
    },
    (error) => {
        try {
            const duration =
                new Date().getTime() - error.config.meta.requestStartedAt;

            checkResponseTime(duration, error);
        } catch (error) {}

        if (!error.response) {
            writeError({
                date: new Date().toISOString(),
                type: "interceptor response",
                data: error?.message || "",
            });
        }
        return Promise.reject({
            response: {
                status: error?.response?.status || 500,
                data: error?.response?.data || {},
            },
        });
    }
);
