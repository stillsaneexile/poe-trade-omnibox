/**
 * React hook that enables hotkeys like ctrl + 1, ctrl + 2, ...
 * to select a result from the list.
 *
 * TODO: Not completed. At the moment, it doesn't work for ctrl + 1.
 * This also needs to be changed depending on Windows, etc.
 */

import {useHotkeys} from "react-hotkeys-hook";
import {FilterSpec} from "../../lib/filter_spec";
import HOTKEY_CONFIG from "../HotkeyConfig";

const MAX_HOTKEY_COUNT = 9;
const useSearchResultSelectHotkeys = (searchResults: FilterSpec[],
  handleResultSelect: (i: number) => (e: KeyboardEvent) => void) => {
    const hotkeyNumbers = [];
    // One-indexed for the NORMIES XDDDDD
    for (let i = 0; i < MAX_HOTKEY_COUNT; i++) {
      hotkeyNumbers.push( i + 1);
    }
    const hotkeyString = hotkeyNumbers.map(n => `ctrl+${n}`).join(",");
    useHotkeys(hotkeyString, (e: KeyboardEvent) => {
      e.preventDefault();
      const pressedNumber = parseInt(e.key, 10);
      // Out of bounds. Skip.
      if (pressedNumber > searchResults.length) {
        return;
      }
      handleResultSelect(pressedNumber - 1)(e);
    }, HOTKEY_CONFIG, [searchResults])
};

export default useSearchResultSelectHotkeys;
