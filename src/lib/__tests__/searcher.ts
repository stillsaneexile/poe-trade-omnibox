import { FuzzyFilterSpecSearcher } from "../searcher";
import { FilterSpec } from "../filter_spec";

const TEST_FILTER_SPECS: FilterSpec[] = [
  {
    readableName: "foo bar baz",
    isStatFilter: false,
  },
  {
    readableName: "quux",
    isStatFilter: false,
  },
  {
    readableName: "foo baz bar",
    isStatFilter: false,
  },
  {
    readableName: "quu",
    isStatFilter: false,
  },
];

const getNames = (specs: FilterSpec[]) => {
  return specs.map((s) => s.readableName);
};

test("respects min query length", () => {
  const searcher = new FuzzyFilterSpecSearcher(TEST_FILTER_SPECS);
  expect(searcher.search("f")).toHaveLength(0);
  expect(searcher.search("fo")).not.toHaveLength(0);
});

test("respects max result limit", () => {
  const filterSpecs: FilterSpec[] = [];
  for (let i = 0; i < 100; i++) {
    filterSpecs.push({
      readableName: "abcdefg",
      isStatFilter: false,
    });
  }
  const searcher = new FuzzyFilterSpecSearcher(filterSpecs);
  const results = searcher.search("abc");
  expect(results).toHaveLength(25);
});

test("returns nothing for total misses", () => {
  const searcher = new FuzzyFilterSpecSearcher(TEST_FILTER_SPECS);
  expect(getNames(searcher.search("quubar"))).toHaveLength(0);
  expect(getNames(searcher.search("randomstuff"))).toHaveLength(0);
  expect(getNames(searcher.search("totalmiss"))).toHaveLength(0);
});

test("works for building up full substring from prefix", () => {
  const searcher = new FuzzyFilterSpecSearcher(TEST_FILTER_SPECS);
  expect(getNames(searcher.search("qu"))).toEqual(
    expect.arrayContaining(["quux", "quu"])
  );
  expect(getNames(searcher.search("quu"))).toEqual(
    expect.arrayContaining(["quux", "quu"])
  );
  expect(getNames(searcher.search("quux"))).toEqual(
    expect.arrayContaining(["quux"])
  );
});

test("works for building up full substring from suffix", () => {
  const searcher = new FuzzyFilterSpecSearcher(TEST_FILTER_SPECS);
  expect(getNames(searcher.search("ux"))).toEqual(
    expect.arrayContaining(["quux"])
  );
  expect(getNames(searcher.search("uux"))).toEqual(
    expect.arrayContaining(["quux"])
  );
  expect(getNames(searcher.search("quux"))).toEqual(
    expect.arrayContaining(["quux"])
  );
});

test("respects patterns that skip on the text", () => {
  const searcher = new FuzzyFilterSpecSearcher(TEST_FILTER_SPECS);
  expect(getNames(searcher.search("fb"))).toEqual(
    expect.arrayContaining(["foo baz bar", "foo bar baz"])
  );
  expect(getNames(searcher.search("fbb"))).toEqual(
    expect.arrayContaining(["foo baz bar"])
  );
  expect(getNames(searcher.search("fbz"))).toEqual(
    expect.arrayContaining(["foo bar baz"])
  );
});

test("case-insensitive to query", () => {
  const searcher = new FuzzyFilterSpecSearcher(TEST_FILTER_SPECS);
  expect(getNames(searcher.search("fB"))).toEqual(
    expect.arrayContaining(["foo baz bar", "foo bar baz"])
  );
  expect(getNames(searcher.search("fBb"))).toEqual(
    expect.arrayContaining(["foo baz bar"])
  );
  expect(getNames(searcher.search("FBZ"))).toEqual(
    expect.arrayContaining(["foo bar baz"])
  );
});

test("case-insensitive to results", () => {
  const searcher = new FuzzyFilterSpecSearcher([{
      readableName: "HeLlo WorLd",
      isStatFilter: false,
    }]);
  expect(getNames(searcher.search("hello"))).toEqual(
    expect.arrayContaining(["HeLlo WorLd"])
  );
  expect(getNames(searcher.search("lo wo"))).toEqual(
    expect.arrayContaining(["HeLlo WorLd"])
  );
});
