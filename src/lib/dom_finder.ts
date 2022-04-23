/**
 * Functions related to manipulating the DOM.
 */

import invariant from "ts-invariant";
import { parsePoeStatData } from "./api_data_parser";
import emulateKeyboard from "./emulate_keyboard";
import { FilterSpec } from "./filter_spec";
import waitUntil from "./wait_until";

/**
 * DOM selectors used for scraping / finding parts of the page.
 *
 * Rather than hard-coding selectors, this helps to makes the process agnostic.
 */
const Selectors: Readonly<Record<string, string>> = {
  // User-readable title of the filter with inputs next to it.
  FILTER_TITLE_NON_STAT: ".filter-title:not(.filter-title-clickable)",
  // A clickable filter title, such as "Type Filters", that can be hidden or
  // shown. The section may need to be toggled open for the user to access a subinput.
  FILTER_TITLE_CLICKABLE: ".filter-title.filter-title-clickable",
  STAT_FILTERS_PARENT: ".filter-select-mutate",
  // Main item search box.
  MAIN_SEARCH: ".search-left input",
  // Reset everything.
  CLEAR_BUTTON: ".clear-btn",
  // The "Add stat filter" button, but note that this is ambiguous if there are Stat Groups.
  // For some reason "brown" = stat section.
  ADD_STAT_FILTER:
    ".search-advanced-pane.brown .filter-group-body input.multiselect__input",
  // A not-very-exact filter for the "min/max" fields. You'll need to use this
  // relative to some other object to accurately get the one you want.
  INPUT_MIN_MAX: "input.minmax",
  STAT_FILTER_MINMAX: ".search-advanced-pane.brown .filter-group-body input.minmax",
  // Use with .closest() to find the same filter group.
  PARENT_FILTER_GROUP: ".filter-group",
  // Pretty complicated.
  // .multiselect__element prevents selecting "No results found."
  // The :not clause prevents selecting the headers that appear ("Pseudo",
  // "Fractured").
  STAT_FILTER_DROPDOWN_ELEMENTS: ".multiselect--active .multiselect__content-wrapper .multiselect__element .multiselect__option:not(.multiselect__option--disabled)",
  // The presence of such a class would indicate that some stat filter is open.
  STAT_FILTER_ACTIVE: ".multiselect--active",
  // Can be used to count the number of filters added.
  GENERIC_FILTER_LINE: ".filter",
  // Used throughout the app for anything that can be focused to bring up a
  // select.
  MULTISELECT_INPUT: "input.multiselect__input",
  // The presence of this indicates that filters are hidden.
  ARE_FILTERS_HIDDEN: ".search-advanced-hidden",
  TOGGLE_FILTERS_BUTTON: ".toggle-search-btn",
};

const STAT_MODS_API_ENDPOINT =
  "https://www.pathofexile.com/api/trade/data/stats";

export class ItemTradePage {
  /**
   * Given a FilterSpec, returns the nearest HTML input element. This is used
   * for non-stat filters (those on the left side of the trade UI, such as
   * sockets, links, etc).
   */
  async focusClosestSiblingInput(filterSpec: FilterSpec) {
    invariant(!filterSpec.isStatFilter);
      const allTitleNodes = document.querySelectorAll(
        Selectors.FILTER_TITLE_NON_STAT
      );
      const matchingTitleNode = [...allTitleNodes].find((node) => {
        const trimmedTitle = node.textContent!.trim();
        return trimmedTitle === filterSpec.readableName;
      });
      if (!matchingTitleNode) {
        console.error("Couldn't find title: " + filterSpec.readableName);
        return;
      }
      const closestSiblingInput =
        matchingTitleNode.parentElement?.querySelector("input");
    if (!closestSiblingInput) {
      console.error("Couldn't find sibling input for non-stat spec.");
      return;
    }
    await this.maybeExpandParentSection(closestSiblingInput);
    closestSiblingInput.focus();
  }

  /**
   * Focus the main item search.
   */
  focusMainSearchInput() {
    document.querySelector<HTMLInputElement>(Selectors.MAIN_SEARCH)?.focus();
  }

  /**
   * Essentially scrapes the page and the POE data endpoint to seed information
   * for future search/autocomplete functionality.
   */
  async initializeFilterSpecs() {
    const filterSpecs: FilterSpec[] = [];
    // Load the non-stat filters by scraping the page.
    const titleNodes = [
      ...document.querySelectorAll(Selectors.FILTER_TITLE_NON_STAT),
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
  }

  /**
   * Shows the filter section, if needed. This is hidden after a search.
   */
  maybeShowFilters() {
    if (document.querySelector(Selectors.ARE_FILTERS_HIDDEN)) {
      document.querySelector<HTMLButtonElement>(Selectors.TOGGLE_FILTERS_BUTTON)?.click();
    }
  }

  /**
   * Cycles focusing through "min" boxes on the stat filter. If one is already
   * highlighted, it jumps to the previous.
   */
  focusLastMinStatFilter(eventTarget: EventTarget | null) {
   // Unfortunately, there's no way to distinguish min/max box except
   // placeholder (not locale agnostic). We use the fact that the classes come
   // in pairs of twos; presumably the "min" box is the first of the pair.
   let minMaxStatFilters = document.querySelectorAll<HTMLInputElement>(Selectors.STAT_FILTER_MINMAX);
   if (minMaxStatFilters.length === 0) {
     return;
   }

   // First check if any of the min OR max stat filters are selected. If they
   // are, then we jump to the previous one. Otherwise, default to last.
   var indexToFocus = minMaxStatFilters.length - 2;
   for (let i = 0; i < minMaxStatFilters.length; ++i) {
     // https://stackoverflow.com/questions/49693981/how-to-use-eventtarget-in-typescript
     if (eventTarget && (eventTarget as HTMLElement).isSameNode(minMaxStatFilters[i])) {
       // Find the previous min filter.
       if (i % 2 === 0) {
         indexToFocus = i - 2;
       } else {
         indexToFocus = i - 3;
       }
     }
   }
   // Implement wraparound logic.
   if (indexToFocus < 0) {
     indexToFocus = minMaxStatFilters.length + indexToFocus;
   }
   minMaxStatFilters[indexToFocus]?.focus();
 }

  /**
   * Basically a WebDriver script to click and find a filter given a filter
   * spec.
   */
  async addStatFilterSpec(spec: FilterSpec) {
    // Focus the add stat filter.
    const filters = document.querySelectorAll<HTMLInputElement>(
      Selectors.ADD_STAT_FILTER
    );
    // For things like temple room stats, the added input is also of the same
    // selector.
    const focusTarget = filters[filters.length - 1];
    if (!focusTarget) {
      console.error("Missing focus target.");
      return;
    }

      // Focusing is what brings up the menu to select a stat.
      focusTarget.focus();
      // More flakiness. This basically waits until the popup window updates for add
      // stats.
      await waitUntil(() =>
        Boolean(
          focusTarget
            .closest(Selectors.PARENT_FILTER_GROUP)
            ?.querySelector(Selectors.STAT_FILTER_ACTIVE)
        )
      );
      emulateKeyboard(spec.readableName, focusTarget);

    const parentFilterGroup = focusTarget.closest(Selectors.PARENT_FILTER_GROUP);
    if (!parentFilterGroup) {
      console.error("Missing parent filter group.");
      return;
    }

    // Flaky WebDriver-ish behavior. Need to wait until the dropdown updates
    // You can't just check for the name because it could be something on the
    // initial list.
    await waitUntil(() => {
      // .multiselect__element prevents selecting "No results found."
      const selectOptions = [
        ...(parentFilterGroup?.querySelectorAll<HTMLButtonElement>(
          Selectors.STAT_FILTER_DROPDOWN_ELEMENTS
        ) || [])];
      return selectOptions.every(e =>
        e.textContent!.includes(spec.readableName));
    }
    );

    // Calculate which item to click. Now, this is again tricky: tags like
    // "Pseudo" or "Fractured" need to be compared in a semihacky way; there's
    // no super-clean way to do string comparison.
    const selectOptions = [
      ...(parentFilterGroup?.querySelectorAll<HTMLButtonElement>(
          Selectors.STAT_FILTER_DROPDOWN_ELEMENTS
      ) || []),
    ];

    let selectedOption = null;
    for (const optionNode of selectOptions) {
      const normalized = optionNode.textContent!.trim().toLowerCase();
     const foundMatch = 
        spec.statSubcategory &&
        normalized === `${spec.statSubcategory} ${spec.readableName.toLowerCase()}`;
      if (foundMatch) {
        selectedOption = optionNode;
      }
    }

    if (!selectedOption) {
      // Really shouldn't happen unless there's a bug in the matching above.
      console.error("There was an error finding the option.");
      return;
    }

    // Simulate a click on the item.
    selectedOption.click();

    // This is a flaky part. Unfortunately if we want to chain actions like
    // this, like WebDriver, we need to fake-wait until an element appears (a
    // new filter will be added).
    const preClickFiltersLength =
      parentFilterGroup.querySelectorAll(Selectors.GENERIC_FILTER_LINE)!.length;

    await waitUntil(
      () =>
        parentFilterGroup.querySelectorAll(Selectors.GENERIC_FILTER_LINE).length ===
        preClickFiltersLength + 1
    );

    // Now focus the input boxes nearest to the clicked stat. Basically the way
    // this works is that a .filter-group-body has multiple .filter; the "add
    // stat button" is also such a .filter. Therefore, the most recently added
    // stat is going to be the second to last ".filter."
    //
    // It's really really important that you querySelectorAll again here: do not
    // use a stale variable.
    const filtersPostClick =
      parentFilterGroup.querySelectorAll(Selectors.GENERIC_FILTER_LINE);
    const secondToLastFilter = filtersPostClick.item(
      Math.max(filtersPostClick.length - 2, 0)
    );
    const nearestMinInput = secondToLastFilter?.querySelector<HTMLInputElement>(
      Selectors.INPUT_MIN_MAX
    );
    const nearestMultiselectInput =
      secondToLastFilter?.querySelector<HTMLInputElement>(Selectors.MULTISELECT_INPUT);
    if (nearestMinInput) {
    nearestMinInput.focus();
    } else if (nearestMultiselectInput) {
      // Some types, like temple rooms, have another multiselect input.
      nearestMultiselectInput.focus();
    } else {
      console.error("Missing min input and multiselect input.");
      return;
    }
  }

  /**
   * Resets the search on the page.
   */
  clearPage() {
    document.querySelector<HTMLButtonElement>(Selectors.CLEAR_BUTTON)!.click();
    document.querySelector<HTMLInputElement>(Selectors.MAIN_SEARCH)!.value = "";
  }

  /**
   * A filter section could be hidden and needs to be expanded if it's not
   * already visible. This finds the nearest such parent.
   */
  private async maybeExpandParentSection(el: HTMLElement) {
    const filterGroup = el.closest(Selectors.PARENT_FILTER_GROUP);
    filterGroup?.querySelector<HTMLButtonElement>(".toggle-btn.off")?.click();
    // Need to wait until it shows.
    await waitUntil(() => Boolean(filterGroup?.querySelector(".toggle-btn:not(.off)")));
  }
}
