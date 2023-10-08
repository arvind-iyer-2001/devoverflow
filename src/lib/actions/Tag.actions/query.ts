import Question, { IQuestion } from "@/database/Question.model";
import Tag, { ITag } from "@/database/Tag.model";
import User from "@/database/User.model";
import { connectToDatabase } from "@/lib/db";
import { FilterQuery } from "mongoose";
import { getCurrentUser } from "../User.actions/query";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "../shared.types";

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();
    const { searchQuery, page = 1, pageSize = 10 } = params;
    const query: FilterQuery<typeof Tag> = searchQuery
      ? {
          $or: [
            { name: { $regex: new RegExp(searchQuery, "i") } },
            { username: { $regex: new RegExp(searchQuery, "i") } },
            { email: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {};
    const tags: ITag[] = await Tag.find(query, null, {
      sort: { createdAt: -1 },
      skip: (page - 1) * pageSize,
      limit: pageSize,
    });
    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }
    const { limit = 2 } = params;
    const tags: ITag[] = await Tag.find(
      {
        followers: { $in: [user._id] },
      },
      null,
      { limit }
    );
    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const query: FilterQuery<typeof Question> = searchQuery
      ? {
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { content: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {};
    const tag = await Tag.findOne({ _id: tagId }).populate({
      path: "questions",
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

    if (!tag) {
      throw new Error("Tag not found");
    }

    console.log(tag);
    if (tag.$assertPopulated("questions")) {
      const questions = tag.questions as IQuestion[];
      return { tagTitle: tag.name, questions };
    }

    console.log(
      tag.name,
      " HAS SOME DATABASE ISSUES DUE TO WHICH IT IS NOT ABLE TO LOAD THE QUESTIONS"
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}
