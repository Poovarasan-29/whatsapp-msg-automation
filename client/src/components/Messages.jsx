import React, { useState, useContext } from "react";
import { CheckedMessagesContext } from "../context";

const Messages = () => {
  // Removed setIsCheckPassed from props
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const { setCheckedMessages } = useContext(CheckedMessagesContext);

  const handleCheckBoxSelection = (e) => {
    const value = e.target.value;
    setCheckedMessages((prev) => {
      const newSet = new Set(prev);
      e.target.checked ? newSet.add(value) : newSet.delete(value);
      return newSet;
    });
    // ✅ FIX: The line that set isCheckPassed to false has been removed.
  };

  const handleAddBtnForNewMsg = () => {
    if (newMsg.trim()) {
      setMessages((prev) => [...prev, newMsg]);
    }
    setNewMsg("");
  };

  return (
    <div className="mt-5 w-full">
      <h2 className="text-xl font-bold mb-2">Select Messages</h2>
      {messages.map((msg, index) => (
        <label key={index} className="flex items-center gap-2">
          <input
            type="checkbox"
            value={msg}
            className="w-5 h-5"
            onChange={handleCheckBoxSelection}
          />
          {msg}
        </label>
      ))}

      <div className="flex items-center gap-3 mt-3">
        <textarea
          placeholder="Enter new message"
          className="border p-2 w-full"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button
          className="border p-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleAddBtnForNewMsg}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Messages;
