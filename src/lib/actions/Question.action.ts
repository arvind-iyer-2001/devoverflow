"use server";

import Question, { IQuestion } from "@/database/Question.model";
import Tag from "@/database/Tag.model";
import User from "@/database/User.model";
import { QuestionProps } from "@/types/questions";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../db";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    console.log(params);
    connectToDatabase();

    const questions: IQuestion[] = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    const formattedQuestions: QuestionProps[] = questions.map((question) => ({
      _id: question._id.toString(),
      title: question.title,
      tags: question.tags.map((tag) => ({
        _id: tag._id.toString(),
        name: tag.name, // Assuming 'name' exists on your ITag interface
      })),
      author: {
        _id: question.author._id.toString(),
        name: question.author.name, // Assuming 'name' exists on your IUser interface
        picture: question.author.picture, // Assuming 'picture' exists on your IUser interface
      },
      upvotes: question.upvotes.length,
      views: question.views,
      answers: question.answers.map((answer) => ({
        /* your answer object formatting here */
      })),
      createdAt: question.createdAt,
    }));

    return { questions: formattedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // Create an interaction record for the user's ask_question action

    // Increment author's reputation by +5 for creating a question

    revalidatePath(path);
  } catch (error) {}
}
