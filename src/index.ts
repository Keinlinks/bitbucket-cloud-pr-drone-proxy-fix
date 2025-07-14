import * as express from "express";
import * as fs from "fs";
import * as https from "https";
import type { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { WebhookBitbucketCloudPR } from "./models/WebhookBitbucketCloudPR";
import { transformPRtoPush } from "./utils";
import { logger } from "./logging";
require("dotenv").config();

if (!process.env.TARGET_URL) {
  logger.error(`Error: TARGET_URL undefined`);
  process.exit(1);
}

let useHttps = process.env.USE_HTTPS == "true";

const app = express.default();
app.use(express.json({ limit: "10mb" }));

let key = undefined;
let cert = undefined;
if (useHttps) {
  try {
    key = fs.readFileSync("/certs/key.pem");
    cert = fs.readFileSync("/certs/cert.pem");
  } catch (error) {
    logger.error(`Error reading SSL certificate files: ${error}`);
  }
}

const proxyMiddleware = createProxyMiddleware<Request, Response>({
  target: process.env.TARGET_URL,
  changeOrigin: true,
  ssl: {
    key,
    cert,
  },
  timeout: 90000,
  proxyTimeout: 90000,
  secure: false,
  on: {
    proxyReq(proxyReq, req, res) {
      // New request incoming to the proxy
      logger.debug(`Received request: ${req.method} ${req.url}`);
      if (
        req.method == "POST" &&
        req.body &&
        (req.headers["x-event-key"] === "pullrequest:created" ||
          req.headers["x-event-key"] === "pullrequest:updated")
      ) {
        let bodyWebhookBitbicketCloud = req.body as WebhookBitbucketCloudPR;

        try {
          logger.info(`Transforming Bitbucket Cloud PR to Push event`);
          let bodyWebhookBitbicketPush = transformPRtoPush(
            bodyWebhookBitbicketCloud
          );
          logger.info(`Transformed PR: ${bodyWebhookBitbicketPush}`);
          let bodyData = JSON.stringify(bodyWebhookBitbicketPush);
          logger.debug(`Body data parsed: ${bodyData}`);

          // Set the new headers and body for the proxy request
          proxyReq.setHeader("X-Event-Key", "repo:push");
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
        //other events like repo:push
      } else if (req.method == "POST" && req.headers["x-event-key"]) {
        logger.debug(
          `Event key: ${req.headers["x-event-key"]}, ignored`
        );
        res.status(200).send("OK");
      }
    },
    error: (err, req, res) => {
      logger.error(`Error in proxy request: ${err.message}`);
    },
    proxyRes: (proxyRes, req, res) => {
      logger.debug(`Sending response, code: ${proxyRes.statusCode}`);
    },
  },
});
app.use("/", proxyMiddleware);

let port: number;
try {
  port = parseInt(process.env.PROXY_PORT as any);
} catch (error) {
  logger.error(`Error parsing PROXY_PORT: ${error}`);
  port = 443;
}
if (useHttps) {
  https
    .createServer(
      {
        key,
        cert,
      },
      app
    )
    .listen(port, "0.0.0.0", undefined, () => {
      logger.info(
        `Proxy server HTTPS is running on port ${port}, target: ` +
          process.env.TARGET_URL
      );
    });
} else {
  app.listen(port, "0.0.0.0", () => {
    logger.info(
      `Proxy server HTTP is running on port ${port}, target: ` +
        process.env.TARGET_URL
    );
  });
}