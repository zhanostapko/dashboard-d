"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type ClickableTableRowProps = {
  href: string;
  children: ReactNode;
};

const ClickableTableRow = ({
  href,
  children,
}: ClickableTableRowProps) => {
  const router = useRouter();

  const navigate = () => router.push(href);

  return (
    <tr
      className="cursor-pointer border-b hover:bg-muted/50"
      onClick={navigate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate();
        }
      }}
      tabIndex={0}
      role="link"
    >
      {children}
    </tr>
  );
};

export default ClickableTableRow;
