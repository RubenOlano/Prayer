import { useCallback } from "react";
import { env } from "../env/client.mjs";
import { debounce } from "../utils/debounce.js";
import { trpc } from "../utils/trpc.js";

const CLOUDINARY_UPLOAD_PRESET = env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_URL = env.NEXT_PUBLIC_CLOUDINARY_URL;

const UpdateImageForm = () => {
	const utils = trpc.useContext();
	const { mutate, isLoading, isSuccess } = trpc.users.updateUserImage.useMutation({
		onMutate: () => {
			debounce(() => {
				utils.users.getUser.invalidate();
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
					mutate({ image: data.secure_url });
				})
				.catch(err => {
					console.error(err);
				});
		},

		[mutate]
	);
	return (
		<label className="label flex flex-col">
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
			<span className="block mb-2 label-text">Choose profile photo</span>
		</label>
	);
};

export default UpdateImageForm;
