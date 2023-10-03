"use server";
import Answer from "@/database/Answer.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../db";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();
    const answers = await Answer.find({ question: params.questionId });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    // Create the question
    await Answer.create({ content, author, question });

    // Create an interaction record for the user's ask_question action

    // Increment author's reputation by +5 for creating a question

    revalidatePath(path);
  } catch (error) {}
}
