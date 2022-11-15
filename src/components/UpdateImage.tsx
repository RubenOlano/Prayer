import { useCallback } from "react";
import { env } from "../env/client.mjs";
import { debounce } from "../utils/debounce";
import { trpc } from "../utils/trpc";
import Image from "next/image.js";
import { getImage } from "../utils/defaultUserImage";

interface Props {
	user: {
		id: string;
	} & {
		name?: string | null | undefined;
		email?: string | null | undefined;
		image?: string | null | undefined;
	};
}

const CLOUDINARY_UPLOAD_PRESET = env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = env.NEXT_PUBLIC_CLOUDINARY_URL;

function UpdateImage({ user }: Props) {
	const utils = trpc.useContext();
	const { mutate, isLoading, isSuccess } = trpc.users.updateUserImage.useMutation({
		onMutate: () => {
			debounce(() => {
				utils.users.getUser.invalidate({ id: user.id });
			}, 100)();
		},
	});

	const onFileDrop = useCallback(
		async (e: React.SyntheticEvent<EventTarget>) => {
			const target = e.target as HTMLInputElement;
			if (!target.files) return;
			const newFile = Object.values(target.files).map((file: File) => file);
			const formData = new FormData();
			if (newFile.length < 1 || !newFile[0]) return;
			formData.append("file", newFile[0]);
			formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

			await fetch(CLOUDINARY_URL, {
				method: "POST",
				body: formData,
			})
				.then(res => {
					return res.json();
				})
				.then(data => {
					mutate({ image: data.secure_url, id: user.id });
				})
				.catch(err => {
					console.log(err);
				});
		},

		[user.id, mutate]
	);

	return (
		<div className="mb-2 flex items-center align-middle justify-center">
			<div className="flex flex-col items-center justify-center ">
				<span className="block mb-2">Choose profile photo</span>
				<Image src={getImage(user.image)} alt="user image" width={100} height={100} />
				<input
					className={`file-input file-input-xs md:file-input-md ${isSuccess && "bg-success"} ${
						isLoading && "bg-secondary"
					} `}
					type="file"
					name="image"
					onChange={onFileDrop}
					multiple={false}
					accept="image/jpg, image/png, image/jpeg"
					disabled={isLoading}
				/>
			</div>
		</div>
	);
}

UpdateImage.Skeleton = function UpdateImageSkeleton() {
	return (
		<div className="mb-2 flex items-center align-middle justify-center animate-pulse">
			<div className="flex flex-col items-center justify-center ">
				<span className="block mb-2">Choose profile photo</span>
				<div className="bg-gray-300 w-24 h-25 block" />
				<input
					className={`file-input `}
					type="file"
					name="image"
					multiple={false}
					accept="image/jpg, image/png, image/jpeg"
				/>
			</div>
		</div>
	);
};
export default UpdateImage;
