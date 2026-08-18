import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium tracking-wide ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C19B6C]/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-[1px] active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&:hover_svg]:translate-x-[2px]",
  {
    variants: {
      variant: {
        default: "btn-gold border border-[#E5C599]/30 shadow-lg shadow-[#C19B6C]/20 hover:shadow-xl hover:shadow-[#C19B6C]/30",
        outline: "bg-transparent border border-zinc-200 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 text-zinc-900 dark:text-white backdrop-blur-md",
        ghost: "hover:bg-black/5 dark:hover:bg-white/10 text-zinc-900 dark:text-white",
        link: "text-[#C19B6C] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 sm:px-8 py-2 text-sm",
        sm: "h-9 px-4 sm:px-5 text-xs",
        lg: "h-12 sm:h-14 px-8 sm:px-10 py-3 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
