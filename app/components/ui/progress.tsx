"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/app/lib/utils";

function Progress({
  className,
  value,
  activeValue,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { activeValue?: number }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      {activeValue !== undefined && activeValue > 0 && (
        <div
          className="bg-primary/50 absolute top-0 bottom-0 left-0 transition-all z-0"
          style={{ width: `${(value || 0) + activeValue}%` }}
        />
      )}
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary absolute top-0 bottom-0 left-0 transition-all z-10"
        style={{ width: `${value || 0}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
