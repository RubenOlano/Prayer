import React from "react";
import AddPrayer from "./AddPrayer";
import PrayersList from "./PrayersList";

const PrayerSection = () => {
  return (
    <>
      <div className="grid text-center backdrop-sepia-0 rounded-sm bg-white/75 md:grid-cols-3 align-middle justify-center p-2">
        <h2 className="col-start-2 col-end-3 self-centertext-2xl font-bold">
          Prayer Requests
        </h2>
        <div className="col-start-2 col-end-3">
          <AddPrayer />
        </div>
        <div className="col-start-1 col-end-4">
          <PrayersList />
        </div>
      </div>
    </>
  );
};

export default PrayerSection;
