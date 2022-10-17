import { useRouter } from "next/router";
import React from "react";
import AddPrayer from "./AddPrayer";
import PrayersList from "./PrayersList";
import RefreshPosts from "./RefreshPosts";

const PrayerSection = () => {
	const router = useRouter();

	const onClick = () => {
		router.push(`/groups/${router.query.groupId}/share`);
	};
	return (
		<>
			<div className="grid text-center backdrop-sepia-0 rounded-sm bg-white/75 md:grid-cols-3 align-middle justify-center mt-12 md:mt-0">
				<div className="col-start-1 col-end-3 md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2 p-3">
					<button
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={onClick}
					>
						Share
					</button>
				</div>
				<h2 className="col-start-2 col-end-3 self-center text-2xl font-bold py-2">Prayer Requests</h2>
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
