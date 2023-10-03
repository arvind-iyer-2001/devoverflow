import RenderTag from "@/components/shared/RenderTag";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { QuestionProps } from "@/types/questions";
import Link from "next/link";
import Metric from "../shared/Metric";

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: QuestionProps) => {
  return (
    <Link href={`/question/${_id}`}>
      <Card className="rounded-[10px] p-3 sm:px-11">
        <CardHeader className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <CardTitle>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1 max-sm:line-clamp-2">
              {title}
            </h3>
          </CardTitle>

          {/* If signed in add edit delete actions */}
        </CardHeader>

        <CardContent className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
          ))}
        </CardContent>

        <CardFooter className="flex-between w-full flex-wrap justify-center justify-items-stretch gap-3">
          <Metric
            imgUrl={author.picture}
            alt="user"
            value={author.name}
            title={` - asked ${getTimestamp(createdAt)}`}
            href={`/profile/${author._id}`}
            isAuthor
            textStyles="body-medium text-dark400_light700"
          />

          <div className="flex-between gap-2">
            <Metric
              imgUrl="/assets/icons/like.svg"
              alt="Upvotes"
              value={formatAndDivideNumber(upvotes)}
              title=" Votes"
              textStyles="small-medium text-dark400_light800"
            />
            |
            <Metric
              imgUrl="/assets/icons/message.svg"
              alt="message"
              value={formatAndDivideNumber(answers.length)}
              title=" Answers"
              textStyles="small-medium text-dark400_light800"
            />
            |
            <Metric
              imgUrl="/assets/icons/eye.svg"
              alt="eye"
              value={formatAndDivideNumber(views)}
              title=" Views"
              textStyles="small-medium text-dark400_light800"
            />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default QuestionCard;
