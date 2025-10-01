import { createContext } from "react";
const FileContext = createContext({ file: null, jsonData: null })
const CheckedMessagesContext = createContext(new Set())


export { FileContext, CheckedMessagesContext }