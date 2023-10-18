import { ComponentProps } from "react";

export function SectionTitle({ children, ...props }: ComponentProps<"p">) {
  return (
    <p className="mb-2 pl-5 font-bold uppercase" {...props}>
      {children}
    </p>
  );
}
