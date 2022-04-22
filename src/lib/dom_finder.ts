/**
 * Functions related to manipulating the DOM.
 */

import { parsePoeStatData } from "./api_data_parser";
import { FilterSpec } from "./filter_spec";

/**
 * DOM selectors used for scraping / finding parts of the page.
 *
 * Rather than hard-coding selectors, this helps to makes the process agnostic.
 */
const QuerySelectors: Readonly<Record<string, string>> = {
  // User-readable title of the filter with inputs next to it.
  FILTER_TITLE_NON_STAT: ".filter-title:not(.filter-title-clickable)",
  // A clickable filter title, such as "Type Filters", that can be hidden or
  // shown. The section may need to be toggled open for the user to access a subinput.
  FILTER_TITLE_CLICKABLE: ".filter-title.filter-title-clickable",
  STAT_FILTERS_PARENT: ".filter-select-mutate",
  // Main item search box.
  MAIN_SEARCH: ".search-left input",
};

const STAT_MODS_API_ENDPOINT =
  "https://www.pathofexile.com/api/trade/data/stats";


export class ItemTradePage {
  /**
   * Given a FilterSpec, returns the nearest HTML input element. This could be a
   * min-max filter, a stat filter, etc.
   */
  getClosestSiblingInput(filterSpec: FilterSpec): HTMLElement | null {
    // 1. Non-static filters: Try to find any non-stat filter titles that match
    //    it; if so, click the nearest input.
    if (filterSpec.isStatFilter) {
      const allTitleNodes = document.querySelectorAll(
        QuerySelectors.FILTER_TITLE_NON_STAT
      );
      const matchingTitleNode = [...allTitleNodes].find((node) => {
        const trimmedTitle = node.textContent;
        return trimmedTitle === filterSpec.readableName;
      });
      if (!matchingTitleNode) {
        // TODO: Handle error
        return null;
      }
      const closestSiblingInput =
        matchingTitleNode.parentElement?.querySelector("input");
      return closestSiblingInput || null;
    }
    // 2. Stat-filters: more complicated. Add it to the screen.
    return null;
  }

  /**
   * Focus the main item search.
   */
  focusMainSearchInput() {
    document
      .querySelector<HTMLInputElement>(QuerySelectors.MAIN_SEARCH)
      ?.focus();
  }

  /**
   * Essentially scrapes the page and the POE data endpoint to seed information
   * for future search/autocomplete functionality.
   */
  async initializeFilterSpecs() {
    const filterSpecs: FilterSpec[] = [];
    // Load the non-stat filters by scraping the page.
    const titleNodes = [
      ...document.querySelectorAll(QuerySelectors.FILTER_TITLE_NON_STAT),
    ];
    const nonStatFilterTitles: (string | null)[] = titleNodes.map(
      (n) => n?.textContent?.trim() || null
    );
    for (const t of nonStatFilterTitles) {
      if (t) {
        filterSpecs.push({
          readableName: t,
          isStatFilter: false,
        });
      }
    }

    // Load the stat filters, which are contained in a complicated JSON.
    const statData = await fetch(STAT_MODS_API_ENDPOINT).then((response) =>
      response.json()
    );
    const statFilterSpecs = parsePoeStatData(statData);

    filterSpecs.push.apply(filterSpecs, statFilterSpecs);
    return filterSpecs;
  };

}
