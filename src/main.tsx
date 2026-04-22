
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import Appsignal from "@appsignal/javascript";
import { plugin } from `@appsignal/plugin-window-events`;
import "./index.css";

const appsignalApiKey = import.meta.env.VITE_APPSIGNAL_API_KEY;
const tenantId = import.meta.env.VITE_TENANT_ID;

const appsignal = new Appsignal({
    key: appsignalApiKey,
});
appsignal.use(plugin()) // capture unhandled errors

createRoot(document.getElementById("root")!).render(<App />);
