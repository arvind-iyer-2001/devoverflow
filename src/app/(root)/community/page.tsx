import UserCard from "@/components/Cards/UserCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import SearchFilter from "@/components/shared/Search/SearchFilter";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/User.action";

const CommunityPage = async () => {
  const { users } = await getAllUsers({});
  return (
    <div>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <div className="text-center">
          <h1 className="h1-bold text-dark100_light900">All Users</h1>
        </div>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
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
      <div className="mt-10 flex w-full flex-col gap-6">
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user._id} user={user} />)
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

export default CommunityPage;
