"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FetchedDayListing } from "@/interfaces/Listing";
import { usePython } from "react-py";
import { runPart1, runPart2, runCode } from "@/components/run-code";
import { useMemo } from "react";

export interface CodeRunPanelProps {
  fetchedListing?: FetchedDayListing;
  selectedFile?: string;
  fileContents?: string;
}

export const CodeRunPanel = ({
  fetchedListing,
  selectedFile,
  fileContents,
}: CodeRunPanelProps) => {
  const { runPython, writeFile, stdout, isReady, isRunning, stderr } =
    usePython({
      packages: {
        micropip: ["pyodide_http"],
      },
    });

  const canRunTests = useMemo(() => {
    return (
      fetchedListing!.tests.length > 0 &&
      Object.values(fetchedListing!.example_inputs).length > 0 &&
      isReady
    );
  }, [fetchedListing, isReady]);

  const canRunPart1 = useMemo(() => {
    if (!fetchedListing?.part1) return false;
    if (!selectedFile || selectedFile.trim().length === 0) return false;
    if (selectedFile === "_upload" && !fileContents) return false;
    return isReady;
  }, [fetchedListing, fileContents, isReady, selectedFile]);

  const canRunPart2 = useMemo(() => {
    if (!fetchedListing?.part2) return false;
    if (!selectedFile || selectedFile.trim().length === 0) return false;
    if (selectedFile === "_upload" && !fileContents) return false;
    return isReady;
  }, [fetchedListing, fileContents, isReady, selectedFile]);

  /**
   * Write the input file to the virtual filesystem
   */
  const writeInputFile = async () => {
    if (selectedFile === "_upload") {
      await writeFile("input.txt", fileContents!);
    } else if (selectedFile) {
      if (fetchedListing!.inputs[selectedFile]) {
        await writeFile("input.txt", fetchedListing!.inputs[selectedFile]);
      } else if (fetchedListing!.example_inputs[selectedFile]) {
        await writeFile(
          "input.txt",
          fetchedListing!.example_inputs[selectedFile],
        );
      } else {
        return;
      }
    }
  };

  /**
   * Run the code based on the input type
   *
   * @param input
   */
  const handleCodeRun = async (input: "tests" | "part1" | "part2") => {
    await writeFile("main_file.py", fetchedListing!.main_file);

    // Write all the files to the virtual filesystem
    await Promise.all(
      Object.entries(fetchedListing!.example_inputs).map(
        async ([filename, content]) => await writeFile(filename, content),
      ),
    );
    await Promise.all(
      Object.entries(fetchedListing!.inputs).map(
        async ([filename, content]) => await writeFile(filename, content),
      ),
    );

    if (input === "tests") {
      runPython(runCode);
    } else if (input === "part1") {
      await writeInputFile();
      runPython(runPart1);
    } else if (input === "part2") {
      await writeInputFile();
      runPython(runPart2);
    }
  };

  return (
    <>
      <p>
        <strong>stdout</strong>
      </p>
      <Textarea rows={8} readOnly className="resize-none" value={stdout} />
      <p>
        <strong>stderr</strong>
      </p>
      <Textarea rows={8} readOnly className="resize-none" value={stderr} />
      <div className="flex flex-row gap-4 [&>*]:flex-grow">
        <Button
          onClick={() => handleCodeRun("tests")}
          disabled={!canRunTests || isRunning}
        >
          Run Tests
        </Button>
        <Button
          onClick={() => handleCodeRun("part1")}
          disabled={!canRunPart1 || isRunning}
        >
          Run Part 1
        </Button>
        <Button
          onClick={() => handleCodeRun("part2")}
          disabled={!canRunPart2 || isRunning}
        >
          Run Part 2
        </Button>
      </div>
    </>
  );
};
