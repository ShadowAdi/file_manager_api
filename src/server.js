import express from "express";
import cors from "cors";
import { configEnvs, PORT } from "./envs/index.js";
import { CustomErrorHandler } from "./middlewares/errorHandler.js";
import { userRouter } from "./routes/userRouter.js";


const app = express();
configEnvs();

app.use(
  cors({
    allowedHeaders: true,
    methods: ["*"],
    origin: ["*"],
  })
);

app.use(express.json());



app.use("/api/user", userRouter);

app.use(CustomErrorHandler);

try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (err) {
  console.error("Server failed to start due to DB error:", err.message);
  process.exit(1);
}