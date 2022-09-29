import { useRouter } from "next/router";
import React from "react";

const AddPrayer = () => {
  const router = useRouter();
  const { groupId } = router.query;

  const onClick = () => {
    router.push(`/posts/create?groupId=${groupId}`);
  };

  return (
    <button
      className="flex flex-row items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      type="button"
      onClick={onClick}
    >
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      <span>Add Request</span>
    </button>
  );
};

export default AddPrayer;
