import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Yo monto la app en el div #root.
createRoot(document.getElementById("root")!).render(<App />);
