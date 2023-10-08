import Question from "@/database/Question.model";
import User, { IUser } from "@/database/User.model";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import {
  CreateUserParams,
  DeleteUserParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "../shared.types";

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    if (newUser) {
      return newUser as IUser;
    }
    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    if (updatedUser) {
      revalidatePath(path);
      return updatedUser as IUser;
    }
    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete user from database
    // and questions, answers, comments, etc.

    // get user question ids
    // const userQuestionIds = await Question.find({ author: user._id}).distinct('_id');

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();
    const { ObjectId } = mongoose.Types;
    const { userId, questionId, path } = params;
    const questionObjectId = new ObjectId(questionId);

    // Try to remove the question first
    const removed = await User.findByIdAndUpdate(
      userId,
      { $pull: { saved: questionObjectId } },
      { new: true }
    );

    // Check if the question was actually removed
    if (removed && removed.saved.some((id) => id.toString() === questionId)) {
      // The question was not removed, so it wasn't there; add it
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionObjectId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
