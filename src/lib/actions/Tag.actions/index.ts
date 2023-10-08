"use server";
import { createOrUpdateTags, followTags } from "./mutations";
import { getAllTags, getTopInteractedTags } from "./query";

export { createOrUpdateTags, followTags, getAllTags, getTopInteractedTags };
