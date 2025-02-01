"use client";

import {
  DayListing as DayListingInterface,
  FetchedDayListing,
} from "@/interfaces/Listing";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CodeRunPanel } from "@/components/CodeRunPanel";
import { PythonProvider } from "react-py/dist";

export interface DayListingProps {
  listing: DayListingInterface;
  year: string;
  day: number;
}

export const DayListing = ({ listing, year, day }: DayListingProps) => {
  const [fetchedListing, setFetchedListing] = useState<FetchedDayListing>();
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedFiles, setFetchedFiles] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<string>();
  const [fileContents, setFileContents] = useState<string>();

  useEffect(() => {
    setFetchedFiles(new Set());
  }, [year, day]);

  const totalFiles = useMemo(() => {
    let totalFiles = 1; // main file

    totalFiles += listing.example_inputs.length;
    totalFiles += listing.inputs.length;

    return totalFiles;
  }, [listing.example_inputs.length, listing.inputs.length]);

  const fetchRemoteFile = async (filename: string): Promise<string> => {
    const listingUrl =
      "https://raw.githubusercontent.com/SGunner2014/AOC/refs/heads/main";
    const response = await axios.get(
      `${listingUrl}/${listing.dir_path}/${filename}`,
    );

    setFetchedFiles((files) => files.add(filename));

    return response.data;
  };

  const fetchRemoteInputs = async (
    inputs: string[],
  ): Promise<Record<string, string>> => {
    const toReturn: Record<string, string> = {};

    await Promise.all(
      inputs.map(async (input) => {
        toReturn[input] = await fetchRemoteFile(input);
      }),
    );

    return toReturn;
  };

  const fetchListing = useCallback(
    async () => ({
      tests: listing.tests,
      inputs: await fetchRemoteInputs(listing.inputs),
      example_inputs: await fetchRemoteInputs(listing.example_inputs),
      main_file: await fetchRemoteFile(listing.main_file),
      part1: listing.part1 ?? false,
      part2: listing.part2 ?? false,
    }),
    [
      fetchRemoteFile,
      fetchRemoteInputs,
      listing.example_inputs,
      listing.inputs,
      listing.main_file,
      listing.part1,
      listing.part2,
      listing.tests,
    ],
  );

  useEffect(() => {
    setIsFetching(true);
    fetchListing().then((listing) => {
      setFetchedListing(listing);
      setIsFetching(false);
    });
  }, [year, day]);

  if (isFetching) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Progress value={(fetchedFiles.size / totalFiles) * 100} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        {/* select a file or upload */}
        <Select onValueChange={(value) => setSelectedFile(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a file to run..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"_upload"} key="upload">
              Upload a file
            </SelectItem>
            {listing.example_inputs.length > 0 && (
              <SelectGroup>
                <SelectLabel>Example files</SelectLabel>
                {listing.example_inputs.map((input) => (
                  <SelectItem value={input} key={input}>
                    {input}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            {listing.inputs.length > 0 && (
              <SelectGroup>
                <SelectLabel>Input files</SelectLabel>
                {listing.inputs.map((input) => (
                  <SelectItem value={input} key={input}>
                    {input}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
        <Input
          type="file"
          className="cursor-pointer"
          disabled={selectedFile !== "_upload"}
          placeholder="Upload a file to run..."
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              const reader = new FileReader();

              reader.onload = async (e) => {
                const content = e.target?.result as string;
                setFileContents(content);
              };
              reader.readAsText(file);
            }
          }}
        />
      </div>
      {(selectedFile !== "_upload" ||
        (selectedFile === "_upload" && fileContents)) && (
        <>
          <hr />
          <PythonProvider>
            {fetchedListing && (
              <CodeRunPanel
                fetchedListing={fetchedListing}
                selectedFile={selectedFile}
                fileContents={fileContents}
              />
            )}
          </PythonProvider>
        </>
      )}
    </div>
  );
};
