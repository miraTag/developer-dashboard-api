import { Op } from "sequelize";
import { Log } from "../models/log.model.js";

export const getLogs = (req, res) => {
    const { managedAccounts } = req.user;

    const { order, column, accountId } = req.query;
    const offset = +req.query.offset;
    const limit = +req.query.pageSize;

    const accountInfo = managedAccounts.find(
        (account) => account.accountNum == accountId
    );

    const queryInfo = [
        ...accountInfo.siteKeys.map(
            (key) => `"siteKey":"${key.split("|")[0]}"`
        ),
        `"accountNumber":{"accountId":[${accountId}]}`,
        `"accountId":"${accountId}"`,
    ];

    const queryObject = queryInfo.map((q) => ({
        message: { [Op.like]: `%${q}%` },
    }));

    const dbQuery = {
        where: {
            [Op.or]: queryObject,
            [Op.not]: [{ message: { [Op.like]: '%"method":"GET"%' } }],
        },
        offset,
        limit,
    };

    const orderDB = order && order === "descend" ? "DESC" : "ASC";

    if (column) {
        dbQuery.order = [[column, orderDB]];
    }
    Log.findAndCountAll(dbQuery)
        .then((data) => {
            res.send({ ...data, offset, limit });
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving logs.",
            });
        });
};
