import { ObjectId } from "mongoose";
import Image from "next/image";

const AuthorCard = ({
  author,
}: {
  author: { name: string; picture: string; clerkId: string; _id: ObjectId };
}) => {
  return (
    <div>
      <Image src={author.picture} alt={author.name} />
    </div>
  );
};

export default AuthorCard;
