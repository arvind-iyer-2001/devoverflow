"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Filter } from "@/types";

const BadgeFilters = ({
  filters,
  otherClasses,
  containerClasses,
}: {
  filters: Filter[];
  otherClasses?: string;
  containerClasses?: string;
}) => {
  const active = "newest";
  return (
    <div
      className={cn("mt-5 flex-wrap justify-center gap-3", containerClasses)}
    >
      {filters.map((item) => {
        return (
          <Button
            key={item.value}
            onClick={() => {}}
            className={cn(
              "body-medium rounded-lg px-6 py-3 capitalize shadow-none",
              active === item.value
                ? "bg-primary-100 text-primary-500"
                : "bg-light-800 text-light-500"
            )}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default BadgeFilters;
