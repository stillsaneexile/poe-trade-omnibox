/**
 * Functions related to manipulating the DOM.
 *
 * In this extension, the concept of "which filters are applied" and "which
 * filters are selected in the trade UI" are separated, so that the filter
 * system can later be used independently of the UI (to directly send API
 * requests in another feature, for example).
 *
 * This file contains functions that directly handle manipulating the UI.
 */

/**
 * A spec containing information about a certain filter type.
 */

interface FilterUISpec {
  filterType: FilterType;
  // Human-readable name in UI.
  filterNameUi: string;
}

const getFilterTitleInUI = (filterType: FilterType) : string => { 
  switch (filterType) {
    case FilterType.WEAP_DAMAGE:
      return "Damage";
    case FilterType.WEAP_CRIT_CHANCE:
      return "Critical Chance";
    case FilterType.WEAP_PDPS:
      return "Physical DPS";
    case FilterType.WEAP_APS:
      return "Attacks per Second";
    case FilterType.WEAP_DPS:
      return "Damage per Second";
    case FilterType.WEAP_EDPS:
      return "Elemental DPS";
    case FilterType.ARMOUR_ARMOUR:
      return "Armour";
    case FilterType.ARMOUR_ES:
      return "Energy Shield";
    case FilterType.ARMOUR_BLOCK:
      return "Block";
    case FilterType.ARMOUR_EVASION:
      return "Evasion";
    case FilterType.ARMOUR_WARD:
      return "Ward";
    case FilterType.ARMOUR_BASE_PERCENTILE:
      return "Base Percentile";
    case FilterType.SOCKET_SOCKETS:
      return "Sockets";
    case FilterType.SOCKET_LINKS:
      return "Links";
    case FilterType.REQ_STRENGTH:
      return "Strength";
    case FilterType.REQ_INT:
      return "Intelligence";
    case FilterType.REQ_DEX:
      return "Dexterity";
    case FilterType.REQ_LEVEL:
      return "Level";
    case FilterType.REQ_CHAR_CLASS:
      return "Character Class";
    case FilterType.MAP_TIER:
      return "Map Tier";
    case FilterType.MAP_IIQ:
      return "Map IIQ";
    case FilterType.MAP_IIR:
      return "Map IIR";
    case FilterType.MAP_PACKSIZE:
      return "Map Packsize";
    case FilterType.MAP_BLIGHTED:
      return "Blighted Map";
    case FilterType.MAP_BLIGHT_RAVAGED:
      return "Blight-Ravaged Map";
    case FilterType.MAP_AREA_LEVEL:
      return "Area Level";
    case FilterType.MISC_QUALITY:
      return "Quality";
    case FilterType.MISC_ITEM_LEVEL:
      return "Item Level";
    case FilterType.MISC_GEM_LEVEL:
      return "Gem Level";
    case FilterType.MISC_GEM_EXP:
      return "Gem Experience %";
    case FilterType.MISC_FRACTURED:
      return "Fractured Item";
    case FilterType.MISC_SYNTHESIZED:
      return "Synthesised Item";
    case FilterType.MISC_SEARING_EXARCH:
      return "Searching Exarch Item";
    case FilterType.MISC_EATER_OF_WORLDS:
      return "Eater of Worlds Item";
    case FilterType.MISC_ALT_ART:
      return "Alternate Art";
    case FilterType.MISC_IDENTIFIED:
      return "Identified";
    case FilterType.MISC_CORRUPTED:
      return "Corrupted";
    case FilterType.MISC_MIRRORED:
      return "Mirrored";
    case FilterType.MISC_SPLIT:
      return "Split";
    case FilterType.MISC_CRAFTED:
      return "Crafted";
    case FilterType.MISC_VEILED:
      return "Veiled";
    case FilterType.MISC_ENCHANTED:
      return "Enchanted";
    default:
      throw new Error("Filter type not found: " + filterType);
  }
}

/**
 * DOM selectors used for scraping / finding parts of the page.
 * TODO: make readonly
 */
const QuerySelectors : Readonly<Record<string, string>> = {
  // User-readable title of the filter. Used to find the nearest input to a
  // title as a way to get the corresponding input box.
  FILTER_TITLE: ".filter-type",
  STAT_FILTERS_PARENT: ".filter-select-mutate",
};

/**
 * Using a given filter type and a hard-coded mapping of titles, find the first
 * closes input and trigger a click event (handling both inputs and selects).
 *
 * Obviously scraping isn't the most robust, but that's how Chrome extensions
 * work...
 *
 * Returns an array of DOM elements.
 */
const focusClosestSiblingInput = (filterType: FilterType) => {
  const allTitleNodes = document.querySelectorAll(".filter-type");
  const matchingTitleNode = [...allTitleNodes].find((node) => {
    const trimmedTitle = node.textContent;
    return trimmedTitle === getFilterTitleInUI(filterType);
  });
  if (!matchingTitleNode) {
    // TODO: Throw an error or fallback.
    return;
  }
  const closestSiblingInput = matchingTitleNode.parentElement?.querySelector("input");
  closestSiblingInput?.focus();
};

