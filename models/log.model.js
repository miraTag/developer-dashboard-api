import { DataTypes, Sequelize } from "sequelize";
// import { sequelize } from "./index.js";
// import { DB_TABLE } from "../config.mjs";

const formatOutput = (match, msg) => {
  const c = msg
    .filter((m) => m.match(match))
    .map((u) =>
      u
        .split(":")
        .pop()
        .split(/{|}|"|'/)
        .join("")
    );
  return c;
};

// export const Log = sequelize.define(
//     DB_TABLE,
//     {
//         id: {
//             autoIncrement: true,
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             primaryKey: true,
//         },
//         level: {
//             type: DataTypes.STRING(16),
//             allowNull: false,
//         },
//         message: {
//             type: DataTypes.STRING(2048),
//             allowNull: false,
//         },
//         userEmail: {
//             type: DataTypes.VIRTUAL,
//             get() {
//                 const msg = this.message.split(",");
//                 const rjx = /userEmail|username/;
//                 const c = formatOutput(rjx, msg);
//                 return c ? c : null;
//             },
//             set(value) {
//                 this.setDataValue("message", value);
//             },
//         },
//         userId: {
//             type: DataTypes.VIRTUAL,
//             get() {
//                 const msg = this.message.split(",");
//                 const rjx = /userId/;
//                 const c = formatOutput(rjx, msg);
//                 return c ? c : null;
//             },
//             set(value) {
//                 this.setDataValue("message", value);
//             },
//         },

//         siteKey: {
//             type: DataTypes.VIRTUAL,
//             get() {
//                 const msg = this.message.split(",");
//                 const rjx = /siteKey/;
//                 const c = formatOutput(rjx, msg);

//                 return c ? c : null;
//             },
//             set(value) {
//                 this.setDataValue("message", value);
//             },
//         },
//         accountId: {
//             type: DataTypes.VIRTUAL,
//             get() {
//                 const msg = this.message.split(",");
//                 const rjx = /accountId/;
//                 const c = formatOutput(rjx, msg);
//                 return c ? c : null;
//             },
//             set(value) {
//                 this.setDataValue("message", value);
//             },
//         },

//         method: {
//             type: DataTypes.VIRTUAL,
//             get() {
//                 const msg = this.message.split(",");
//                 const rjx = /method/;
//                 const c = formatOutput(rjx, msg);
//                 const m =
//                     c[0] === "POST"
//                         ? "CREATE"
//                         : c[0] === "PUT"
//                         ? "UPDATE"
//                         : c[0] === "DELETE"
//                         ? "DELETE"
//                         : "PATCH"
//                         ? "MODIFY"
//                         : c[0];

//                 return c ? m : null;
//             },
//             set(value) {
//                 this.setDataValue("message", value);
//             },
//         },
//         body: {
//             type: DataTypes.VIRTUAL,
//             get() {
//                 const msg = this.message.split(/body/);
//                 const m = msg[1];
//                 return m ? m : null;
//             },
//             set(value) {
//                 this.setDataValue("message", value);
//             },
//         },
//         route: {
//             type: DataTypes.VIRTUAL,
//             get() {
//                 const msg = this.message.split(",");
//                 const rjx = /url/g;
//                 const c = formatOutput(rjx, msg);
//                 return c ? c : null;
//             },
//             set(value) {
//                 this.setDataValue("message", value);
//             },
//         },
//         meta: {
//             type: DataTypes.JSON,
//             allowNull: false,
//         },
//         timestamp: {
//             type: DataTypes.DATE,
//             allowNull: false,
//         },
//     },
//     {
//         sequelize,
//         tableName: DB_TABLE,
//         timestamps: false,
//         indexes: [
//             {
//                 name: "PRIMARY",
//                 unique: true,
//                 using: "BTREE",
//                 fields: [{ name: "id" }],
//             },
//         ],
//     }
// );
