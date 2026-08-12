import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import ThemeProvider from "./Provider/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</Provider>
	</StrictMode>,
);
