"use client";

import React, { useState } from "react";
import { IconType } from "react-icons";
import { BiLockAlt, BiShow, BiHide } from "react-icons/bi";
import PhoneInput from "react-phone-input-2";

// --- Existing FloatingInput ---
interface FloatingInputProps {
  type: string;
  name: string;
  value: string;
  label: string;
  icon?: IconType;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  type,
  name,
  value,
  label,
  icon: Icon,
  required = true,
  onChange,
  onBlur,
}) => {
  return (
    <div className="relative z-0 w-full group">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder=" "
        required={required}
        className={`block w-full py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer ${Icon ? "pl-8" : ""}`}
      />
      <label
        className={`absolute capitalize text-sm text-gray-500 duration-300 transform top-2 -z-10 origin-left peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-purple-600 peer-focus:left-0 ${value ? "scale-75 -translate-y-6 left-0" : ""} peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 ${Icon ? "peer-placeholder-shown:left-8" : "peer-placeholder-shown:left-0"}`}
      >
        {label}
      </label>
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pb-1">
          <Icon className="h-4 w-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
        </div>
      )}
    </div>
  );
};

// --- Existing FloatingPasswordInput ---
interface FloatingPasswordInputProps {
  name: string;
  value: string;
  label: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const FloatingPasswordInput: React.FC<FloatingPasswordInputProps> = ({
  name,
  value,
  label,
  required = true,
  onChange,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative z-0 w-full group">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder=" "
        required={required}
        className="block w-full py-2.5 px-8 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-purple-600 peer"
      />
      <label
        className={`absolute text-sm text-gray-500 duration-300 transform top-2 -z-10 origin-left peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-purple-600 peer-focus:left-0 ${value ? "scale-75 -translate-y-6 left-0" : ""} peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:left-8`}
      >
        {label}
      </label>
      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pb-1">
        <BiLockAlt className="h-4 w-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
      </div>
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute inset-y-0 right-0 flex items-center pb-1 text-gray-400 hover:text-purple-600 transition-colors"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <BiHide className="h-5 w-5" />
        ) : (
          <BiShow className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

// --- NEW FloatingPhoneInput ---
interface FloatingPhoneInputProps {
  name: string;
  value: string;
  label: string;
  onChange: (value: string) => void;
}

export const FloatingPhoneInput: React.FC<FloatingPhoneInputProps> = ({
  value,
  label,
  onChange,
}) => {
  return (
    <div className="relative z-0 w-full group border-b-2 border-gray-300 focus-within:border-purple-600 transition-colors">
      <div className="flex items-center">
        <PhoneInput
          country={"in"}
          value={value}
          onChange={onChange}
          enableSearch={true}
          containerClass="!border-none"
          inputClass="!w-full !bg-transparent !border-none !text-sm !pl-8 !h-10 !text-gray-900 focus:!ring-0 font-sans"
          buttonClass="!bg-transparent !border-none !flex !items-center"
          dropdownClass="!bg-white !shadow-xl !rounded-lg !mt-2"
          placeholder=""
        />
      </div>

      <label
        className={`absolute text-sm duration-300 transform top-2 -z-10 origin-left
          group-focus-within:scale-75 group-focus-within:-translate-y-6 group-focus-within:text-purple-600 group-focus-within:left-0
          ${value ? "scale-75 -translate-y-6 left-0 text-purple-600" : "text-white left-8 scale-100 translate-y-0"}
        `}
      >
        {label}
      </label>
    </div>
  );
};
