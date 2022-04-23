import { FilterSpec } from "./filter_spec";

/**
 * Parse the POE endpoint data to create a list of specs for stats.
 *
 * Every load of the trade site loads the possible mods through the stats
 * endpoint. Unfortunately, we can't piggyback off the response from the
 * original call, so we'll call it again.
 *
 * Reference:
 * https://www.pathofexile.com/api/trade/data/stats
 * https://stackoverflow.com/questions/18534771/chrome-extension-how-to-get-http-response-body
 */
export const parsePoeStatData = (statData: any): FilterSpec[] => {
  const results: FilterSpec[] = [];
  const groupedByLabel = statData.result;
  for (const labelGroup of groupedByLabel) {
    // There is a `type` field and a `label` field. Label is localized;
    // therefore, we use it to properly match later on.
    const entries = labelGroup.entries;
    for (const entry of entries) {
      results.push({
        readableName: `${entry.text}`,
        isStatFilter: true,
        // pseudo only seems to have a type.
        statSubcategory: labelGroup.label.toLowerCase(),
      });
    }
  }
  return results;
};
