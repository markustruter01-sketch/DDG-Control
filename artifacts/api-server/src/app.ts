import express, { type Express } from "express";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { securityHeaders } from "./lib/security-headers";

const app: Express = express();
app.disable("x-powered-by");

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// The Finance showcase push is bigger than the default 100 kB; that one route reads its own body (routes/showcase.ts).
app.use((req, res, next) => (req.path === '/api/inbound/finance-showcase' ? next() : express.json()(req, res, next)));
app.use(express.urlencoded({ extended: true }));

app.use("/api", securityHeaders, router);

export default app;
