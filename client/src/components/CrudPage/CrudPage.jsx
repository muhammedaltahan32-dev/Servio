import React from "react";
import ApiService from "../../services/ApiService.js";
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Paper,
	Snackbar,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";

const normalizeValue = (value, type) => {
	if (type === "number") return Number(value ?? 0);
	if (type === "boolean") return Boolean(value);
	if (type === "text") return String(value ?? "");
	return value;
};

const makeInitialForm = (fields = []) =>
	fields.reduce((acc, field) => {
		acc[field.name] = field.defaultValue ?? (field.type === "number" ? 0 : "");
		return acc;
	}, {});

const mapItemToForm = (item = {}, fields = []) =>
	fields.reduce((acc, field) => {
		acc[field.name] = field.mapValue ? field.mapValue(item[field.name], item) : (item[field.name] ?? "");
		return acc;
	}, {});

const fieldRenderer = (field, form, handleChange) => {
	const commonProps = {
		fullWidth: true,
		label: field.label,
		name: field.name,
		value: form[field.name] ?? "",
		onChange: handleChange,
		required: !!field.required,
		type: field.type || "text",
	};

	if (field.render) {
		return field.render({ ...commonProps, value: commonProps.value, form, handleChange });
	}

	return <TextField key={field.name} {...commonProps} />;
};

export const CrudPage = ({
	subApi,
	pageTitle,
	fields = [],
	columns = [],
	idField = "id",
	renderFormFields,
	allowEdit = true,
	allowDelete = true,
	onCreateSuccess,
	onUpdateSuccess,
	onDeleteSuccess,
	transformCreatePayload,
	transformReadData,
	listEmptyText = "لا توجد بيانات حالياً",
	createEndpoint,
	updateEndpoint,
	deleteEndpoint,
}) => {
	const normalizedSubApi = (subApi || "").replace(/\/+$/, "");
	const readUrl = `${normalizedSubApi}/all`;
	const createUrl = createEndpoint || normalizedSubApi;
	const updateUrl = updateEndpoint || normalizedSubApi;
	const deleteUrl = deleteEndpoint || normalizedSubApi;

	const [items, setItems] = React.useState([]);
	const [form, setForm] = React.useState(() => makeInitialForm(fields));
	const [loading, setLoading] = React.useState(false);
	const [submitting, setSubmitting] = React.useState(false);
	const [error, setError] = React.useState("");
	const [openDialog, setOpenDialog] = React.useState(false);
	const [editingId, setEditingId] = React.useState(null);
	const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });

	const listColumns = React.useMemo(() => {
		if (columns.length) return columns;
		return fields.map((field) => ({
			key: field.name,
			label: field.label || field.name,
			render: (value) => value ?? "-",
		}));
	}, [columns, fields]);

	const loadItems = React.useCallback(async () => {
		if (!readUrl) return;

		setLoading(true);
		setError("");

		try {
			const response = await ApiService.get(readUrl);
			const payload = response?.data ?? [];
			const safeData = Array.isArray(payload) ? payload : [];
			setItems(transformReadData ? safeData.map(transformReadData) : safeData);
		} catch (err) {
			setError(err?.response?.data?.error || "فشل في جلب البيانات");
		} finally {
			setLoading(false);
		}
	}, [readUrl, transformReadData]);

	React.useEffect(() => {
		const frame = window.requestAnimationFrame(() => {
			void loadItems();
		});

		return () => window.cancelAnimationFrame(frame);
	}, [loadItems]);

	const resetForm = () => {
		setForm(makeInitialForm(fields));
		setEditingId(null);
		setOpenDialog(false);
	};

	const openCreateDialog = () => {
		setEditingId(null);
		setForm(makeInitialForm(fields));
		setError("");
		setOpenDialog(true);
	};

	const openEditDialog = (item) => {
		setEditingId(item[idField]);
		setForm(mapItemToForm(item, fields));
		setError("");
		setOpenDialog(true);
	};

	const showSnackbar = (message, severity = "success") => {
		setSnackbar({ open: true, message, severity });
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		const field = fields.find((item) => item.name === name);
		const normalizedValue = field?.type === "number" ? Number(value ?? 0) : value;

		setForm((prev) => ({
			...prev,
			[name]: normalizedValue,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const requiredField = fields.find((field) => field.required && !String(form[field.name] ?? "").trim());
		if (requiredField) {
			setError(`الحقل ${requiredField.label || requiredField.name} مطلوب`);
			showSnackbar(`الحقل ${requiredField.label || requiredField.name} مطلوب`, "error");
			return;
		}

		setSubmitting(true);
		setError("");

		try {
			const payload = fields.reduce((acc, field) => {
				const value = form[field.name];
				acc[field.name] = normalizeValue(value, field.type || "text");
				return acc;
			}, {});

			const finalPayload = transformCreatePayload ? transformCreatePayload(payload) : payload;

			let response;
			if (editingId && allowEdit) {
				response = await ApiService.put(updateUrl, { ...finalPayload, [idField]: editingId });
				showSnackbar("تم تحديث البيانات بنجاح", "success");
				onUpdateSuccess?.(response);
			} else {
				response = await ApiService.post(createUrl, finalPayload);
				const createdData = response?.data ?? finalPayload;
				setItems((prev) => [createdData, ...prev]);
				showSnackbar("تمت إضافة البيانات بنجاح", "success");
				onCreateSuccess?.(response);
			}

			const createdOrUpdated = response?.data ?? response?.data?.data ?? finalPayload;
			setItems((prev) => {
				if (editingId && allowEdit) {
					return prev.map((item) => (item[idField] === editingId ? { ...item, ...createdOrUpdated } : item));
				}
				return prev;
			});

			resetForm();
		} catch (err) {
			const message = err?.response?.data?.error || "فشل في حفظ البيانات";
			setError(message);
			showSnackbar(message, "error");
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (item) => {
		if (!allowDelete) {
			const message = "حذف البيانات غير مدعّم في الـ API الحالي";
			setError(message);
			showSnackbar(message, "error");
			return;
		}

		try {
			setError("");
			await ApiService.delete(`${deleteUrl}/${item[idField]}`);
			setItems((prev) => prev.filter((current) => current[idField] !== item[idField]));
			showSnackbar("تم حذف البيانات بنجاح", "success");
			onDeleteSuccess?.(item);
		} catch (err) {
			const message = err?.response?.data?.error || "فشل في حذف البيانات";
			setError(message);
			showSnackbar(message, "error");
		}
	};

	const renderFieldList = () => {
		if (renderFormFields) {
			return renderFormFields({ form, handleChange, resetForm, editingId, submitting });
		}

		return fields.map((field) => fieldRenderer(field, form, handleChange));
	};

	return (
		<Box sx={{ display: "grid", gap: 3 }}>
			<Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" spacing={2}>
				<Typography variant="h4" fontWeight={700}>
					{pageTitle}
				</Typography>

				<Button variant="contained" onClick={openCreateDialog}>
					إضافة جديد
				</Button>
			</Stack>

			<Card>
				<CardContent>
					<Stack
						direction={{ xs: "column", sm: "row" }}
						justifyContent="space-between"
						alignItems="center"
						sx={{ mb: 2 }}
					>
						<Typography variant="h6">قائمة البيانات</Typography>
						{loading && <CircularProgress size={22} />}
					</Stack>

					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>#</TableCell>
									{listColumns.map((column) => (
										<TableCell key={column.key || column.label}>{column.label}</TableCell>
									))}
									{(allowEdit || allowDelete) && <TableCell align="right">الإجراءات</TableCell>}
								</TableRow>
							</TableHead>
							<TableBody>
								{!items.length && !loading ? (
									<TableRow>
										<TableCell colSpan={listColumns.length + 2} align="center">
											{listEmptyText}
										</TableCell>
									</TableRow>
								) : (
									items.map((item, index) => (
										<TableRow key={item[idField] ?? `${item.name ?? "item"}-${index}`} hover>
											<TableCell>{index + 1}</TableCell>

											{listColumns.map((column) => (
												<TableCell key={`${item[idField] ?? index}-${column.key || column.label}`}>
													{column.render ? column.render(item[column.key], item, index) : (item[column.key] ?? "-")}
												</TableCell>
											))}

											{(allowEdit || allowDelete) && (
												<TableCell align="right">
													<Stack direction="row" spacing={1} justifyContent="flex-end">
														{allowEdit && (
															<Button size="small" variant="outlined" onClick={() => openEditDialog(item)}>
																تعديل
															</Button>
														)}
														{allowDelete && (
															<Button size="small" color="error" variant="outlined" onClick={() => handleDelete(item)}>
																حذف
															</Button>
														)}
													</Stack>
												</TableCell>
											)}
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			</Card>

			<Dialog open={openDialog} onClose={resetForm} fullWidth maxWidth="sm">
				<DialogTitle>{editingId ? "تحديث البيانات" : "إضافة بيانات جديدة"}</DialogTitle>
				<Box component="form" onSubmit={handleSubmit}>
					<DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
						{renderFieldList()}
						{error && (
							<Alert severity="error" variant="filled">
								{error}
							</Alert>
						)}
					</DialogContent>
					<DialogActions sx={{ px: 3, pb: 2 }}>
						<Button type="button" variant="outlined" onClick={resetForm}>
							إلغاء
						</Button>
						<Button type="submit" variant="contained" disabled={submitting}>
							{submitting ? <CircularProgress size={20} color="inherit" /> : editingId ? "حفظ التحديث" : "إضافة"}
						</Button>
					</DialogActions>
				</Box>
			</Dialog>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					severity={snackbar.severity}
					variant="filled"
					onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default CrudPage;
