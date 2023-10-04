import QuestionCard from "@/components/Cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import BadgeFilters from "@/components/shared/Search/BadgeFilters";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import SearchFilter from "@/components/shared/Search/SearchFilter";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/actions/Question.action";
import Link from "next/link";

const HomePage = async () => {
  const { questions } = await getQuestions({});

  return (
    <div>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <div className="text-center">
          <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        </div>

        <Link
          href="/ask-question"
          className="flex justify-center max-sm:w-full"
        >
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div>
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearch route="/" placeholder={"Search questions....."} />
          <SearchFilter
            filters={HomePageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-md:flex"
          />
        </div>
        <BadgeFilters
          filters={HomePageFilters}
          containerClasses="hidden md:flex"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes.length}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
