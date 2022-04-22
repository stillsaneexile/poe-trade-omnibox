import styled from "@emotion/styled";
import { FilterSpec } from "../../lib/filter_spec";
import Space from "../Space";

const ItemDiv = styled.div<{isSelected: boolean}>`
  // Again: color taken from computed color of trade site for similar highlights.
  background-color: ${props => props.isSelected ? 'rgb(70, 82, 96)' : 'inherit'};
  padding: ${Space[8]} 0;
`;

interface SearchResultItemProps {
  spec: FilterSpec;
  isSelected: boolean;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ spec, isSelected }) => {
  return <ItemDiv isSelected={isSelected}>{spec.readableName}</ItemDiv>;
};

export default SearchResultItem;
