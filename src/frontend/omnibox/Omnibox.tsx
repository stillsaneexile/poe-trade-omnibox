import styled from "@emotion/styled";
import React from "react";
import { FilterSpec } from "../../lib/filter_spec";
import { FuzzyFilterSpecSearcher } from "../../lib/searcher";
import SearchResultItem from "./SearchResultItem";

const OmniboxDiv = styled.div`
  width: 300;
  height: 300;
  background-color: white;
  z-index: 1000;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  // This may be somewhat brittle, as we're taking this straight from their CSS.
  font-family: "FontinSmallcaps",sans-serif;
`;

const SearchResultsDiv = styled.div`
`;

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
    <OmniboxDiv>
      <div className="multiselect">
        <div className="multiselect__tags">
      <input onChange={handleChange} type="text" autoFocus
        className="multiselect__input"/>
      <SearchResultsDiv>
        {searchResults.map((result) => {
          <SearchResultItem spec={result} />;
        })}
      </SearchResultsDiv>
  </div></div>
    </OmniboxDiv>
  );
};

export default Omnibox;
