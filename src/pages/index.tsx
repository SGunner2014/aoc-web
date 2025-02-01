import { useEffect, useMemo, useState } from "react";
import { YearListing } from "@/interfaces/Listing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DayListing } from "@/components/DayListing";

export default function Home() {
  const [listing, setListing] = useState<YearListing[]>();
  const [selectedYear, setSelectedYear] = useState<string>();
  const [selectedDay, setSelectedDay] = useState<number>();

  useEffect(() => {
    const listingUrl =
      "https://raw.githubusercontent.com/SGunner2014/AOC/refs/heads/main/listing.json";

    fetch(listingUrl)
      .then((response) => response.json())
      .then((data) => setListing(data));
  }, []);

  console.log(listing);

  const currentYear = useMemo(
    () => listing?.find((year) => year.year === selectedYear),
    [listing, selectedYear],
  );

  const currentDay = useMemo(
    () => selectedDay && currentYear?.days[selectedDay],
    [currentYear, selectedDay],
  );

  return (
    <div className="flex justify-center items-center h-screen bg-slate-600">
      <div className="w-[800px] min-h-[600px] shadow-2xl rounded-2xl py-8 bg-white flex flex-col gap-4 px-16">
        <h1 className="text-4xl font-bold text-center">Advent of Code</h1>
        <hr />
        {listing && (
          <div className="mt-4 flex flex-col gap-8">
            <div className="w-full grid grid-cols-2 gap-4">
              <Select onValueChange={(value) => setSelectedYear(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                  {listing.map((year) => (
                    <SelectItem key={year.year} value={year.year}>
                      {year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                disabled={!selectedYear}
                onValueChange={(value) =>
                  setSelectedDay(Number.parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a day" />
                </SelectTrigger>
                <SelectContent>
                  {selectedYear &&
                    currentYear &&
                    Object.entries(currentYear.days).map(([day]) => (
                      <SelectItem key={day} value={day}>
                        Day {day}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {selectedYear && selectedDay && currentDay && (
              <>
                {console.log("currentDay", selectedDay)}
                <hr />
                <DayListing
                  listing={currentDay}
                  year={selectedYear}
                  day={selectedDay}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
