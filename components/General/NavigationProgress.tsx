"use client";

import {
  createContext,
  useEffect,
  startTransition,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type NavigationProgressContextValue = {
  navigate: (href: string) => void;
};

const NavigationProgressContext =
  createContext<NavigationProgressContextValue | null>(null);

export function NavigationProgressProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, search]);

  useEffect(() => {
    const showProgressForLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;

      const url = new URL(link.href);
      if (
        url.origin !== window.location.origin ||
        (url.pathname === window.location.pathname &&
          url.search === window.location.search)
      ) {
        return;
      }

      setIsNavigating(true);
    };

    document.addEventListener("click", showProgressForLink);
    return () => document.removeEventListener("click", showProgressForLink);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;
      setIsNavigating(true);
      startTransition(() => router.push(href));
    },
    [pathname, router],
  );

  return (
    <NavigationProgressContext.Provider value={{ navigate }}>
      {isNavigating && (
        <div
          aria-live="polite"
          aria-label="Loading page"
          className="fixed inset-0 z-40 grid place-items-center bg-background/60 backdrop-blur-[1px]"
        >
          <div className="size-10 animate-spin rounded-full border-4 border-muted-foreground/25 border-t-primary" />
        </div>
      )}
      {children}
    </NavigationProgressContext.Provider>
  );
}

export function useNavigationProgress() {
  const context = useContext(NavigationProgressContext);

  if (!context) {
    throw new Error("useNavigationProgress must be used within NavigationProgressProvider");
  }

  return context;
}
