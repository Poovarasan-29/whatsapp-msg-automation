import React, { useContext, useState } from "react";
import { CheckedMessagesContext, FileContext } from "../context";
import axios from "axios";

// Helper function to create a delay with async/await
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const SendToWhatsapp = ({ handleCheckStartEnd, start, end }) => {
    const { checkedMessages } = useContext(CheckedMessagesContext);
    const { filePayload } = useContext(FileContext);

    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState("");
    // ✅ NEW: State to store a log of sent messages
    const [sentLog, setSentLog] = useState([]);

    async function handleMessageSend() {
        if (!handleCheckStartEnd()) return;

        if (!filePayload || !filePayload.jsonData) {
            alert("File data not found. Please upload a file again.");
            return;
        }

        const messageCount = checkedMessages.size ?? checkedMessages.length;
        if (messageCount === 0) {
            alert("Select at least one message");
            return;
        }

        setIsSending(true);
        setSendStatus("Starting process...");
        setSentLog([]); // ✅ NEW: Clear log on new run

        const messagesArray = [...checkedMessages];
        const slicedData = filePayload.jsonData.slice(start - 1, end ? parseInt(end) : undefined);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < slicedData.length; i++) {
            const item = slicedData[i];
            const number = item.PhoneNumber;

            if (!number) {
                console.warn(`Skipping row ${parseInt(start) + i} due to missing phone number.`);
                failCount++;
                continue;
            }

            const message = messagesArray[Math.floor(Math.random() * messagesArray.length)];
            
            setSendStatus(`Sending ${i + 1} of ${slicedData.length} to ${number}...`);

            try {
                await axios.post("http://localhost:3000/send-message", { number: String(number), message });
                console.log(`Successfully sent to ${number}`);
                successCount++;
                // ✅ NEW: Add successfully sent message to the log
                setSentLog(prevLog => [...prevLog, { number, message }]);
            } catch (err) {
                console.error(`Failed to send to ${number}:`, err.response?.data?.error || err.message);
                failCount++;
            }

            if (i < slicedData.length - 1) {
                const randomDelay = Math.floor(Math.random() * 8000) + 4000;
                setSendStatus(`Waiting for ${Math.round(randomDelay / 1000)}s...`);
                await delay(randomDelay);
            }
        }

        setSendStatus(`Process complete! Sent: ${successCount}, Failed: ${failCount}`);
        setIsSending(false);
    }

    return (
        <div className="mt-5 w-full">
            <button
                className={`w-full p-3 rounded text-white font-bold text-lg ${isSending ? "bg-gray-500 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"}`}
                onClick={handleMessageSend}
                disabled={isSending}
            >
                {isSending ? "Sending In Progress..." : "Send to Whatsapp"}
            </button>
            
            {sendStatus && <p className="text-center mt-2 text-sm text-gray-700">{sendStatus}</p>}

            {/* ✅ NEW: Section to display the log of sent messages */}
            {sentLog.length > 0 && (
                <div className="mt-4 border p-3 rounded-lg bg-gray-50 w-full">
                    <h3 className="font-bold text-center mb-2">Sent Messages Log</h3>
                    <div className="max-h-60 overflow-y-auto text-sm">
                        {sentLog.map((log, index) => (
                            <div key={index} className="p-2 border-b">
                                <p><span className="font-semibold">To:</span> {log.number}</p>
                                <p><span className="font-semibold">Message:</span> "{log.message}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SendToWhatsapp;

