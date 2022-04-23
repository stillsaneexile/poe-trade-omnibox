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
  opacity: 0.98;
  z-index: 1000;
  overflow-y: scroll;

  // Taken from trade page.
  background-color: #1e2124;
  color: rgb(226, 226, 226);
  border: 1px solid #634928;
  font-size: 1.1em;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  // This may be somewhat brittle, as we're taking this straight from their CSS.
  // I'd prefer this than copying the class names however: even if GGG changes
  // their styles, at least we'll still be fashionable, albeit retro.
  // This is literally copied from the "computed" section of inspector.
  font-family: "FontinSmallcaps", sans-serif;
`;

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
  const handleResultClick = (index: number) => (e: React.SyntheticEvent |
    KeyboardEvent) => {
    e.preventDefault();
    const spec = searchResults[index];
    if (spec.isStatFilter) {
      tradePage.addStatFilterSpec(spec);
    } else {
      tradePage.focusClosestSiblingInput(spec)
    }
    closeBox();
  };

  useHotkeys(
    "enter",
    handleResultClick(selectedIndex),
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
              isSelected={idx == selectedIndex}
              handleClick={handleResultClick(idx)}
            />
          );
        })}
      </SearchResultsDiv>
    </OmniboxDiv>
  );
};

export default Omnibox;
