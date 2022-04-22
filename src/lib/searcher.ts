import { FilterSpec } from "./filter_spec";

/**
 * Handles search functionality that takes a search query and applies some type
 * of search (could be fuzzy, exact, etc.).
 */
abstract class FilterSpecSearcher {
  // Subclasses are responsible for enforcing these constants.

  // The minimum query length to return any results. Can be parameterized later,
  // but this is a reasonable default for now.
  static MIN_QUERY_LENGTH = 2;
  // Maximum number of results; algorithm should terminate early in this case.
  static MAX_RESULTS_LENGTH = 10;

  protected _filterSpecs: FilterSpec[];

  constructor(filterSpecs: FilterSpec[]) {
    this._filterSpecs = filterSpecs;
  }

  abstract search(query: string): FilterSpec[];
}

/**
 * Implements a fast approximate string match ("fuzzy search") by simply
 * checking if the letters of the query occur in the same order.
 */
export class FuzzyFilterSpecSearcher extends FilterSpecSearcher {
  constructor(filterSpecs: FilterSpec[]) {
    super(filterSpecs);
  }

  // TODO: If you have performance issues, you can have this accept an optional
  // parameter of "previousResult" and "previousQuery". If the query us a
  // superstring of the previous query, then by most algorithms the next set of
  // results should be a strict subset of the previous set of results.
  search(query: string): FilterSpec[] {
    if (query.length < FilterSpecSearcher.MIN_QUERY_LENGTH) {
      return [];
    }
    const results: FilterSpec[] = [];
    for (const spec of this._filterSpecs) {
      if (this._doesMatchFuzzy(query, spec.readableName)) {
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
    let queryIndex = 0;
    for (let textIndex = 0; textIndex < text.length; textIndex++) {
      if (text[textIndex] === query[queryIndex]) {
        queryIndex++;
      }

      const consumedQuery = queryIndex === query.length;
      if (consumedQuery) {
        return true;
      }
    }

    // TODO: Sort results
    return false;
  }
}
