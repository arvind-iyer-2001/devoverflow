import QuestionForm from "@/components/Forms/QuestionForm";
import { getUserById } from "@/lib/actions/User.action";
import { redirect } from "next/navigation";

const AskQuestionPage = async () => {
  // const { userId } = auth();

  const userId = "123456789";
  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });

  console.log(mongoUser);

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <QuestionForm mongoUserId={JSON.stringify(mongoUser._id)} />
      </div>
    </div>
  );
};

export default AskQuestionPage;
