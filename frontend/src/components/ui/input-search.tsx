import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Search } from "lucide-react";

const SearchInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
        <>
            <input
                type={type}
                className={cn(
                "flex h-10 w-full border border-input bg-background px-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className,
                )}
                ref={ref}
                {...props}
            />
            <Button>
                <Search className="w-4 h-4" />
            </Button>
        </>
    );
  },
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
