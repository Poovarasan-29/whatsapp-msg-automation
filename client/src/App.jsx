import React, { useState } from "react";
import ExcelUploader from "./components/ExcelUploader";
import Messages from "./components/Messages";
import ContactLimit from "./components/ContactLimit";
import { FileContext, CheckedMessagesContext } from "./context";

const App = () => {
  const [filePayload, setFilePayload] = useState({ file: null, jsonData: [] }); // Initialize jsonData as array
  const [checkedMessages, setCheckedMessages] = useState(new Set());
  const [isCheckPassed, setIsCheckPassed] = useState(false);

  return (
    <CheckedMessagesContext.Provider value={{ checkedMessages, setCheckedMessages }}>
      <FileContext.Provider value={{ filePayload, setFilePayload }}>
        <div className="flex flex-col items-center p-5 w-full max-w-2xl mx-auto">
          <ExcelUploader />
          {/* ✅ FIX: No longer need to pass setIsCheckPassed here */}
          <Messages />
          <ContactLimit setIsCheckPassed={setIsCheckPassed} isCheckPassed={isCheckPassed} />
        </div>
      </FileContext.Provider>
    </CheckedMessagesContext.Provider>
  );
};

export default App;
