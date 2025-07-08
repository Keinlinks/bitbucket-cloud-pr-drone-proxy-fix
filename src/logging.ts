import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  defaultMeta: { service: "drone-proxy-fix" },
  transports: [new winston.transports.Console()],
});