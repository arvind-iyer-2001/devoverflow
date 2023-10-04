import TagCard from "@/components/Cards/TagCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import SearchFilter from "@/components/shared/Search/SearchFilter";
import { UserFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/Tag.action";

const TagsPage = async () => {
  // const { users } = await getAllUsers({});
  const { tags } = await getAllTags({});
  return (
    <div>
      <div className="flex w-full flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
        <div className="text-center">
          <h1 className="h1-bold text-dark100_light900">All Tags</h1>
        </div>
      </div>
      <div className="mt-3 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/community"
          placeholder={"Search by username....."}
        />
        <SearchFilter
          filters={UserFilters}
          otherClasses="min-h-[56px] w-[170px]"
          containerClasses="flex"
        />
      </div>
      <div className="mt-10 flex w-full flex-wrap items-center justify-center gap-3">
        {tags.length > 0 ? (
          tags.map((tag) => <TagCard key={tag._id} tag={tag} />)
        ) : (
          <NoResult
            title="There’s no users to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </div>
  );
};

export default TagsPage;
