import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

// get categories
routes.get("/site/:siteKey/product_categories", (req, res) => {
  // const siteKey = req.params.siteKey;
  // fixme: use FE-provided sitekey when product-service with work with all site keyslet brand = req.query.brand;

  let locale = req.query.locale;
  let query = "";
  if (locale) {
    query = `locale=${locale}`;
  }

  requester(
    req,
    res,
    {
      service: "product",
      path: `/api/v1/key/${req.params?.siteKey}/categories?${query}`,
      partition: Number(req.query.part || 0),
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) =>
      res.json({
        categories: data?.categories
          ?.filter((x) => x.type === "category")
          .map((x) => x.name),
        alCategories: data?.categories
          ?.filter((x) => x.type === "altCategory")
          .map((x) => x.name),
      })
  );
});

// get brands
routes.get("/site/:siteKey/brands", (req, res) => {
  // const siteKey = req.params.siteKey;
  // fixme: use FE-provided sitekey when product-service with work with all site keys
  // let category = req.query.category;
  // let query = "";
  // if (category) {
  //   query = `category=${category}`;
  // }

  let locale = req.query.locale;
  let query = "";
  if (locale) {
    query = `locale=${locale}`;
  }
  
  requester(
    req,
    res,
    {
      service: "product",
      path: `/api/v1/key/${req.params?.siteKey}/brands/query?${query}`,
      partition: Number(req.query.part || 0),
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) =>
      res.json({
        brands: data?.brands
          // .filter((x) => x.productsCount > 0)
          .map((x) => x.name)
          .sort(),
      })
  );
});

export default routes;
