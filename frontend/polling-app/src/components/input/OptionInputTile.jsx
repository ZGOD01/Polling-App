import React from 'react';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';

const OptionInputTile = ({ isSelected, label, onSelect }) => {
    const getColors = () => {
        if (isSelected) return "text-white bg-primary border-sky-400";

        return "text-black bg-slate-200/80 border-slate-200";
    };

    return (
        <button 
            className={`w-full flex items-center gap-3 px-4 py-2 mb-2 border rounded-md ${getColors()}`} 
            onClick={onSelect} 
        >
            {isSelected ? (
                <MdRadioButtonChecked className="text-xl text-sky-500" />
            ) : (
                <MdRadioButtonUnchecked className="text-xl text-gray-500" />
            )}
            <span className="text-[15px] font-medium text-black">{label}</span>
        </button>
    );
};

export default OptionInputTile;
