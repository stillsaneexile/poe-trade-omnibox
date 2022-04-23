import styled from "@emotion/styled";
import React from "react";
import { FilterSpec } from "../../lib/filter_spec";
import Space from "../common/Space";

const ItemDiv = styled.div<{ isSelected: boolean }>`
  // Again: color taken from computed color of trade site for similar highlights.
  background-color: ${(props) =>
    props.isSelected ? "rgb(70, 82, 96)" : "inherit"};
  padding: ${Space[8]} ${Space[4]};
  cursor: pointer;
`;

// Most CSS taken from trade site.
// This is the tag i.e., "Pseudo", "Fractured", etc.
const SubcategorySpan = styled.span`
  font-size: 0.9em;
  line-height: ${Space[16]};
  padding: 3px;
  margin: -3px ${Space[12]} -3px 0;
  display: inline-block;
  height: 22px;
  background-color: #232420;
  font-style: italic;
`;

interface SearchResultItemProps {
  spec: FilterSpec;
  isSelected: boolean;
  handleClick: (e: React.SyntheticEvent) => void;
  handleHover: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  spec,
  isSelected,
  handleClick,
  handleHover,
}) => {
  // TODO: Fix scrolling
  // Primitive scrolling so when you use down arrow, it keeps following the
  // item. This, of course, doesn't work well if you're scrolling upwards.
  const itemRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView(false);
    }
  }, [isSelected]);

  return (
    <ItemDiv
      isSelected={isSelected}
      onClick={handleClick}
      onMouseEnter={handleHover}
      ref={itemRef}
    >
      {spec.statSubcategory && (
        <SubcategorySpan>{spec.statSubcategory}</SubcategorySpan>
      )}
      {!spec.statSubcategory && <>&nbsp;&nbsp;</>}
      {spec.readableName}
    </ItemDiv>
  );
};

export default SearchResultItem;
