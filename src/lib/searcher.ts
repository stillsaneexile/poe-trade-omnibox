import { FilterSpec } from "./filter_spec";

/**
 * Handles search functionality that takes a search query and applies some type
 * of search (could be fuzzy, exact, etc.).
 *
 * TODO: This could be genericized beyond FilterSpec, if use case ever requires
 * it.
 */
abstract class FilterSpecSearcher {
  // Subclasses are responsible for enforcing these constants.

  // The minimum query length to return any results (inclusive). Can be
  // parameterized later, but this is a reasonable default for now.
  static MIN_QUERY_LENGTH = 2;
  // Maximum number of results; algorithm should terminate early in this case.
  static MAX_RESULTS_LENGTH = 25;

  protected _filterSpecs: FilterSpec[];

  constructor(filterSpecs: FilterSpec[]) {
    this._filterSpecs = filterSpecs;
  }

  /**
   * Searches the filters for the results, limiting to `MAX_RESULTS_LENGTH` and
   * taking queries >= `MIN_QUERY_LENGTH` (otherwise returns empty results).
   *
   * The search is case-insensitive.
   */
  search(query: string): FilterSpec[] {
    if (query.length < FilterSpecSearcher.MIN_QUERY_LENGTH) {
      return [];
    }
    const lowercaseQuery = query.toLowerCase();
    const results = this.searchInternal(lowercaseQuery);
    return this.sortResults(results, lowercaseQuery);
  }

  /**
   * Internal implementation of search. Subclasses are responsible for
   * implementing `MAX_RESULTS_LENGTH` (this is so that the subclass's algorithm
   * can determine when to early terminate when reaching max results).
   */
  protected abstract searchInternal(query: string): FilterSpec[];

  /**
   * Implements some type of reasonable sorting for the results.
   * For now, this is simple: it takes anything with explicit matches and puts
   * them first, then everything else is random after.
   */
  private sortResults(results: FilterSpec[], query: string): FilterSpec[] {
    const toSort = [...results];
    toSort.sort((a, b) => {
      if (a.readableName.toLowerCase().includes(query)) {
        return -1;
      }
      if (b.readableName.toLowerCase().includes(query)) {
        return 1;
      }
      return 0;
    });
    return toSort;
  }
}

/**
 * Implements a fast approximate string match ("fuzzy search"). It splits both
 * the text and query on spaces, then takes each of these tokens and check if
 * they substring match in order.
 *
 * For example: The query "ax res" matches "maximum cold resistance".
 * 
 * Case-insensitive.
 */
export class FuzzyFilterSpecSearcher extends FilterSpecSearcher {
  constructor(filterSpecs: FilterSpec[]) {
    super(filterSpecs);
  }

  // TODO: If you have performance issues, you can have this accept an optional
  // parameter of "previousResult" and "previousQuery". If the query us a
  // superstring of the previous query, then by most algorithms the next set of
  // results should be a strict subset of the previous set of results.
  protected searchInternal(query: string): FilterSpec[] {
    const results: FilterSpec[] = [];
    for (const spec of this._filterSpecs) {
      // Case-insensitive search.
      const text = `${spec.statSubcategory || ""} ${
        spec.readableName
      }`.toLowerCase();
      if (this._doesMatchFuzzy(query, text)) {
        results.push(spec);
      }

      // End early, having reached max results length.
      if (results.length >= FilterSpecSearcher.MAX_RESULTS_LENGTH) {
        return results;
      }
    }
    return results;
  }

  private _doesMatchFuzzy(query: string, text: string): boolean {
    // Query is longer than text, couldn't possibly match.
    if (query.length > text.length) {
      return false;
    }

    // Advance one letter in the text at a time, looking for it in the query. If
    // we reach the end of the query without "consuming" the whole query, then
    // return false.
    const queryTokens = query.split(' ');
    const textTokens = text.split(' ');

    let queryIndex = 0;
    for (let textIndex = 0; textIndex < textTokens.length; textIndex++) {
      if (textTokens[textIndex].includes(queryTokens[queryIndex])) {
        queryIndex++;
      }

      const consumedQuery = queryIndex === queryTokens.length;
      if (consumedQuery) {
        return true;
      }
    }

    return false;
  }
}
