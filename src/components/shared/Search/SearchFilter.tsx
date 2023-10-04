"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Filter } from "@/types";

const SearchFilter = ({
  filters,
  otherClasses,
  containerClasses,
}: {
  filters: Filter[];
  otherClasses?: string;
  containerClasses?: string;
}) => {
  return (
    <div className={cn("relative", containerClasses)}>
      <Select>
        <SelectTrigger
          className={cn(
            "body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5",
            otherClasses
          )}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue
              className="body-semibold text-gray-700"
              placeholder="Select a Filter"
            />
          </div>
        </SelectTrigger>
        <SelectContent
          className={cn(
            "background-light800_darkgradient flex min-h-[56px] w-full grow items-center gap-4 rounded-[10px] px-4"
          )}
        >
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value} className="">
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchFilter;
