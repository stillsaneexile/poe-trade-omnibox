import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ItemTradePage } from "../lib/dom_finder";
import { FilterSpec } from "../lib/filter_spec";
import HelpPage from "./help/HelpPage";
import HOTKEY_CONFIG from "./HotkeyConfig";
import Omnibox from "./omnibox/Omnibox";

const Keys = {
  FSLASH: "/",
  ESC: "esc",
  SEMICOLON: ";",
  EQUALS: "=",
  LBRACKET: "[",
  // https://github.com/JohannesKlauss/react-hotkeys-hook/issues/421
  QUESTION_MARK: "shift+/",
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
    const page = new ItemTradePage();
    // So we async load it twice, once here, and once the first time the omnibox
    // opens.
    page.initializeFilterSpecs();
    return page;
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

      setIsHelpShown(false);
      // Loading this in the memo for the tradePage doesn't work, because the
      // DOM hasn't loaded yet and this scrapes the page. Presumably no one is
      // spamming the semicolon while the page is still loading, although if
      // that is the case, we might need to try reloading on every omnibox open.
      if (!areSpecsInitialized) {
        setAreSpecsInitialized(true);
        tradePage.initializeFilterSpecs().then((specs) => {
          setFilterSpecs(specs);
          setIsOmniboxShown((v) => !v);
        });
      } else {
        setIsOmniboxShown((v) => !v);
      }
    },
    HOTKEY_CONFIG,
    [areSpecsInitialized]
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
    HOTKEY_CONFIG
  );

  useHotkeys(
    Keys.QUESTION_MARK,
    (e) => {
      e.preventDefault();
      setIsHelpShown((v) => !v);
      setIsOmniboxShown(false);
    },
    HOTKEY_CONFIG
  );

  return (
    <>
      {isHelpShown && <HelpPage closeBox={() => setIsHelpShown(false)} />}
      {isOmniboxShown && (
        <Omnibox
          filterSpecs={filterSpecs}
          closeBox={() => setIsOmniboxShown(false)}
          tradePage={tradePage}
        />
      )}
    </>
  );
};

export default Container;
