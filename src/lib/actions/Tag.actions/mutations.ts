import Tag from "@/database/Tag.model";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongoose";

export async function createOrUpdateTags(questionId: ObjectId, tags: string[]) {
  try {
    connectToDatabase();
    // Collect all tag names to search for existing ones in one go
    const tagQueries = tags.map((tag) => ({
      name: { $regex: new RegExp(`^${tag}$`, "i") },
    }));

    // Find existing tags
    const existingTags = await Tag.find({ $or: tagQueries });
    await Tag.deleteMany({ $nor: tagQueries });

    // Identify which tags are new and need to be created
    const existingTagNames = new Set(
      existingTags.map((t) => t.name.toLowerCase())
    );
    const newTags = tags.filter(
      (tag) => !existingTagNames.has(tag.toLowerCase())
    );

    // Create new tags and associate them with the question
    const newTagDocs = await Tag.insertMany(
      newTags.map((name) => ({ name, questions: [questionId] }))
    );

    // Update existing tags to associate them with the new question
    await Tag.updateMany(
      { _id: { $in: existingTags.map((t) => t._id) } },
      { $push: { questions: questionId } }
    );

    // Update the question to associate it with all the tags (existing + new)
    const tagDocuments = [...existingTags, ...newTagDocs].map((t) => t._id);

    return tagDocuments;
  } catch (error) {}
}

export async function followTags(userId: ObjectId, tagId: string) {
  Tag.findByIdAndUpdate(tagId, {
    $push: { userId },
  });
}
