"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
type Props = {
  questionId: string;
  answerId?: string;
  userId?: string;
  upvotes: string[];
  downvotes: string[];
  isSaved?: boolean;
};

const ActionBar = ({
  questionId,
  upvotes,
  downvotes,
  answerId,
  userId,
  isSaved,
}: Props) => {
  const isUpvoted = true; // upvotes.includes(userId);
  const isDownvoted = false; // downvotes.includes(userId);

  async function handleUpvote() {
    //
  }

  async function handleDownvote() {
    //
  }

  async function handleSave() {
    //
  }

  return (
    <div>
      {/* Upvote */}
      <Button onClick={handleUpvote}>
        <Image
          src={
            isUpvoted ? "/assets/icons/upvoted.svg" : "/assets/icons/upvote.svg"
          }
          alt="upvote"
          width={20}
          height={20}
        />
      </Button>
      <Badge>{upvotes.length}</Badge>

      {/* Downvote Button */}
      <Button onClick={handleDownvote}>
        <Image
          src={
            isDownvoted
              ? "/assets/icons/downvoted.svg"
              : "/assets/icons/downvote.svg"
          }
          alt="downvote"
          width={20}
          height={20}
        />
      </Button>
      <Badge>{downvotes.length}</Badge>

      {/* Save  */}
      {isSaved ?? (
        <Button onClick={handleSave}>
          <Image
            src={
              isSaved
                ? "/assets/icons/star-filled.svg"
                : "/assets/icons/star.svg"
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
