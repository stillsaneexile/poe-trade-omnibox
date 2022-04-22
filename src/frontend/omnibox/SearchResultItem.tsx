import styled from "@emotion/styled";
import { FilterSpec } from "../../lib/filter_spec";

const ItemDiv = styled.div`
`;

interface SearchResultItemProps {
  spec: FilterSpec;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ spec }) => {
  return <ItemDiv>{spec.readableName}</ItemDiv>;
};

export default SearchResultItem;
