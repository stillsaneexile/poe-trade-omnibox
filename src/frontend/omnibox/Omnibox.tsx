import styled from "@emotion/styled";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ItemTradePage } from "../../lib/dom_finder";
import { FilterSpec } from "../../lib/filter_spec";
import { FuzzyFilterSpecSearcher } from "../../lib/searcher";
import HOTKEY_CONFIG from "../HotkeyConfig";
import Space from "../Space";
import SearchResultItem from "./SearchResultItem";

const OmniboxDiv = styled.div`
  padding: ${Space[12]} 0;
  border-radius: ${Space[4]};
  width: 50%;
  max-width: 600px;
  min-height: 300px;
  height: 500px;
  max-height: 80%;
  opacity: 0.9;
  z-index: 1000;
  overflow-y: scroll;

  // Taken from trade page.
  background-color: #1e2124;
  color: rgb(226, 226, 226);
  border: 1px solid #634928;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  // This may be somewhat brittle, as we're taking this straight from their CSS.
  // I'd prefer this than copying the class names however: even if GGG changes
  // their styles, at least we'll still be fashionable, albeit retro.
  // This is literally copied from the "computed" section of inspector.
  font-family: "FontinSmallcaps", sans-serif;
  input {
  border: none;
    background-color: rgb(30, 33, 36);
    width: 100%;
    min-height: 20px;
    padding: ${Space[4]} ${Space[8]};
    line-height: 20px;
    margin-bottom: ${Space[8]};
  }
`;

const SearchResultsDiv = styled.div``;

interface OmniboxProps {
  filterSpecs: FilterSpec[];
  closeBox: () => void;
  tradePage: ItemTradePage;
}

const Omnibox: React.FC<OmniboxProps> = ({
  filterSpecs,
  closeBox,
  tradePage,
}) => {
  // Filtered search results.
  const [searchResults, setSearchResults] = React.useState<FilterSpec[]>([]);
  // Currently selected search index (when using arrow keys).
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  useHotkeys(
    "up",
    (e) => {
      e.preventDefault();
      if (selectedIndex === 0) {
        // Do nothing. We're at the beginning.
        return;
      }
      setSelectedIndex((prev) => prev - 1);
    },
    HOTKEY_CONFIG,
    [selectedIndex, searchResults]
  );
  useHotkeys(
    "down",
    (e) => {
      e.preventDefault();
      if (selectedIndex === searchResults.length - 1) {
        // Do nothing. We're at the end.
        return;
      }
      setSelectedIndex((prev) => prev + 1);
    },
    HOTKEY_CONFIG,
    [selectedIndex, searchResults]
  );
  useHotkeys(
    "enter",
    (e) => {
      // TODO: Implement this.
      e.preventDefault();
      tradePage.addStatFilterSpec(searchResults[selectedIndex]);
      closeBox();
    },
    HOTKEY_CONFIG,
    [searchResults, selectedIndex]
  );

  const searcher = React.useMemo(() => {
    return new FuzzyFilterSpecSearcher(filterSpecs);
  }, [filterSpecs]);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    const results = searcher.search(query);
    setSearchResults(results);
    setSelectedIndex(0);
  };

  return (
    <OmniboxDiv onBlur={closeBox}>
      <input onChange={handleChange} autoFocus placeholder="Search Stats..." />
      <SearchResultsDiv>
        {searchResults.map((result, idx) => {
          return (
            <SearchResultItem spec={result} isSelected={idx == selectedIndex} />
          );
        })}
      </SearchResultsDiv>
    </OmniboxDiv>
  );
};

export default Omnibox;
