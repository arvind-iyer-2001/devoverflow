import { z } from "zod";

export const QuestionFormSchema = z.object({
  title: z.string().min(10).max(180),
  explanation: z.string().min(30),
  tags: z.array(z.string().min(1).max(15)),
});

export const Tag = z.object({});
