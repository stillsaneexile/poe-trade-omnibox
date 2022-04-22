import {FilterSpec} from "../../lib/filter_spec";

interface SearchResultItemProps {
  spec: FilterSpec;
}

const SearchResultItem : React.FC<SearchResultItemProps> = ({spec}) => {
  return <div>
    {spec.readableName}
  </div>;
};

export default SearchResultItem;


