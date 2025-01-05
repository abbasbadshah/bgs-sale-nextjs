"use client";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiImage,
  FiFile,
  FiFileText,
  FiMusic,
  FiVideo,
  FiChevronDown,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

const VARIANTS = {
  primary: {
    text: "text-primary-500",
    border:
      "border-primary-300 focus:ring-primary-500 focus:border-primary-500",
    checkbox: "text-primary-600 focus:ring-primary-500",
  },
  secondary: {
    text: "text-secondary-500",
    border:
      "border-secondary-300 focus:ring-secondary-500 focus:border-secondary-500",
    checkbox: "text-secondary-600 focus:ring-secondary-500",
  },
};

const FILE_TYPE_ICONS = {
  image: FiImage,
  pdf: FiFile,
  text: FiFileText,
  audio: FiMusic,
  video: FiVideo,
  default: FiFile,
};

export const Input = ({
  type = "text",
  label,
  placeholder,
  className = "",
  control,
  name,
  rules = {},
  disabled = false,
  required = false,
  icon: IconComponent = null,
  variant = "primary",
  dark = true,
  autoComplete,
  options = [],
  rows = 3, // Default rows for textarea
  maxRows = 10, // Maximum rows for textarea
  minRows = 2, // Minimum rows for textarea
  isMultiple = false, // Enable multiple rows functionality
  defaultRows = 1, // Default number of rows for multiple inputs
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [multipleRows, setMultipleRows] = useState(Array(defaultRows).fill(""));
  const [textareaHeight, setTextareaHeight] = useState(`${rows * 24}px`); // 24px is approximate line height

  const labelColorClass = dark ? "text-white" : "text-text-light";
  const variantStyles = VARIANTS[variant];

  const getFileTypeIcon = (file) => {
    if (!file) return null;
    const fileType = file.type.split("/")[0];
    const specificType = file.type.split("/")[1];
    if (specificType === "pdf") return FiFile;
    return FILE_TYPE_ICONS[fileType] || FILE_TYPE_ICONS["default"];
  };

  const handleTextareaChange = (e, onChange) => {
    const textarea = e.target;
    const currentRows = textarea.value.split("\n").length;
    const calculatedRows = Math.min(Math.max(currentRows, minRows), maxRows);
    setTextareaHeight(`${calculatedRows * 24}px`);
    onChange(e);
  };

  const addRow = () => {
    setMultipleRows([...multipleRows, ""]);
  };

  const removeRow = (index) => {
    if (multipleRows.length > 1) {
      const newRows = multipleRows.filter((_, i) => i !== index);
      setMultipleRows(newRows);
    }
  };

  const renderLabel = () => {
    if (!label || type === "checkbox" || type === "radio") return null;
    return (
      <label
        htmlFor={name}
        className={`block text-sm font-medium ${labelColorClass} mb-2 text-left`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    );
  };

  const renderIcon = () => {
    if (!IconComponent) return null;
    return (
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <IconComponent className={`h-5 w-5 ${variantStyles.text}`} />
      </div>
    );
  };

  const renderPasswordToggle = () => {
    if (type !== "password") return null;
    return (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        {showPassword ? (
          <FiEyeOff className="h-5 w-5 text-gray-400" />
        ) : (
          <FiEye className="h-5 w-5 text-gray-400" />
        )}
      </button>
    );
  };

  const renderTextarea = (field) => (
    <textarea
      {...field}
      style={{ height: textareaHeight, minHeight: `${minRows * 24}px` }}
      onChange={(e) => handleTextareaChange(e, field.onChange)}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full px-3 py-2 border rounded-md resize-none
        ${IconComponent ? "pl-10" : "pl-3"}
        ${variantStyles.border}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    />
  );

  const renderMultipleInputs = (field) => (
    <div className="space-y-2">
      {multipleRows.map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type={type}
            value={field.value[index] || ""}
            onChange={(e) => {
              const newValue = [...(field.value || multipleRows)];
              newValue[index] = e.target.value;
              field.onChange(newValue);
            }}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full h-14 px-3 border rounded-md
              ${IconComponent ? "pl-10" : "pl-3"}
              ${variantStyles.border}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          />
          <button
            type="button"
            onClick={() => removeRow(index)}
            className="p-2 text-gray-500 hover:text-red-500"
          >
            <FiMinus className="h-5 w-5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addRow}
        className="flex items-center space-x-1 text-sm text-primary-500 hover:text-primary-600"
      >
        <FiPlus className="h-4 w-4" />
        <span>Add Row</span>
      </button>
    </div>
  );

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`w-full ${className}`}>
      {renderLabel()}

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? "This field is required" : false,
          ...rules,
        }}
        defaultValue={type === "checkbox" ? false : isMultiple ? [] : ""}
        render={({ field, fieldState: { error } }) => (
          <div className="relative">
            {renderIcon()}

            {/* Textarea Input */}
            {type === "textarea" && renderTextarea(field)}

            {/* Multiple Inputs */}
            {isMultiple && renderMultipleInputs(field)}

            {/* Existing Input Types */}
            {!(type === "textarea" || isMultiple) && (
              <>
                {/* Checkbox and Radio Input */}
                {(type === "checkbox" || type === "radio") && (
                  <div className="flex items-center">
                    <input
                      {...field}
                      type={type}
                      disabled={disabled}
                      id={name}
                      className={`
                        mr-2 h-5 w-5 
                        ${variantStyles.checkbox}
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    />
                    {label && (
                      <label
                        htmlFor={name}
                        className={`text-sm ${labelColorClass} ${
                          disabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {label}{" "}
                        {required && <span className="text-red-500">*</span>}
                      </label>
                    )}
                  </div>
                )}

                {/* Select Input */}
                {type === "select" && (
                  <div className="relative">
                    <select
                      {...field}
                      disabled={disabled}
                      id={name}
                      className={`
                        w-full h-14 px-3 border rounded-md appearance-none
                        ${variantStyles.border}
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      {placeholder && (
                        <option value="" disabled>
                          {placeholder}
                        </option>
                      )}
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <FiChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                )}

                {/* File Input */}
                {type === "file" && (
                  <div className="flex items-center w-full">
                    <input
                      {...field}
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setSelectedFile(file);
                        field.onChange(e);
                      }}
                      disabled={disabled}
                      id={name}
                      className="hidden"
                    />
                    <label
                      htmlFor={name}
                      className={`
                        w-full h-14 px-3 border rounded-md flex items-center cursor-pointer bg-white
                        ${variantStyles.border}
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      {selectedFile ? (
                        <div className="flex items-center w-full">
                          {React.createElement(getFileTypeIcon(selectedFile), {
                            className: `h-6 w-6 mr-2 ${variantStyles.text}`,
                          })}
                          <span className="truncate">{selectedFile.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          {placeholder || "Choose a file"}
                        </span>
                      )}
                    </label>
                  </div>
                )}

                {/* Text, Password, and Other Input Types */}
                {!(
                  type === "checkbox" ||
                  type === "radio" ||
                  type === "file" ||
                  type === "select"
                ) && (
                  <input
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                    type={inputType}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoComplete={autoComplete}
                    className={`
                      w-full h-14 px-3 border rounded-md 
                      ${IconComponent ? "pl-10" : "pl-3"}
                      ${variantStyles.border}
                      ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                  />
                )}
              </>
            )}

            {renderPasswordToggle()}

            {/* Error Icon */}
            {error && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FiAlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
        )}
      />

      {/* Error Message */}
      <Controller
        name={name}
        control={control}
        render={({ fieldState: { error } }) =>
          error && (
            <p className="mt-1 text-sm text-red-600">
              {error.message || "This field is invalid"}
            </p>
          )
        }
      />
    </div>
  );
};

export default Input;
