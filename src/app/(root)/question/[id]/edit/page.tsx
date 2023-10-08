import QuestionForm from "@/components/Forms/QuestionForm";
import { ITag } from "@/database/Tag.model";
import { IUser } from "@/database/User.model";
import { getQuestionById } from "@/lib/actions/Question.actions";
import { getCurrentUser } from "@/lib/actions/User.actions";
import { ParamsProps } from "@/types";
import { RedirectToSignIn } from "@clerk/nextjs";
import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";

const EditQuestionPage = async ({ params }: ParamsProps) => {
  const user = await getCurrentUser();
  if (!user)
    return <RedirectToSignIn afterSignInUrl={`/question/${params.id}/edit`} />;
  if (!isValidObjectId(params.id)) {
    notFound();
  }
  const { question } = await getQuestionById({ questionId: params.id });
  if (!question) {
    notFound();
  }
  if (!(question.author as IUser)._id.equals(user._id)) {
    notFound();
  }
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <QuestionForm
          editProps={{
            questionId: JSON.stringify(question._id),
            title: question.title,
            content: question.content,
            tags: (question.tags as ITag[]).map((tag) => tag.name),
          }}
          mongoUserId={JSON.stringify(user._id)}
        />
      </div>
    </div>
  );
};

export default EditQuestionPage;
