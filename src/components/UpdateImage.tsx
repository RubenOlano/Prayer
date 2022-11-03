import { FC, useCallback } from "react";
import { env } from "../env/client.mjs";
import { debounce } from "../utils/debounce";
import { trpc } from "../utils/trpc";
import Image from "next/image.js";
import { getImage } from "../utils/defaultUserImage";

interface Props {
	user: {
		name: string | null;
		email: string | null;
		id: string;
		image: string | undefined;
	};
}

const CLOUDINARY_UPLOAD_PRESET = env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = env.NEXT_PUBLIC_CLOUDINARY_URL;

const UpdateImage: FC<Props> = ({ user }) => {
	const utils = trpc.useContext();
	const { mutate } = trpc.users.updateUserImage.useMutation({
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
			<div>
				<span className="block mb-2">Choose profile photo</span>
				<Image src={getImage(user.image)} alt="user image" width={100} height={100} />
				<input
					className="
                        w-full
                    text-sm mb-2 text-slate-500 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
					type="file"
					name="image"
					onChange={onFileDrop}
					multiple={false}
					accept="image/jpg, image/png, image/jpeg"
				/>
			</div>
		</div>
	);
};

export default UpdateImage;
