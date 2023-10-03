import Link from "next/link";
import RenderTag from "../shared/RenderTag";

interface Props {
  tag: {
    _id: string;
    name: string;
    description: string;
    questions: string[];
  };
}

const TagCard = async ({ tag }: Props) => {
  const questionsCount = tag.questions.length;

  return (
    <Link
      href={`/tags/${tag._id}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border p-8">
        <RenderTag
          key={tag._id}
          _id={tag._id}
          name={tag.name}
          variant="outline"
        />

        <div className="mt-4">
          <p className="body-regular text-dark500_light500 mt-2">
            {tag.description}
          </p>
        </div>

        <div className="mt-5">
          <p>
            <span>{`${questionsCount}+ `}</span>
            Questions
          </p>
        </div>
      </article>
    </Link>
  );
};

export default TagCard;
