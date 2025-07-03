import { configDotenv } from "dotenv";

export const configEnvs = () => {
  configDotenv();
};

configEnvs()

export const PORT = process.env.PORT;
export const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY;
