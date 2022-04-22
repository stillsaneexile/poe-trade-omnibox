import React from "react";
import { FilterSpec } from "../../lib/filter_spec";
import { FuzzyFilterSpecSearcher } from "../../lib/searcher";
import SearchResultItem from "./SearchResultItem";

interface OmniboxProps {
  filterSpecs: FilterSpec[];
}

const Omnibox: React.FC<OmniboxProps> = ({ filterSpecs }) => {
  const [searchResults, setSearchResults] = React.useState<FilterSpec[]>([]);
  const searcher = React.useMemo(() => {
    return new FuzzyFilterSpecSearcher(filterSpecs);
  }, [filterSpecs]);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    const results = searcher.search(query);
    setSearchResults(results);
  };

  return (
    <div>
      <input onChange={handleChange} type="text" autoFocus />
      {searchResults.map((result) => {
        <SearchResultItem spec={result} />;
      })}
    </div>
  );
};

export default Omnibox;
