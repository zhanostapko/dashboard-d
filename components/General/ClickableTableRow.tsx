"use client";

import type { ReactNode } from "react";
import { useNavigationProgress } from "./NavigationProgress";

type ClickableTableRowProps = {
  href: string;
  children: ReactNode;
};

const ClickableTableRow = ({
  href,
  children,
}: ClickableTableRowProps) => {
  const { navigate: navigateTo } = useNavigationProgress();
  const navigate = () => navigateTo(href);

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
