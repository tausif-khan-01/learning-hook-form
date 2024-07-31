import React from "react";

const RegSelect = ({ options, name, value, onChange, required, disabled }) => {
  return (
    <select
      name={name}
      onChange={onChange}
      value={value}
      required={required}
      className="border p-2 rounded w-full h-[41.02px]"
      disabled={disabled}
    >
      <option value="">--select--</option>
      {options?.map((option) => (
        <option key={option?.value} value={option?.value}>
          {option?.label}
        </option>
      ))}
    </select>
  );
};

export default RegSelect;
