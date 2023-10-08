"use server";
import { createAnswer, downvoteAnswer, upvoteAnswer } from "./mutations";
import { getAnswers } from "./query";

export { createAnswer, downvoteAnswer, getAnswers, upvoteAnswer };
