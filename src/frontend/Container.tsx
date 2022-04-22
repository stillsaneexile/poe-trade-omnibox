import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ItemTradePage } from "../lib/dom_finder";
import {FilterSpec} from "../lib/filter_spec";
import HelpPage from "./HelpPage";
import Omnibox from "./Omnibox";

const Keys = {
  FSLASH: '/',
  ESC: 'esc',
  SEMICOLON: ';',
};

/**
 * Overall container for the site.
 */
const Container = () => {
  const [isHelpShown, setIsHelpShown] = React.useState(false);
  const [isOmniboxShown, setIsOmniboxShown] = React.useState(false);
   const [filterSpecs, setFilterSpecs] = React.useState<FilterSpec[]>([]);
  const tradePage = React.useMemo(() => {
    const tradePage = new ItemTradePage();
    // This kicks off some initialization, such as fetching. Don't await on this
    // so that hotkeys work immediately, but use the callback result of
    // initialized filter data and "transfer" it to a React state.
    tradePage.initializeFilterSpecs().then((specs) => {
      setFilterSpecs(specs);
    });
    return tradePage;
  }, []);
  // Used to focus 

  // Register our hotkeys.
  useHotkeys(Keys.FSLASH, (e) => {
    e.preventDefault();
    tradePage.focusMainSearchInput();
  });

  useHotkeys(Keys.SEMICOLON, (e) => {
    e.preventDefault()
    setIsOmniboxShown(!isOmniboxShown);
  });

  useHotkeys(Keys.ESC, () => {
    setIsOmniboxShown(false);
    setIsHelpShown(false);
  });

  return (
    <>
      {isHelpShown && <HelpPage />}
      {isOmniboxShown && <Omnibox filterSpecs={filterSpecs} />}
    </>
  );
};

export default Container;
