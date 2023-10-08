import Answer from "@/database/Answer.model";
import Question, { IQuestion } from "@/database/Question.model";
import Tag from "@/database/Tag.model";
import User from "@/database/User.model";
import { connectToDatabase } from "@/lib/db";
import { FilterQuery } from "mongoose";
import { GetQuestionByIdParams, GetQuestionsParams } from "../shared.types";

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const question: IQuestion | null = await Question.findById(
      params.questionId
    )
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({ path: "answers", model: Answer, select: "_id" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture reputation",
      });
    if (!question) {
      return { question: null };
    }
    return { question };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const { page = 1, pageSize = 20, searchQuery } = params;
    const query: FilterQuery<typeof Question> = searchQuery
      ? {
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { content: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {};
    const questions: IQuestion[] = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
        options: {
          limit: 4,
        },
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name username picture",
      })
      .populate({ path: "answers", model: Answer, select: "_id" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
