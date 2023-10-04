import ActionBar from "@/components/ActionBar";
import AnswerForm from "@/components/Forms/AnswerForm";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import { ITag } from "@/database/Tag.model";
import { getQuestionById } from "@/lib/actions/Question.action";
import { getUserById } from "@/lib/actions/User.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

// @ts-ignore
const QuestionPage = async ({ params }) => {
  const { question } = await getQuestionById({ questionId: params.questionId });
  const { userId } = auth();

  const mongoUser = await getUserById({ userId });
  return (
    <div>
      <div>
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={question.author.picture}
              alt={question.author.name}
              width={22}
              height={22}
              className="rounded-full"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <ActionBar
              questionId={question.questionId}
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              userId={JSON.stringify(mongoUser._id)}
              isSaved={mongoUser.saved.includes(question._id)}
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
          {question.tags.map((tag: ITag) => (
            <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
          ))}
        </div>
      </div>
      <div className="mt-9">
        <AllAnswers
          questionId={params.questionId}
          userId={JSON.stringify(mongoUser._id)}
          totalAnswers={question.answers.length}
        />
        <AnswerForm
          questionId={params.questionId}
          userId={JSON.stringify(mongoUser._id)}
        />
      </div>
    </div>
  );
};

export default QuestionPage;
