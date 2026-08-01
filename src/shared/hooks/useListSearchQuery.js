import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const DEFAULT_DEBOUNCE_MS = 500;
const DEFAULT_MIN_SEARCH_LENGTH = 3;

export function useListSearchQuery({
  debounceMs = DEFAULT_DEBOUNCE_MS,
  minSearchLength = DEFAULT_MIN_SEARCH_LENGTH,
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSearchPending, startSearchTransition] = useTransition();
  const isFirstRender = useRef(true);

  const rawInitialSearch = searchParams.get("search") || "";
  const lastUrlSearchRef = useRef(rawInitialSearch);
  const normalizedInitialSearch = rawInitialSearch.trim();
  const initialAppliedSearch = normalizedInitialSearch.length >= minSearchLength
    ? normalizedInitialSearch
    : "";

  const [localSearch, setLocalSearch] = useState(rawInitialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialAppliedSearch);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";

    if (urlSearch === lastUrlSearchRef.current) {
      return;
    }

    lastUrlSearchRef.current = urlSearch;

    const normalizedUrlSearch = urlSearch.trim();
    const nextAppliedSearch = normalizedUrlSearch.length >= minSearchLength
      ? normalizedUrlSearch
      : "";

    queueMicrotask(() => {
      setLocalSearch(urlSearch);
      setAppliedSearch(nextAppliedSearch);
    });
  }, [searchParams, minSearchLength]);

  const updateURLSearch = useCallback((nextSearch, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString());

    lastUrlSearchRef.current = nextSearch;

    if (nextSearch) {
      params.set("search", nextSearch);
    } else {
      params.delete("search");
    }

    if (resetPage) {
      params.delete("page");
    }

    const queryString = params.toString();

    startSearchTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }, [lastUrlSearchRef, pathname, router, searchParams, startSearchTransition]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const normalizedSearch = localSearch.trim();
      const nextAppliedSearch = normalizedSearch.length >= minSearchLength
        ? normalizedSearch
        : "";
      const currentUrlSearch = searchParams.get("search") || "";

      setAppliedSearch(nextAppliedSearch);

      if (currentUrlSearch !== nextAppliedSearch) {
        updateURLSearch(nextAppliedSearch, true);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, debounceMs, minSearchLength, searchParams, updateURLSearch]);

  const dataParams = useMemo(() => {
    if (!appliedSearch) {
      return {};
    }

    return { search: appliedSearch };
  }, [appliedSearch]);

  return {
    localSearch,
    setLocalSearch,
    dataParams,
    isSearchPending,
  };
}