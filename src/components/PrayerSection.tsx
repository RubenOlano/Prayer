import React from "react";
import AddPrayer from "./AddPrayer";
import PrayersList from "./PrayersList";

const PrayerSection = () => {
  return (
    <>
      <div className="flex flex-col flex-wrap justify-center backdrop-sepia-0 rounded-sm bg-white/75 overflow-hidden h-[75vh] p-3 w-[25rem]">
        <h2 className="justify-center text-2xl font-bold flex mb-3">
          Prayer Requests
        </h2>
        <AddPrayer />
        <PrayersList />
      </div>
    </>
  );
};

export default PrayerSection;
