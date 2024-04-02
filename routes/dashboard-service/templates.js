import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

// const checkWord = (templates, badWordList) => {
//   const errors = [];
//   templates.forEach((message) => {
//     errors.push(
//       badWordList.find((word) =>
//         message.template
//           .replace(/[^a-zA-Z0-9 ]/g, " ")
//           .trim()
//           .replace(/   /g, " ")
//           .replace(/  /g, " ")
//           .toLowerCase()
//           .split(" ")
//           .includes(word.toLowerCase())
//       )
//     );
//   });
//   return errors;
// };

// templates list
routes.get("/site/:siteKey/templates", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/templates`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// templates details
routes.get("/site/:siteKey/templates/:templateId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/template/${req.params?.templateId}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// template create
routes.post("/site/:siteKey/templates", (req, res) => {
    requester(
      req,
      res,
      {
        service: "dashboard",
        path: `/api/v1/socialproof/site/${req.params?.siteKey}/templates`,
        roles: ["CA", "SU", "CSM", "ENG", "TC"],
      },
      "post",
      (data) => res.json(data)
    );
  }
);

// update existing locale
routes.put("/site/:siteKey/templates", (req, res, next) => {
 requester(
      req,
      res,
      {
        service: "dashboard",
        path: `/api/v1/socialproof/site/${req.params?.siteKey}/templates`,
        roles: ["CA", "SU", "CSM", "ENG", "TC"],
      },
      "put",
      (data) => res.json(data)
    );
  }
);

// delete template
routes.delete("/site/:siteKey/templates/:templateId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/template/${req.params?.templateId}`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "delete",
    (data) => res.json(data)
  )
);

// delete locale
routes.delete(
  "/site/:siteKey/templates/:templateId/locale/:localeId",
  (req, res) =>
    requester(
      req,
      res,
      {
        service: "dashboard",
        path: `/api/v1/socialproof/site/${req.params?.siteKey}/template/${req.params?.templateId}/locale/${req.params?.localeId}`,
        roles: ["CA", "SU", "CSM", "ENG", "TC"],
      },
      "delete",
      (data) => res.json(data)
    )
);

export default routes;
