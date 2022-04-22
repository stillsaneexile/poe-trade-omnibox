import styled from "@emotion/styled";
import { FilterSpec } from "../../lib/filter_spec";
import Space from "../Space";

const ItemDiv = styled.div<{ isSelected: boolean }>`
  // Again: color taken from computed color of trade site for similar highlights.
  background-color: ${(props) =>
    props.isSelected ? "rgb(70, 82, 96)" : "inherit"};
  padding: ${Space[8]} ${Space[4]};
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
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  spec,
  isSelected,
}) => {
  return (
    <ItemDiv isSelected={isSelected}>
      {spec.statSubcategory && (
        <SubcategorySpan>{spec.statSubcategory}</SubcategorySpan>
      )}
      {spec.readableName}
    </ItemDiv>
  );
};

export default SearchResultItem;
