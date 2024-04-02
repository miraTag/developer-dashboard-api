import { Router } from "express";
import requester from "../../requester.mjs";
const routes = Router();

routes.get("/job-feed/:siteKey", (req, res) => {

  let locale = req.query.locale;

  requester(
    req,
    res,
    {
      service: "external-service",
      path: `/instances?include=finished&job_property=site_key:${req.params?.siteKey}&job_property=job_type:feed&job_property=locale:${locale}`,
      roles: ["CA", "CRO", "SU", "CSM", "ENG", "TC", "GRO", "SR"],
    },
    "get",
    (data) => {
      const regexStatus = /processed:\s+(\d+),\s+failed:\s+(\d+)/
      const instances = data?._embedded?.instances || [];
      const sortedInstances = instances.sort((a, b) => {
        return (
          new Date(b.lifecycle.executed_at) -
          new Date(a.lifecycle.executed_at)
        );
      });
      let latestFeed =  sortedInstances.length ? sortedInstances[0] : null;
      
      if(latestFeed) {
        const feed = {
          executeDate: latestFeed.lifecycle.executed_at,
          state: latestFeed.lifecycle.state
        };
        let arrStatus = latestFeed.status.match(regexStatus);
        if(arrStatus && arrStatus.length > 2) {
            feed.processedProducts = parseInt(arrStatus[1]);
            feed.failedProducts =  parseInt(arrStatus[2]);
            res.json({ result: {success: true}, feed });
        } else {
          res.json({
            result: {
              success: false,
              errors: [latestFeed.status],
            },
          });
        }
      } else {
        res.json({
          result: {
            success: false,
            errors: ["No job instance found!"],
          },
        });
      }
    }
  );
});

export default routes;
