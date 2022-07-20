import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Search from "../components/Search";
import { API } from "../api/API";
import { SearchResult } from "../types";

interface SearchProps {
  id: string;
}

export default function SearchPage({ id }: SearchProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [api, setApi] = useState<API>();
  const [noResults, setNoResults] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const [results, setResults] = useState<SearchResult["results"]>([]);

  useEffect(() => {
    API.init(id).then((api) => setApi(api));
  }, [id]);
  async function getNewSearchResults() {
    if (!query || !query.trim() || !api) {
      setResults([]);
    } else {
      const { results } = await api.searchDocs(query);
      setResults(results ?? []);
    }
  }

  useEffect(() => {
    setLoading(false);

    if (query && query.trim() && (!results || results.length === 0)) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  }, [results]);

  useEffect(() => {
    setLoading(true);

    if (!query || !query.trim()) {
      setResults([]);
      return;
    }

    const delayFetchResults = setTimeout(() => {
      getNewSearchResults();
    }, 1500);

    return () => clearTimeout(delayFetchResults);
  }, [query]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "400px",
      }}
    >
      <Typography variant="h3">🥭</Typography>
      <Search
        searchResults={results}
        query={query}
        handleQueryChange={handleQueryChange}
        loading={loading}
        noResults={noResults && !loading}
      />
    </div>
  );
}
