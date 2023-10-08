import Answer from "@/database/Answer.model";
import Question from "@/database/Question.model";
import Tag from "@/database/Tag.model";
import { connectToDatabase } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createOrUpdateTags } from "../Tag.actions";
import { getCurrentUser } from "../User.actions";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  QuestionVoteParams,
} from "../shared.types";

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

    // Create the tags or get them if they already exist
    const tagDocuments = createOrUpdateTags(question._id, tags);

    // Add the tags to the question
    const newQuestion = await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });
    revalidatePath(path);

    if (!newQuestion) {
      return null;
    }
    return question._id;
  } catch (error) {}
}

export async function toggleUpvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

    let updateQuery = {};

    if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleDownvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

    let updateQuery = {};

    if (hasDownvoted) {
      updateQuery = { $pull: { downvote: userId } };
    } else if (hasUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // Increment author's reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    //   await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();
    const user = await getCurrentUser();
    const { questionId, title, content, path, tags } = params;

    if (!user) {
      throw new Error("Request Unauthorized");
    }

    const question = await Question.findById(questionId).populate({
      path: "tags",
      model: Tag,
    });

    if (!question) {
      throw new Error("Question not found");
    }
    // if (!ObjectId(question.author).equals(user._id)) {
    //   throw new Error("Request Unauthorized");
    // }
    // Create the tags or get them if they already exist
    const tagDocuments = createOrUpdateTags(question._id, tags);

    await question.updateOne({
      title,
      content,
      tags: tagDocuments,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
