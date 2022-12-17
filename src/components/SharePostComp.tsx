import React from "react";

interface Props {
  onSelect: (id: string) => void;
  content: string;
  authorName: string | null;
  groupName: string;
  title: string;
  id: string;
  createdAt: Date;
  groupId: string;
  authorImage?: string | null;
}

function SharePostComp({ onSelect, ...post }: Props) {
  return (
    <div className="flex items-center p-2 border-y-2 border-accent">
      <input className="m-3 checkbox checkbox-primary" type="checkbox" onChange={() => onSelect(post.id)} />
      <div className="p-2 rounded-md bg-neutral text-neutral-content w-full">
        <p className="text-sm truncate">{post.content}</p>
        <p className="text-xs italic">{post.authorName || "Anonymous"}</p>
      </div>
    </div>
  );
}

export default SharePostComp;

SharePostComp.Skeleton = function SharePostCompSkeleton() {
  return (
    <div className="flex items-center p-2 border-y-2  animate-pulse">
      <input className="m-3" type="checkbox" />
      <div className="p-2 rounded-md bg-blue-700 bg-opacity-50 backdrop-filter backdrop-blur-md w-full">
        <p className="text-sm truncate" />
        <p className="text-xs text-gray-500" />
      </div>
    </div>
  );
};
