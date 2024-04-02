import express from "express";
import requester from "../../requester.mjs";
import getAccounts from "../../utils/getAccounts.mjs";

const routes = express.Router();

routes.get("/account/:accountId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/account/${req.params?.accountId}`,
    },
    "get",
    (data) => res.json(data)
  )
);

// routes.get("/accounts/:accountId", (req, res) =>
//   requester(
//     req,
//     res,
//     {
//       service: "dashboard",
//       path: `/api/v1/accounts?id=${req.params?.accountId}`,
//     },
//     "get",
//     (data) => res.json(data)
//   )
// );
routes.get("/bundles/:siteKey", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/bundles`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => {
      let response = data;
      response.bundles = data.bundles.map((bundle) => {
        bundle.metadata.devices ||
          (bundle.metadata.devices = ["desktop", "mobile"]);
        bundle.metadata.modules ||
          (bundle.metadata.modules = ["product", "category", "basket"]);
        return bundle;
      });
      res.json(response);
    }
  )
);

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

// create bundle, same resource is used to create new locale
routes.post("/bundles/:siteKey", (req, res) => {

  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/bundles?productPlan=business`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "post",
    (data) => res.json(data)
  );

});

// list default bundle (used to retrieve list of messages)
routes.get("/site/:siteKey/bundles_default_messages", (req, res) => {
  let module = req.query.module;
  const productPlan = req.query.productPlan;

  if (typeof module === "string") {
    module = [module];
  }

  const modulesQuery = module.map((x) => `&module=${x}`).join("");

  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/bundles/default?productPlan=${productPlan}${modulesQuery}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  );
});

// bundle details
routes.get("/site/:siteKey/bundles/:bundleId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/bundle/${req.params?.bundleId}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => {
      let response = data;
      response.bundles = response.bundles.map((bundle) => {
        bundle.metadata.devices ||
          (bundle.metadata.devices = ["desktop", "mobile"]);
        bundle.metadata.modules ||
          (bundle.metadata.modules = ["product", "category", "basket"]);
        return bundle;
      });
      res.json(response);
    }
  )
);

// experiences by bundleID
routes.get("/site/:siteKey/experiences/bundle/:bundleId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/experiences/bundle/${req.params?.bundleId}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  )
);

// update existing bundle locale
routes.put("/bundles/:siteKey", (req, res) => {
  // const errors = checkWord(req.body.templates, req.app.locals.badWordList);
  // if (errors.some((error) => error)) {
  //   res.status(400);
  //   res.send({ errors });
  // } else {
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/bundles`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "put",
    (data) => res.json(data)
  );
  // }
});
// update existing bundle locale
routes.put("/bundles/v2/:siteKey", (req, res) => {
  // const errors = checkWord(req.body.templates, req.app.locals.badWordList);
  // if (errors.some((error) => error)) {
  //   res.status(400);
  //   res.send({ errors });
  // } else {
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v2/socialproof/site/${req.params?.siteKey}/bundles`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "put",
    (data) => res.json(data)
  );
  // }
});
// delete bundle
routes.delete("/site/:siteKey/bundles/:bundleId", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/bundle/${req.params?.bundleId}`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "delete",
    (data) => res.json(data)
  )
);

routes.delete(
  "/site/:siteKey/bundles/:bundleId/locale/:localeCode",
  (req, res) =>
    requester(
      req,
      res,
      {
        service: "dashboard",
        path: `/api/v1/socialproof/site/${req.params?.siteKey}/bundle/${req.params?.bundleId}/locale/${req.params?.localeCode}`,
        roles: ["CA", "SU", "CSM", "ENG", "TC"],
      },
      "delete",
      (data) => res.json(data)
    )
);

routes.post("/bundles/:siteKey/clone", (req, res) =>
  requester(
    req,
    res,
    {
      service: "dashboard",
      path: `/api/v1/socialproof/site/${req.params?.siteKey}/bundles/clone`,
      roles: ["CA", "SU", "CSM", "ENG", "TC"],
    },
    "post",
    (data) => res.json(data)
  )
);

routes.get("/accounts", (req, res) => {
  getAccounts(req, res, (accounts) => {
    res.json(accounts);
  });
});

export default routes;
