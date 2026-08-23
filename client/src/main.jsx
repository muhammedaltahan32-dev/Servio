import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import ThemeProvider from "./Provider/ThemeProvider.jsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index.jsx";
import LanguagesProvider from "./Provider/LanguagesProvider.jsx";
import UIAppLoader from "./Provider/UIAppLoader.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<UIAppLoader>
				<ThemeProvider>
					<LanguagesProvider>
						<RouterProvider router={router} />
					</LanguagesProvider>
				</ThemeProvider>
			</UIAppLoader>
		</Provider>
	</StrictMode>,
);
