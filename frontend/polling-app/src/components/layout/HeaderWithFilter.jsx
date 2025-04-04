import React, { useState } from "react";
import { IoCloseOutline, IoFilterOutline } from "react-icons/io5";
import { POLL_TYPE } from "../../utils/data";

const HeaderWithFilter = ({ title, filterType, setFilterType }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="sm:text-xl font-medium text-black">{title}</h2>

        <button
          className={`flex items-center gap-3 text-sm text-white bg-primary px-4 py-2 
            ${  open ? "rounded-t-lg" : "rounded-lg"
          }`}
          onClick={() => {
            if (filterType !== "") {
              setFilterType(""); 
            } else {
              setOpen(!open); 
            }
          }}
        >
          {filterType !== "" ? (
            <>
              <IoCloseOutline className="text-lg" />
              Clear
            </>
          ) : (
            <>
              <IoFilterOutline className="text-lg" />
              Filter
            </>
          )}
        </button>
      </div>

      {open && (
        <div className="flex flex-wrap gap-3 bg-primary p-4 rounded-l-lg rounded-b-lg">
          {[{ label: "All", value: "" }, ...POLL_TYPE].map((type) => (
            <button
              key={type.value}
              className={`text-[12px] py-1 px-4 rounded-lg text-nowrap ${
                filterType === type.value
                  ? "text-white bg-sky-900"
                  : "text-[13px] bg-sky-100"
              }`}
              onClick={() => {
                setFilterType(type.value);
                setOpen(true);
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeaderWithFilter;
