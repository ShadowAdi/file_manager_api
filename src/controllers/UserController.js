import bcrypt from "bcrypt";
import { logger } from "../utils/logger.js";
import { CustomTryCatch } from "../utils/CustomTryCatch.js";
import { AppError } from "../utils/AppError.js";
import { TokenGenerator } from "../utils/TokenGenerator.js";
import { createUser, readUsers } from "../utils/ReadWrite.js";
import { v4 as uuidv4 } from "uuid";

export const RegisterUser = CustomTryCatch(async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    logger.error(
      `Missing fields: email=${email}, password=${password}, name=${name}`
    );
    return next(new AppError(`Required data missing`, 400));
  }

  const users = await readUsers();
  const isUserExist = users.find((user) => user.email === email);

  if (isUserExist) {
    logger.error(`User already exists with email: ${email}`);
    return next(new AppError(`User already exists with email: ${email}`, 409));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), email, name, password: hashedPassword };

  await createUser(user);

  logger.info(`User created with email: ${email}`);
  return res.status(201).json({
    success: true,
    message: "User created successfully",
  });
});

export const LoginUser = CustomTryCatch(async (req, res, next) => {
  const data = req.body;
  const { email, password } = data;
  if (!email || !password) {
    logger.error(
      `Required Data is not present Email:${email}, password:${password}, `
    );
    console.log(
      `Required Data is not present Email:${email}, password:${password}`
    );
    return next(
      new AppError(
        `Required Data is not present Email:${email}, password:${password}`,
        404
      )
    );
  }
  const users = await readUsers();
  const isUserExist = users.find((user) => user.email === email);
  if (!isUserExist) {
    logger.error(`User Not Exist. Email:${email}, password:${password}, `);
    console.log(`User Not Exist.  Email:${email}, password:${password}`);
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    isUserExist.password
  );
  if (!isPasswordCorrect) {
    logger.error(
      `Invalid Credentails email: ${email} and password: ${password}`
    );
    return next(
      new AppError(
        `Invalid Credentails email: ${email} and password: ${password}`,
        404
      )
    );
  }
  const payload = {
    email: isUserExist.email,
    sub: isUserExist.id,
  };
  const token = await TokenGenerator(payload);
  return res.status(200).json({
    success: true,
    statusCode: 200,
    user: isUserExist,
    token,
  });
});

export const AuthenticatedUser = CustomTryCatch(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    logger.error(`Failed to get the authenticated user ${user}`);
    console.log(`Failed to get the authenticated user ${user}`);
    return next(
      new AppError(`Failed to get the authenticated user ${user}`, 404)
    );
  }
  const { email, sub } = user;
  if (!sub) {
    logger.error(`Failed to get the authenticated user ${sub}`);
    console.log(`Failed to get the authenticated user ${sub}`);
    return next(
      new AppError(`Failed to get the authenticated user ${sub}`, 404)
    );
  }
  const users = await readUsers();
  const isUserExist = users.find((user) => user.email === email);
  if (!isUserExist) {
    logger.error(`User Not Exist. Email:${email}, password:${password}, `);
    console.log(`User Not Exist.  Email:${email}, password:${password}`);
  }
  if (isUserExist.email !== email) {
    logger.error(`User With email Do Not Exist: ${email}`);
    console.log(`User With email Do Not Exist: ${email}`);
    return next(new AppError(`User With email Do Not Exist: ${email}`, 404));
  }
  return res.status(200).json({
    statusCode: 200,
    user: isUserExist,
    message: "User Found",
    success: true,
  });
});
