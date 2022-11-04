import { trpc } from "../utils/trpc";
import { Refresh } from "./Icons";

const RefreshPosts = () => {
	const utils = trpc.useContext();
	const onClick = () => {
		utils.posts.getGroupPosts.invalidate();
	};
	return (
		<button
			className="flex text-sm flex-row items-center align-middle justify-center py-1 px-3 bg-blue-500 hover:bg-blue-700 text-white font-bold md:py-2 md:px-4 rounded m-2"
			type="button"
			onClick={onClick}
		>
			<Refresh dimensions={80} />
		</button>
	);
};

export default RefreshPosts;
