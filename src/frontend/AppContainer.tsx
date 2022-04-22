import React from "react";
import {useHotkeys} from "react-hotkeys-hook";
import {ItemTradePage} from "../lib/dom_finder";

/**
 * Overall container for the site.
 */
const Container = () => {
  const [isHelpShown, setIsHelpShown] = React.useState(false);
  const [isOmniboxShown, setisOmniboxShown] = React.useState(false);
  const tradePage = React.useMemo(() => {
    return new ItemTradePage();
  }, []);

  useHotkeys('/', () => {
    tradePage.focusMainSearchInput();
  });

  return (
    <>
      {isHelpShown && <HelpPage/>}
      {isOmniboxShown && <Omnibox/>}
      </>
  )
}

export default Container;
