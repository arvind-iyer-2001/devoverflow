import Answer from "@/database/Answer.model";
import Question, { IQuestion } from "@/database/Question.model";
import Tag, { ITag } from "@/database/Tag.model";
import User, { IUser } from "@/database/User.model";
import { connectToDatabase } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery } from "mongoose";
import {
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetTopInteractedTagsParams,
  GetUserByIdParams,
  GetUserStatsParams,
} from "../shared.types";

export async function getCurrentUser() {
  try {
    connectToDatabase();
    const { userId } = auth();
    const user = await User.findOne({ clerkId: userId });
    if (user !== null) {
      return user as IUser;
    }
    return null;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 20, searchQuery } = params;
    // const { filter } = params;
    const query: FilterQuery<typeof User> = searchQuery
      ? {
          $or: [
            { name: { $regex: new RegExp(searchQuery, "i") } },
            { username: { $regex: new RegExp(searchQuery, "i") } },
            { email: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {};
    const users: IUser[] = await User.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();
    const { userId } = auth();
    // eslint-disable-next-line no-unused-vars
    const { searchQuery, page = 1, pageSize = 10, filter } = params;
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    const user = await User.findOne({ clerkId: userId }).populate({
      path: "saved",
      model: Question,
      match: query,
      options: {
        sort: { createdAt: -1 },
        skip: (page - 1) * pageSize,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.$assertPopulated("saved")) {
      const savedQuestions = user.saved as IQuestion[];
      return { savedQuestions };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = auth();
    const user = await User.findOne({ clerkId: userId }).populate({
      path: "following",
      model: Tag,
      options: {
        sort: { createdAt: -1 },
        limit: 2,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    if (user.$assertPopulated("following")) {
      const tags = user.following as ITag[];
      return { tags };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    return { totalQuestions, questions: userQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase();
    const { userId, page = 1, pageSize = 10 } = params;
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id clerkId name picture");

    return { totalAnswers, answers: userAnswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
