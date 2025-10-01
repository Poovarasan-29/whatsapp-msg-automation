import React, { useContext, useState } from "react";
import { CheckedMessagesContext, FileContext } from "../context";
import SendToWhatsapp from "./SendToWhatsapp";

const ContactLimit = ({ isCheckPassed, setIsCheckPassed }) => {
  const { filePayload } = useContext(FileContext);
  const { checkedMessages } = useContext(CheckedMessagesContext);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  function handleCheckStartEnd() {
    if (!filePayload.file) {
      alert("Choose a file first");
      return false;
    }
    const s = parseInt(start);
    const e = end ? parseInt(end) : filePayload.jsonData?.length;

    if (isNaN(s) || s < 2) {
      alert("Invalid start row. Must be 2 or greater.");
      return false;
    }
    if (end && (isNaN(e) || e > filePayload.jsonData?.length + 1 || s > e)) {
      alert("Invalid end row.");
      return false;
    }

    setIsCheckPassed(true);
    return true;
  }
  
  // Use correct slice logic for display
  const getSlicedData = () => {
    if (!filePayload.jsonData) return [];
    // ✅ FIX: Correct 1-based to 0-based slice logic
    return filePayload.jsonData.slice(start - 1, end ? parseInt(end) : undefined);
  }

  return (
    <div className="mt-7 flex flex-col gap-3 w-full">
      <div className="bg-red-200 p-2 rounded">
        <ul className="list-disc list-inside text-sm">
          <li>Start: Required field (Row number from your file, ≥ 2)</li>
          <li>End: Optional (defaults to the last row)</li>
        </ul>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex flex-col">
          <label htmlFor="start">Start Row:</label>
          <input
            id="start"
            type="number"
            value={start}
            min="2"
            onChange={(e) => {
              setStart(e.target.value);
              setIsCheckPassed(false);
            }}
            className="border p-2 w-24"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="end">End Row:</label>
          <input
            id="end"
            type="number"
            value={end}
            min={start || 2}
            onChange={(e) => {
              setEnd(e.target.value);
              setIsCheckPassed(false);
            }}
            className="border p-2 w-24"
          />
        </div>
        <button
          className="bg-amber-300 px-4 py-2 rounded hover:bg-amber-400"
          onClick={handleCheckStartEnd}
        >
          Check
        </button>
      </div>

      {isCheckPassed && (
        <div className="border p-4 mt-4 rounded">
          <h1 className="text-lg font-bold text-center">Preview</h1>
          <h2 className="font-semibold mt-2">Phone Numbers to Send:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm max-h-40 overflow-y-auto">
            {getSlicedData().map((item, i) => (
              <p key={i}>
                ({parseInt(start) + i}) {item.PhoneNumber || 'N/A'}
              </p>
            ))}
          </div>

          <h2 className="font-semibold mt-3">Messages to Send:</h2>
          <ul className="list-disc list-inside text-sm">
            {[...checkedMessages].map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>

          <button
            className="mt-4 w-full py-2 bg-gray-300 text-black rounded"
            onClick={() => setIsCheckPassed(false)}
          >
            Close Preview
          </button>
        </div>
      )}

      <SendToWhatsapp handleCheckStartEnd={handleCheckStartEnd} start={start} end={end} />
    </div>
  );
};

export default ContactLimit;
