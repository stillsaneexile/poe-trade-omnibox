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

/**
 * Non-stat filter specs.
 *
 * These are hard-coded since there's no reliable source of information for them
 * (other than scraping the screen).
 */
      const NON_STAT_FILTER_SPECS = [{
        filterType: FilterType.WEAP_DAMAGE,
      filterNameUi: "Damage",
      },
        {
          filterType: FilterType.WEAP_CRIT_CHANCE,
      filterNameUi: "Critical Chance",
        },
        {
          filterType: FilterType.WEAP_PDPS,
      filterNameUi: "Physical DPS",
        },
        {
          filterType: FilterType.WEAP_APS,
      filterNameUi: "Attacks per Second",
        },
        {
          filterType: FilterType.WEAP_DPS,
      filterNameUi: "Damage per Second",
        },
        {
          filterType: FilterType.WEAP_EDPS,
      filterNameUi: "Elemental DPS",
        },
        {
          filterType: FilterType.ARMOUR_ARMOUR,
      filterNameUi: "Armour",
        },
        {
          filterType: FilterType.ARMOUR_ES,
      filterNameUi: "Energy Shield",
        },
        {
          filterType: FilterType.ARMOUR_BLOCK,
      filterNameUi: "Block",
        },
        {
          filterType: FilterType.ARMOUR_EVASION,
      filterNameUi: "Evasion",
        },
        {
          filterType: FilterType.ARMOUR_WARD,
      filterNameUi: "Ward",
        },
        {
          filterType: FilterType.ARMOUR_BASE_PERCENTILE,
      filterNameUi: "Base Percentile",
        },
        {
          filterType: FilterType.SOCKET_SOCKETS,
      filterNameUi: "Sockets",
        },
        {
          filterType: FilterType.SOCKET_LINKS,
      filterNameUi: "Links",
        },
        {
          filterType: FilterType.REQ_STRENGTH,
      filterNameUi: "Strength",
        },
        {
          filterType: FilterType.REQ_INT,
      filterNameUi: "Intelligence",
        },
        {
          filterType: FilterType.REQ_DEX,
      filterNameUi: "Dexterity",
        },
        {
          filterType: FilterType.REQ_LEVEL,
      filterNameUi: "Level",
        },
        {
          filterType: FilterType.REQ_CHAR_CLASS,
      filterNameUi: "Character Class",
        },
        {
          filterType: FilterType.MAP_TIER,
      filterNameUi: "Map Tier",
        },
        {
          filterType: FilterType.MAP_IIQ,
      filterNameUi: "Map IIQ",
        },
        {
          filterType: FilterType.MAP_IIR,
      filterNameUi: "Map IIR",
        },
        {
          filterType: FilterType.MAP_PACKSIZE,
      filterNameUi: "Map Packsize",
        },
        {
          filterType: FilterType.MAP_BLIGHTED,
      filterNameUi: "Blighted Map",
        },
        {
          filterType: FilterType.MAP_BLIGHT_RAVAGED,
      filterNameUi: "Blight-Ravaged Map",
        },
        {
          filterType: FilterType.MAP_AREA_LEVEL,
      filterNameUi: "Area Level",
        },
        {
          filterType: FilterType.MISC_QUALITY,
      filterNameUi: "Quality",
        },
        {
          filterType: FilterType.MISC_ITEM_LEVEL,
      filterNameUi: "Item Level",
        },
        {
          filterType: FilterType.MISC_GEM_LEVEL,
      filterNameUi: "Gem Level",
        },
        {
          filterType: FilterType.MISC_GEM_EXP,
      filterNameUi: "Gem Experience %",
        },
        {
          filterType: FilterType.MISC_FRACTURED,
      filterNameUi: "Fractured Item",
        },
        {
          filterType: FilterType.MISC_SYNTHESIZED,
      filterNameUi: "Synthesised Item",
        },
        {
          filterType: FilterType.MISC_SEARING_EXARCH,
      filterNameUi: "Searching Exarch Item",
        },
        {
          filterType: FilterType.MISC_EATER_OF_WORLDS,
      filterNameUi: "Eater of Worlds Item",
        },
        {
          filterType: FilterType.MISC_ALT_ART,
      filterNameUi: "Alternate Art",
        },
        {
          filterType: FilterType.MISC_IDENTIFIED,
      filterNameUi: "Identified",
        },
        {
          filterType: FilterType.MISC_CORRUPTED,
      filterNameUi: "Corrupted",
        },
        {
          filterType: FilterType.MISC_MIRRORED,
      filterNameUi: "Mirrored",
        },
        {
          filterType: FilterType.MISC_SPLIT,
      filterNameUi: "Split",
        },
        {
          filterType: FilterType.MISC_CRAFTED,
      filterNameUi: "Crafted",
        },
        {
          filterType: FilterType.MISC_VEILED,
      filterNameUi: "Veiled",
        },
        {
          filterType: FilterType.MISC_ENCHANTED,
      filterNameUi: "Enchanted",
        }]

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

