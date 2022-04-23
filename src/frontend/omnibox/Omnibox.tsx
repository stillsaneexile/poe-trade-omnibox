import styled from "@emotion/styled";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ItemTradePage } from "../../lib/dom_finder";
import { FilterSpec } from "../../lib/filter_spec";
import { FuzzyFilterSpecSearcher } from "../../lib/searcher";
import HOTKEY_CONFIG from "../HotkeyConfig";
import Space from "../common/Space";
import SearchResultItem from "./SearchResultItem";
import PopupDiv from "../common/PopupDiv";

const InputContainerDiv = styled.div`
  // Too lazy to figure this shit out so just use a flexbox so the input sizes
  // correctly
  // https://stackoverflow.com/questions/35059569/html-input-element-not-taking-100-width
  display: flex;
  input {
    flex: 1;
    border: none;
    outline: none;
    background-color: black;
    width: 100%;
    min-height: 20px;
    padding: ${Space[8]};
    line-height: 20px;
    margin-bottom: ${Space[8]};
    margin-left: ${Space[8]};
    margin-right: ${Space[8]};

    ::placeholder {
      color: rgb(226, 226, 226);
    }
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

  const handleResultClick =
    (index: number) => (e: React.SyntheticEvent | KeyboardEvent) => {
      e.preventDefault();

      // The whole filter section may be hidden. For example, after a search
      // result. Show if needed.
      tradePage.maybeShowFilters();
      const spec = searchResults[index];
      if (spec.isStatFilter) {
        tradePage.addStatFilterSpec(spec);
      } else {
        tradePage.focusClosestSiblingInput(spec);
      }
      closeBox();
    };

  useHotkeys("enter", handleResultClick(selectedIndex), HOTKEY_CONFIG, [
    searchResults,
    selectedIndex,
  ]);

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
    <PopupDiv onBlur={closeBox}>
      <InputContainerDiv>
        <input
          onChange={handleChange}
          autoFocus
          placeholder="Add a Filter..."
        />
      </InputContainerDiv>
      <SearchResultsDiv>
        {searchResults.map((result, idx) => {
          return (
            <SearchResultItem
              spec={result}
              isSelected={idx === selectedIndex}
              handleClick={handleResultClick(idx)}
            />
          );
        })}
      </SearchResultsDiv>
    </PopupDiv>
  );
};

export default Omnibox;
