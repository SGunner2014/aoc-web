export interface TestListing {
  filename: string;
  expected: unknown[];
  args?: unknown[];
}

export interface DayListing {
  main_file: string;
  dir_path: string;
  inputs: string[];
  example_inputs: string[];
  part1?: boolean;
  part2?: boolean;
  tests: TestListing[];
}

export interface YearListing {
  year: string;
  days: Record<number, DayListing>;
}

export interface FetchedDayListing {
  main_file: string;
  inputs: Record<string, string>;
  example_inputs: Record<string, string>;
  part1?: boolean;
  part2?: boolean;
  tests: TestListing[];
}
