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
  statSubcategory?: string;
}


