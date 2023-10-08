"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  upvoteAnswer as downvoteAnswer,
  upvoteAnswer,
} from "@/lib/actions/Answer.action";
import {
  upvoteQuestion as downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/Question.action";
import { toggleSaveQuestion } from "@/lib/actions/User.action";
import Image from "next/image";
import { usePathname } from "next/navigation";
type Props = {
  questionId: string;
  answerId?: string;
  userId?: string;
  upvoteCount: number;
  downvoteCount: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  isSaved?: boolean;
};

const ActionBar = ({
  questionId,
  answerId,
  userId,

  upvoteCount,
  downvoteCount,

  hasUpvoted,
  hasDownvoted,
  isSaved,
}: Props) => {
  const pathname = usePathname();
  async function handleUpvote() {
    if (userId) {
      if (answerId) {
        await upvoteAnswer({
          answerId: JSON.parse(answerId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      } else {
        await upvoteQuestion({
          questionId,
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      }
    }
  }

  async function handleDownvote() {
    if (userId) {
      if (answerId) {
        await downvoteAnswer({
          answerId: JSON.parse(answerId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      } else {
        await downvoteQuestion({
          questionId,
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathname,
        });
      }
    }
  }

  const handleSave = async () => {
    if (userId) {
      await toggleSaveQuestion({
        userId: JSON.parse(userId),
        questionId,
        path: pathname,
      });
    }
  };

  return (
    <div className="align-text-bottom">
      {/* Upvote */}
      <Button onClick={handleUpvote} disabled={userId === undefined}>
        <Image
          src={
            hasUpvoted
              ? "/assets/icons/upvoted.svg"
              : "/assets/icons/upvote.svg"
          }
          alt="upvote"
          width={20}
          height={20}
        />
      </Button>
      <Badge
        className="h-10 w-10 justify-center bg-green-700 align-top text-light-900"
        variant="title"
      >
        {upvoteCount}
      </Badge>

      {/* Downvote Button */}
      <Button onClick={handleDownvote} disabled={userId === undefined}>
        <Image
          src={
            hasDownvoted
              ? "/assets/icons/downvoted.svg"
              : "/assets/icons/downvote.svg"
          }
          alt="downvote"
          width={20}
          height={20}
        />
      </Button>
      <Badge
        className="h-10 w-10 justify-center bg-red-700 align-top text-light-900"
        variant="title"
      >
        {downvoteCount}
      </Badge>

      {/* Save  */}
      {answerId ? null : (
        <Button onClick={handleSave} disabled={userId === undefined}>
          <Image
            src={
              isSaved
                ? "/assets/icons/star-filled.svg"
                : "/assets/icons/star-red.svg"
            }
            alt="save"
            width={20}
            height={20}
          />
        </Button>
      )}
    </div>
  );
};

export default ActionBar;
