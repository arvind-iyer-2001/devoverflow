"use server";
import {
  createUser,
  deleteUser,
  toggleSaveQuestion,
  updateUser,
} from "./mutation";

import {
  getAllUsers,
  getCurrentUser,
  getSavedQuestions,
  getTopInteractedTags,
} from "./query";

export {
  createUser,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  getSavedQuestions,
  getTopInteractedTags,
  toggleSaveQuestion,
  updateUser,
};
