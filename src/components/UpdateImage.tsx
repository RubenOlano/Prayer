import UpdateImageForm from "./UpdateImageForm";
import { trpc } from "../utils/trpc";
import Image from "next/image.js";
import { getImage } from "../utils/defaultUserImage";

interface Props {
  id: string;
}

function UpdateImage({ id }: Props) {
  const { data } = trpc.users.getUser.useQuery({ id });

  return (
    <div className="mb-2 flex items-center align-middle justify-center">
      <div className="flex flex-col items-center justify-center ">
        <Image src={getImage(data?.image)} alt="user image" width={100} height={100} priority />
        <UpdateImageForm />
      </div>
    </div>
  );
}

UpdateImage.Skeleton = function UpdateImageSkeleton() {
  return (
    <div className="mb-2 flex items-center align-middle justify-center">
      <div className="flex flex-col items-center justify-center ">
        <Image src={getImage()} alt="user image" width={100} height={100} priority />
        <UpdateImageForm />
      </div>
    </div>
  );
};
export default UpdateImage;
