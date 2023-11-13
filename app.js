import express from "express";
import logger from "morgan";
import cors from "cors";
import multer from "multer";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json'  assert { type: "json" };
import authRouter from "./routes/api/auth-router.js";
import waterInputRouter from "./routes/api/waterInputRouter.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/users", authRouter);
app.use("/api/waterInputs", waterInputRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = err instanceof multer.MulterError ? 400 : 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
