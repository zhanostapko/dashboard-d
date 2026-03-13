import Link from "next/link";
import React, { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
};

const FormPageShell = ({ title, backHref, backLabel, children }: Props) => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        </div>
        <Button asChild variant="outline">
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border bg-card p-6 shadow-sm">{children}</div>
    </div>
  );
};

export default FormPageShell;
