import React from "react";
import AddPrayer from "./AddPrayer";
import PrayersList from "./PrayersList";
import RefreshPosts from "./RefreshPosts";

const PrayerSection = () => {
	return (
		<>
			<div className="grid text-center backdrop-sepia-0 rounded-sm bg-white/75 md:grid-cols-3 align-middle justify-center mt-12 md:mt-0">
				<h2 className="col-start-2 col-end-3 self-center text-2xl font-bold py-2">
					Prayer Requests
				</h2>
				<div className="col-start-2 col-end-2 flex justify-center">
					<AddPrayer />
					<RefreshPosts />
				</div>
				<div className="col-start-1 col-end-4">
					<PrayersList />
				</div>
			</div>
		</>
	);
};

export default PrayerSection;
