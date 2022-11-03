import { Post, User } from "@prisma/client";
import Link from "next/link";
import { FC } from "react";

interface Props {
	regPosts?: (Post & {
		author: User;
	})[];
	anon?: {
		title: string;
		content: string | null;
		Duration: Date;
		id?: string;
	}[];
}

const PrayerRequest: FC<Props> = ({ regPosts, anon }) => {
	return (
		<>
			<div className="flex flex-col py-2 overflow-scroll h-[45vh]">
				{regPosts &&
					regPosts.length > 0 &&
					regPosts?.map(post => (
						<Link
							href={`/posts/${post.id}`}
							className="flex flex-col items-center backdrop-sepia-0 rounded-sm bg-white/75 m-2 p-3 hover:cursor-pointer hover:bg-blue-500 hover:bg-opacity-25"
							key={post.id}
						>
							<h2 className="text-2xl font-bold text-center m-3">{post.title}</h2>
							<p className="italic font-bold text-center ">{post.author.name}</p>
						</Link>
					))}
				{anon &&
					anon.length > 0 &&
					anon.map(post => (
						<Link
							href={`/posts/${post.id}`}
							className="flex flex-col items-center backdrop-sepia-0 rounded-sm bg-white/75 m-2 p-3 hover:cursor-pointer hover:bg-blue-500 hover:bg-opacity-25"
							key={post.id}
						>
							<h2 className="text-2xl font-bold text-center m-3">{post.title}</h2>
							<p className="italic font-bold text-center ">Anonymous</p>
						</Link>
					))}
			</div>
		</>
	);
};

export default PrayerRequest;
