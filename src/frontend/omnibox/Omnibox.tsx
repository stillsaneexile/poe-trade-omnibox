import React from "react";
import {FilterSpec} from "../lib/filter_spec";
import {FuzzyFilterSpecSearcher} from "../lib/searcher";


const SearchResultItem : React.FC<SearchResultItemProps> = ({spec}) => {
  return <>"search result!"</>;
};

interface OmniboxProps {
  filterSpecs: FilterSpec[];
}

const Omnibox : React.FC<OmniboxProps> = ({filterSpecs}) => {
  const [searchResults, setSearchResults] = React.useState<FilterSpec[]>([]);
  const searcher = React.useMemo(() => {
    return new FuzzyFilterSpecSearcher(filterSpecs);
  }, [filterSpecs]);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    setSearchResults(searcher.search(query));
  };

  return <div>
    <input onChange={handleChange} type="text" autoFocus/>
    {searchResults.map((result) => {
      <SearchResultItem/>
    })}
  </div>;
};

export default Omnibox;
