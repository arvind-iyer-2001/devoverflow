"use server";

import User, { IUser } from "@/database/User.model";
import { connectToDatabase } from "../db";

export async function getUserById(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user as IUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
