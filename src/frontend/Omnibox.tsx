import React from "react";
import {FilterSpec} from "../lib/filter_spec";
import {FuzzyFilterSpecSearcher} from "../lib/searcher";

interface OmniboxProps {
  filterSpecs: FilterSpec[];
}

const Omnibox : React.FC<OmniboxProps> = ({filterSpecs}) => {
  const searcher = React.useMemo(() => {
    return new FuzzyFilterSpecSearcher(filterSpecs);
  }, [filterSpecs]);

  return <div>
    <input type="text"/>
  </div>;
};

export default Omnibox;
