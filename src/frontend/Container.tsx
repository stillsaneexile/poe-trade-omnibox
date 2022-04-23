import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ItemTradePage } from "../lib/dom_finder";
import { FilterSpec } from "../lib/filter_spec";
import HelpPage from "./HelpPage";
import HOTKEY_CONFIG from "./HotkeyConfig";
import Omnibox from "./omnibox/Omnibox";

const Keys = {
  FSLASH: "/",
  ESC: "esc",
  SEMICOLON: ";",
  EQUALS: "=",
  LBRACKET: "[",
  QUESTION_MARK: "?",
};

/**
 * Overall container for the site.
 */
const Container = () => {
  const [isHelpShown, setIsHelpShown] = React.useState(false);
  const [isOmniboxShown, setIsOmniboxShown] = React.useState(false);
  const [filterSpecs, setFilterSpecs] = React.useState<FilterSpec[]>([]);
  const [areSpecsInitialized, setAreSpecsInitialized] = React.useState(false);
  const tradePage = React.useMemo(() => {
    return new ItemTradePage();
  }, []);
  // Used to focus

  // Register our hotkeys.
  useHotkeys(
    Keys.FSLASH,
    (e) => {
      e.preventDefault();
      setIsOmniboxShown(false);
      tradePage.focusMainSearchInput();
    },
    HOTKEY_CONFIG
  );

  useHotkeys(
    Keys.SEMICOLON,
    (e) => {
      e.preventDefault();

      // Loading this in the memo for the tradePage doesn't work, because the
      // DOM hasn't loaded yet and this scrapes the page. Presumably no one is
      // spamming the semicolon while the page is still loading, although if
      // that is the case, we might need to try reloading on every omnibox open.
      if (!areSpecsInitialized) {
        setAreSpecsInitialized(true);
        tradePage.initializeFilterSpecs().then((specs) => {
          setFilterSpecs(specs);
          setIsOmniboxShown(v => !v);
        });
      } else {
        setIsOmniboxShown(v => !v);
      }
    },
    HOTKEY_CONFIG, [areSpecsInitialized]
  );

  useHotkeys(
    Keys.ESC,
    () => {
      setIsOmniboxShown(false);
      setIsHelpShown(false);
    },
    HOTKEY_CONFIG
  );

  useHotkeys(
    Keys.EQUALS,
    () => {
      tradePage.clearPage();
    },
    HOTKEY_CONFIG
  );

  useHotkeys(
    Keys.LBRACKET,
    (e) => {
      tradePage.focusLastMinStatFilter(e.target);
    },
    HOTKEY_CONFIG,
  )

  useHotkeys(
    Keys.QUESTION_MARK,
    () => setIsHelpShown(v => !v), HOTKEY_CONFIG);

  return (
    <>
      {isHelpShown && <HelpPage />}
  {isOmniboxShown && (        <Omnibox
    filterSpecs={filterSpecs}
    closeBox={() => setIsOmniboxShown(false)}
    tradePage={tradePage}
  />
  )}
    </>
  );
};

export default Container;
