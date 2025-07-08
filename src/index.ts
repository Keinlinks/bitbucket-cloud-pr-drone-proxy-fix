import * as express from "express";
import * as fs from "fs";
import type { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { WebhookBitbucketCloudPR } from "./models/WebhookBitbucketCloudPR";
import { transformBitbucketWebhookPRToOnPremisePR } from "./utils";
import { logger } from "./logging";

require("dotenv").config();

const app = express.default();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const proxyMiddleware = createProxyMiddleware<Request, Response>({
  target: process.env.TARGET_URL,
  changeOrigin: true,
  ssl: {
    key: fs.readFileSync("/certs/key.pem"),
    cert: fs.readFileSync("/certs/cert.pem"),
  },
  on: {
    proxyReq(proxyReq, req, res) {
      // New request incoming to the proxy
      logger.debug(`Received request: ${req.method} ${req.url}`);
      logger.info(`Proxying request to target: ${process.env.TARGET_URL}`);

      if (req.method == "POST" && req.body && req.body.pullrequest) {
        let bodyWebhookBitbicketCloud = req.body as WebhookBitbucketCloudPR;
        logger.debug(`Body data original: ${bodyWebhookBitbicketCloud}`);
        try {
          logger.info(`Transforming Bitbucket Cloud PR to On-Premise PR`);
          let bodyWebhookBitbicketOnPremise =
            transformBitbucketWebhookPRToOnPremisePR(bodyWebhookBitbicketCloud);
          logger.info(`Transformed PR: ${bodyWebhookBitbicketOnPremise}`);
          let bodyData = JSON.stringify(bodyWebhookBitbicketOnPremise);
          logger.debug(`Body data parsed: ${bodyData}`);

          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        } catch (error) {
          logger.error(
            `Error transforming Bitbucket Cloud PR to On-Premise PR: ${error}`
          );
          res.status(500).send("Internal Server Error");
          return;
        }
      }
    },
    error: (err, req, res) => {
      logger.error(`Error in proxy request: ${err.message}`);
    },
    proxyRes: (proxyRes, req, res) => {
      logger.error(`received response from target: ${proxyRes.statusCode}`);
    },
  },
});
app.use("/", proxyMiddleware);

app.listen(process.env.PROXY_PORT || 80, () => {
  logger.info(
    `Proxy server is running on port ${
      process.env.PROXY_PORT || 80
    }, target: ` + process.env.TARGET_URL
  );
});
