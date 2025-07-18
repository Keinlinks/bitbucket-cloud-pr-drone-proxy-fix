import * as express from "express";
import * as fs from "fs";
import * as https from "https";
import type { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { WebhookBitbucketCloudPR } from "./models/WebhookBitbucketCloudPR";
import { isPullrequest, transformPRtoPush } from "./utils";
import { logger } from "./logging";
import { WebhookBitbucketCloudPush } from "./models/WebhookBitbucketCloudPush";
import { ProxyConfig } from "./proxyConfig";
require("dotenv").config();

let proxyConfig = ProxyConfig.getInstance();

//ENVIRONMENT
let branchesAllowPush = process.env.BRANCHES_ALLOWED_PUSH;
let target = process.env.TARGET_URL;
let useHttps = process.env.USE_HTTPS == "true";
let port: number;
try {
  port = parseInt(process.env.PROXY_PORT as any);
} catch (error) {
  logger.error(`Error parsing PROXY_PORT: ${error}`);
  port = 443;
}
if (!target) {
  logger.error(`Error: TARGET_URL undefined`);
  process.exit(1);
}
if (branchesAllowPush){
  let branches = branchesAllowPush.split(",");
  proxyConfig.addBranches(branches);
}

//Just in case use Https
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

//Creating server
const app = express.default();
app.disable("x-powered-by");
app.use(express.json({ limit: "10mb" }));

//Creating proxy middleware
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
      logger.info(`Received request: ${req.method} ${req.url}`);
      if (
        req.method == "POST" &&
        req.body &&
        (req.headers["x-event-key"] === "pullrequest:created" ||
          req.headers["x-event-key"] === "pullrequest:updated")
      ) {
        let bodyWebhookBitbicketCloud = req.body as WebhookBitbucketCloudPR;

        try {
          logger.debug(`Transforming Bitbucket Cloud PR to Push event`);
          let bodyWebhookBitbicketPush = transformPRtoPush(
            bodyWebhookBitbicketCloud
          );
          let bodyData = JSON.stringify(bodyWebhookBitbicketPush);

          // Set the new headers and body for the proxy request
          proxyReq.setHeader("X-Event-Key", "repo:push");
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

          proxyReq.write(bodyData);
        } catch (error) {
          logger.error(
            `Error transforming Bitbucket Cloud PR to Push: ${error}`
          );
          res
            .status(400)
            .send(`Error transforming Bitbucket Cloud PR to Push: ${error}`);
          return;
        }
      } else if (
        req.method == "POST" &&
        req.headers["x-event-key"] == "repo:push"
      ) {
        let bodyWebhookBitbicketPush = req.body as WebhookBitbucketCloudPush;
        let branch = bodyWebhookBitbicketPush.push.changes[0].new.name;
        if (!branch) {
          bodyWebhookBitbicketPush.push.changes[0].old.name;
        }
        let proxyConfig = ProxyConfig.getInstance();

        if (
          proxyConfig.branchesAllowPush.includes(branch) && !isPullrequest(bodyWebhookBitbicketPush)
        ) {
          let bodyData = JSON.stringify(bodyWebhookBitbicketPush);
          proxyReq.setHeader("X-Event-Key", "repo:push");
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

          proxyReq.write(bodyData);
        } else {
          logger.debug(
            `Event key: ${req.headers["x-event-key"]} to branch ${branch}, ignored`
          );
          res
            .status(406)
            .send("Event ignored: no pull request or push on main/develop");
        }
      }
      //other events like pullrequest:rejected or pullrequest:fulfilled
      else if (req.method == "POST" && req.headers["x-event-key"]) {
        logger.debug(`Event key: ${req.headers["x-event-key"]}, ignored`);
        res.status(406).send("Event ignored: no pull request or push on main/develop");
      }
    },
    error: (err, req, res) => {
      logger.error(`Error in proxy request: ${err.message}`);
    },
    proxyRes: (proxyRes, req, res) => {
      
    },
  },
});
app.use("/", proxyMiddleware);

//Start server Http or Https
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
        `Proxy server HTTPS is running on port ${port}, target: ` + target
      );
    });
} else {
  app.listen(port, "0.0.0.0", () => {
    logger.info(
      `Proxy server HTTP is running on port ${port}, target: ` + target
    );
  });
}