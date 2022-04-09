import authRouter from "./api/controllers/auth/routes";
import userRouter from "./api/controllers/user/routes";

export default function routes(app) {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
}
