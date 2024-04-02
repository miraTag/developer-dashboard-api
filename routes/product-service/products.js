import express from "express";
import requester from "../../requester.mjs";

const routes = express.Router();

// get products
routes.get("/site/:siteKey/products", (req, res) => {
  // fixme: use FE-provided sitekey when product-service with work with all site keys
  // const siteKey = req.params.siteKey;

  // let term = req.query.term;
  // let brand = req.query.brand;
  // let category = req.query.category;
  // let priceFrom = req.query.priceFrom;
  // let priceTo = req.query.priceTo;
  // let sort = req.query.sort;
  // let max = req.query.max;
  // let last = req.query.last;
  // let queryParams = [];
  // if (term) {
  //     queryParams.push(`term=${term}`);
  // }
  // if (brand) {
  //     queryParams.push(`brand=${brand}`);
  // }
  // if (priceFrom) {
  //     queryParams.push(`priceFrom=${priceFrom}`);
  // }
  // if (priceTo) {
  //     queryParams.push(`priceTo=${priceTo}`);
  // }
  // if (category) {
  //     queryParams.push(`category=${category}`);
  // }
  // if (max) {
  //     queryParams.push(`max=${max}`);
  // }
  // if (last) {
  //     queryParams.push(`last=${last}`);
  // }
  // if (sort) {
  //     queryParams.push(`sort=${sort}`);
  // }

  requester(
    req,
    res,
    {
      service: "product",
      path: `/api/v1/key/${req.params?.siteKey}/products/query?${Object.keys(
        req.query
      )
        .map((key) => {
          let keyV = req.query[key];
          if(key === 'term') {
            keyV = keyV.replace(/_AMP_/g, '%26')
          }
          return `${key}=${keyV}`
        })
        .join("&")}`,
      partition: Number(req.query.part || 0),
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => res.json(data)
  );
});

export default routes;
