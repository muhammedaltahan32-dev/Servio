import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import ThemeProvider from "./Provider/ThemeProvider.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<ThemeProvider>
				<RouterProvider router={router} />
			</ThemeProvider>
		</Provider>
	</StrictMode>,
);
