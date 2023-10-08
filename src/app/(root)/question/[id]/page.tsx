import AnswerForm from "@/components/Forms/AnswerForm";
import ActionBar from "@/components/shared/ActionBar";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ITag } from "@/database/Tag.model";
import { IUser } from "@/database/User.model";
import { getQuestionById } from "@/lib/actions/Question.actions";
import { getUserById } from "@/lib/actions/User.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { ParamsProps } from "@/types";
import { SignInButton, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const QuestionPage = async ({ params }: ParamsProps) => {
  const { question } = await getQuestionById({ questionId: params.id });

  if (!question) {
    return redirect("/404");
  }
  const upvoteCount = question.upvotes.length;
  const downvoteCount = question.downvotes.length;
  let isUpvoted = false;
  let isDownvoted = false;
  let isSaved = false;
  let mongoUserId;
  const { userId } = auth();
  const mongoUser = await getUserById({ userId });
  if (mongoUser) {
    mongoUserId = JSON.stringify(mongoUser._id);
    isUpvoted = question.upvotes.includes(mongoUser._id);
    isDownvoted = question.downvotes.includes(mongoUser._id);
    isSaved = mongoUser.saved.includes(question._id);
  }
  return (
    <div>
      <div>
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${(question.author as IUser).clerkId}`}
            className="flex items-center justify-start gap-4"
          >
            <Image
              src={(question.author as IUser).picture}
              alt={(question.author as IUser).name}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <p className="h3-semibold text-dark300_light700">
                {(question.author as IUser).name}
              </p>
              <p className="text-dark300_light700">
                {(question.author as IUser).username}
              </p>
            </div>
          </Link>
          <div className="flex justify-end">
            <ActionBar
              questionId={params.id}
              userId={mongoUserId}
              upvoteCount={upvoteCount}
              downvoteCount={downvoteCount}
              isSaved={isSaved}
              hasUpvoted={isUpvoted}
              hasDownvoted={isDownvoted}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
        <div className="mb-8 mt-5 flex flex-wrap gap-4">
          <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="clock icon"
            value={` asked ${getTimestamp(question.createdAt)}`}
            title=" Asked"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={formatAndDivideNumber(question.answers.length)}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(question.views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
        <ParseHTML data={question.content} />
        <div className="mt-5 flex w-full flex-wrap items-center justify-center gap-4">
          {(question.tags as ITag[]).map((tag) => (
            <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
          ))}
        </div>
      </div>
      <div className="mt-9">
        <AllAnswers questionId={params.id} userId={mongoUserId} />
        <Separator />
        {mongoUserId ? (
          <AnswerForm questionId={params.id} userId={mongoUserId} />
        ) : (
          <div className="flex justify-center max-sm:w-full">
            <SignInButton afterSignInUrl={`question/${params.id}`}>
              <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
                Log In to Answer the Above Question
              </Button>
            </SignInButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
