import express from "express";
import { userRoutes } from "../routes/UserRoutes";
import { authRoutes } from "../routes/AuthRoutes";
import bodyParser from "body-parser";

require("dotenv").config();

declare global {
  namespace Express {
    interface Request {
      token: any;
    }
  }
}

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authRoutes);
app.use(userRoutes);

export { app };
