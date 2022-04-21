/**
 * Functions related to manipulating the DOM.
 */

import {parsePoeStatData} from "./api_data_parser";

/**
 * A spec containing information about a certain filter type.
 */
export interface FilterSpec {
  // Human-readable name in UI.
  readableName: string;
  // The UI has a huge distinction in behavior between stat and non-stat
  // behaviors.
  isStatFilter: boolean;
  // Delve, Fractured, Enchant, etc. This is required due to some hackery to
  // pick the correct one from the dropdown list.
  //
  // To explain further, the UI shows something like: "DELVE Item is overvalued
  // by vendors", but there's no string you can type in to trigger this, so we
  // need this information to pick the right one in a hacky way later.
  statSubcategory: string;
}

/**
 * DOM selectors used for scraping / finding parts of the page.
 *
 * Rather than hard-coding selectors, this helps to makes the process agnostic.
 */
const QuerySelectors : Readonly<Record<string, string>> = {
  // User-readable title of the filter with inputs next to it.
  FILTER_TITLE_NON_STAT: ".filter-title:not(.filter-title-clickable)",
  // A clickable filter title, such as "Type Filters", that can be hidden or
  // shown. The section may need to be toggled open for the user to access a subinput.
  FILTER_TITLE_CLICKABLE: ".filter-title.filter-title-clickable",
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
const focusClosestSiblingInput = (filterSpec: FilterSpec) => {
  // 1. Non-static filters: Try to find any non-stat filter titles that match
  //    it; if so, click the nearest input.
  if (filterSpec.isStatFilter) {
    const allTitleNodes = document.querySelectorAll(QuerySelectors.FILTER_TITLE_NON_STAT);
    const matchingTitleNode = [...allTitleNodes].find((node) => {
      const trimmedTitle = node.textContent;
      return trimmedTitle === filterSpec.readableName;
    });
    if (!matchingTitleNode) {
      // TODO: Throw an error or fallback.
      return;
    }
    const closestSiblingInput = matchingTitleNode.parentElement?.querySelector("input");
    closestSiblingInput?.focus();
  }

  // 2. Stat-filters: more complicated. Add it to the screen.

  // 3. Otherwise, it should be a bug -- user never should have reached this
  //    point.

};

const loadUiSpecs = async () => {
  const filterSpecs : FilterSpec[] = [];
  // Load the non-stat filters by scraping the page.
  const titleNodes = [...document.querySelectorAll(QuerySelectors.FILTER_TITLE_NON_STAT)];
  const nonStatFilterTitles : string[] = titleNodes.map((n) => n?.textContent?.trim() ||
    null);
  for (const t of nonStatFilterTitles) {
    filterSpecs.push({
      readableName: t,
      isStatFilter: false,
    });
  }

  // Load the stat filters, which are contained in a complicated JSON.
  // TODO: do fetch
  const statFilterSpecs = parsePoeStatData(statData);

  filterSpecs.push.apply(filterSpecs, statFilterSpecs);
  return filterSpecs;
};

