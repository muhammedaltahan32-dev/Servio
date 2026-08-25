import { enqueueSnackbar } from "notistack";

export const notify = {
	snackbar: {
		message: (msg) => enqueueSnackbar(msg),
		error: (msg) => enqueueSnackbar(msg, { variant: "error" }),
		success: (msg) => enqueueSnackbar(msg, { variant: "success" }),
		warning: (msg) => enqueueSnackbar(msg, { variant: "warning" }),
	},
};
