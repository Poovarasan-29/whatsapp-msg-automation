import React, { useContext } from "react";
import { FileContext } from "../context";
import xlsxToJson from "../readExcel";

const ExcelUploader = () => {
  const { filePayload, setFilePayload } = useContext(FileContext);

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const xlsx_to_json = await xlsxToJson(selectedFile);
      setFilePayload({ file: selectedFile, jsonData: xlsx_to_json });
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-2xl font-bold">Upload the Excel file</h1>
      <p className="bg-red-200 px-2 py-1 text-sm rounded">
        Keep the first row empty and put all phone numbers in the first column
      </p>

      <input
        type="file"
        id="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileUpload}
      />
      <label
        htmlFor="file"
        className="border px-4 py-2 rounded cursor-pointer bg-amber-300 hover:bg-amber-400 transition"
        title={filePayload.file ? "Click to replace file" : ""}
      >
        {filePayload.file ? "Replace File" : "Choose File"}
      </label>

      {filePayload.file && (
        <p className="text-lg">
          <span className="font-bold">File Name:</span> {filePayload.file.name}
        </p>
      )}
    </div>
  );
};

export default ExcelUploader;
