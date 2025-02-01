export const runCode = `
import os
import importlib

# Import the file and run part tests
mainfile = importlib.import_module("main_file")
mainfile_dir = dir(mainfile)

def runtest(testname, expected_values, args):
    if not os.path.exists(testname) or not os.path.isfile(testname):
        print(f"Test file {testname} not found")
        return
        
    if "parse_file" in mainfile_dir:
        parsed = mainfile.parse_file(testname)
        
        if "part1" in mainfile_dir:
            part1_val = mainfile.part1(parsed, *args)
            if part1_val != expected_values[0]:
                print(f"Part 1: expected {expected_values[0]}, got {part1_val}")
            else:
                print(f"Part 1 succeeded: {part1_val}")
         
        if "part2" in mainfile_dir:
            part2_val = mainfile.part2(parsed, *args)
            if part2_val != expected_values[1]:
                print(f"Part 2: expected {expected_values[1]}, got {part2_val}")
            else:
                print(f"Part 2 succeeded: {part2_val}")

if "tests" in mainfile_dir:
    for k, v in mainfile.tests.items():
        expected_values = v
        if isinstance(v, tuple):
            expected_values = v[0]
            args = v[1]
        else:
            args = []
            
        try:
            print(f"--- Running tests on: {k} ---") 
            runtest(k, expected_values, args)
        except Exception as e:
            print(f"Test {k} failed: {e}")
`;

export const runPart1 = `
import os
import importlib

# Import the file and run part tests
mainfile = importlib.import_module("main_file")
mainfile_dir = dir(mainfile)

if "part1" in mainfile_dir:
    if not os.path.exists("input.txt") or not os.path.isfile("input.txt"):
        print("Input file not found")
    elif "parse_file" not in mainfile_dir:
        print("parse_file function not found")
    else:
        print("Running...")
        parsed = mainfile.parse_file("input.txt")
        part1_val = mainfile.part1(parsed)
        print(f"Part 1: ", part1_val)
else:
    print("Part 1 not found")
`;

export const runPart2 = `
import os
import importlib

# Import the file and run part tests
mainfile = importlib.import_module("main_file")
mainfile_dir = dir(mainfile)

if "part2" in mainfile_dir:
    if not os.path.exists("input.txt") or not os.path.isfile("input.txt"):
        print("Input file not found")
    elif "parse_file" not in mainfile_dir:
        print("parse_file function not found")
    else:
        print("Running...")
        parsed = mainfile.parse_file("input.txt")
        part2_val = mainfile.part2(parsed)
        print(f"Part 2: ", part2_val)
else:
    print("Part 2 not found")
`;
