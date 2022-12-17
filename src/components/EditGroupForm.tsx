import React from "react";

const EditGroupForm = () => {
  return (
    <div className="">
      <form className="form-control">
        <label className="label">
          <span className="label-text">Group Name</span>
        </label>
        <input type="text" placeholder="Group Name" className="input input-bordered" />
        <label className="label">
          <span className="label-text">Group Description</span>
        </label>
        <textarea placeholder="Group Description" className="textarea h-24 textarea-bordered" />
        <div className="flex justify-end mt-4">
          <button className="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditGroupForm;
