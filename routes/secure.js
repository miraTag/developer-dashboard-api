import express from "express";

const routes = express.Router();

routes.get(
    '/profile',
    (req, res, next) => {
        res.json(req.user)
    }
);

export default routes;