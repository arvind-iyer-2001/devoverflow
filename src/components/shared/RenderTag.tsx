import { Badge, BadgeVariants } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
  variant?: BadgeVariants;
  disableLink?: boolean;
}

const RenderTag = ({
  _id,
  name,
  totalQuestions,
  showCount,
  variant,
  disableLink,
}: Props) => {
  const tag = (
    <div className="flex justify-between gap-2">
      <Badge
        className="background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase"
        variant={variant ?? "default"}
      >
        {name}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{totalQuestions}</p>
      )}
    </div>
  );

  return disableLink ? tag : <Link href={`/tags/${_id}`}>{tag}</Link>;
};

export default RenderTag;
