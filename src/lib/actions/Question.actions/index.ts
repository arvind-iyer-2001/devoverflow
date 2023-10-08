"use server";
import {
  createQuestion,
  editQuestion,
  toggleDownvoteQuestion,
  toggleUpvoteQuestion,
} from "./mutations";
import { getQuestionById, getQuestions } from "./query";

export {
  createQuestion,
  editQuestion,
  getQuestionById,
  getQuestions,
  toggleDownvoteQuestion,
  toggleUpvoteQuestion,
};
