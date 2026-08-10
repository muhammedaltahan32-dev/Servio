import React from "react";

import { ApiService } from "./services/ApiService.js";
import axios from "axios";
export const App = () => {
	const [isLoading, setLoading] = React.useState(false);
	const isFetchedRef = React.useRef(null);
	React.useEffect(() => {
		if (isFetchedRef.current) return;
		isFetchedRef.current = (async () => {
			const response = await ApiService.post("signin", {
				name: "admin",
				password: "admin",
			});
			if (response) {
				localStorage.setItem("token", response.token);
			}
		})();
	}, []);

	return <div className="app">{isLoading && "...loading"}</div>;
};

export default App;
