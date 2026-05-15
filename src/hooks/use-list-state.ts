import { useState } from "react";
import { useDebounce } from "./use-debounce";

/**
 * Standard list-page state — search, pagination, debounce.
 * Replaces the 5-line boilerplate on every list page.
 *
 * Usage:
 *   const { search, setSearch, page, setPage, limit, setLimit, debouncedSearch } = useListState();
 */
export function useListState(defaultLimit = 10) {
  const [search, setSearch] = useState("");
  const [page,   setPage]   = useState(1);
  const [limit,  setLimit]  = useState(defaultLimit);
  const debouncedSearch     = useDebounce(search, 300);

  const onSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return { search, setSearch: onSearch, page, setPage, limit, setLimit: onLimitChange, debouncedSearch };
}
