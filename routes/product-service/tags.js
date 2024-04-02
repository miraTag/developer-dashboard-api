import express from "express";
//import fs from "fs";
import requester from "../../requester.mjs";

const routes = express.Router();

routes.get("/site/:siteKey/tags/:id/products",  (req, res) => {

  // const siteKey = req.params.siteKey;
  // const id = req.params.id;
  let locale = req.query.locale;

  // /api/v1/key/demov1/tags/vegan/products?locale=en-GB
  requester(
    req,
    res,
    {
      service: "product",
      path: `/api/v1/key/${req.params?.siteKey}/tags/${req.params?.id}/products?locale=${locale}`,
      partition: Number(req.query.part || 0),
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) =>
      res.json(data)
  );
  
    // try {
    //     const data =  fs.readFileSync("trend-products-mock.json");
    //     const jsonData = JSON.parse(data);
    
    //     res.json(jsonData);
    //   } catch (error) {
    //     console.error("Error reading or parsing JSON:", error);
    //     res.status(500).send("Internal Server Error" );
    //   }
});

export default routes;