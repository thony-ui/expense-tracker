import type { NextFunction, Request, Response } from "express";
import { validateGetUser, validatePostUser } from "./user.validator";
import { getUserFromDataBase, postUserToDatabase } from "./user.service";

export const postUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email } = req.body;
  const id = req.user.id;
  try {
    const parsedData = validatePostUser({ id, email, name });
    await postUserToDatabase(parsedData);
    res.status(200).json({ message: "User added to database" });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.user.id;
  try {
    const parsedId = validateGetUser({ id });
    const user = await getUserFromDataBase(parsedId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
