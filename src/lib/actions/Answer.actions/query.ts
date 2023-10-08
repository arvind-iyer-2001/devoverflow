import Answer, { IAnswer } from "@/database/Answer.model";
import { connectToDatabase } from "@/lib/db";
import { GetAnswersParams } from "../shared.types";

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });
    return { answers: answers as IAnswer[] };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
