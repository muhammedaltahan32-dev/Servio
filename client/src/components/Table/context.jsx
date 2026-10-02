import { createContext, useContext } from "react";

export const TableDataContext = createContext(null);
export const TableColumnsContext = createContext(null);
export const TableTitleContext = createContext(null);
export const TableLoadingContext = createContext(null);
export const TableSearchContext = createContext(null);
export const TableSortContext = createContext(null);
export const TableSelectionContext = createContext(null);
export const TableSelectionActionsContext = createContext(null);
export const TableSizingContext = createContext(null);
export const TablePaginationContext = createContext(null);
export const TableFilteredDataContext = createContext(null);
export const TablePageDataContext = createContext(null);
export const TableHeaderActionsContext = createContext(null);
export const TableRowActionsContext = createContext(null);
export const TableBatchActionContext = createContext(null);
export const TableRefContext = createContext(null);

const useRequiredContext = (context, name) => {
  const value = useContext(context);
  if (!value) throw new Error(`${name} must be used within Table`);
  return value;
};

export const useTableData = () => useRequiredContext(TableDataContext, "useTableData");
export const useTableColumns = () => useRequiredContext(TableColumnsContext, "useTableColumns");
export const useTableTitle = () => useRequiredContext(TableTitleContext, "useTableTitle");
export const useTableLoading = () => useRequiredContext(TableLoadingContext, "useTableLoading");
export const useTableSearch = () => useRequiredContext(TableSearchContext, "useTableSearch");
export const useTableSort = () => useRequiredContext(TableSortContext, "useTableSort");
export const useTableSelection = () => useRequiredContext(TableSelectionContext, "useTableSelection");
export const useTableSelectionActions = () => useRequiredContext(TableSelectionActionsContext, "useTableSelectionActions");
export const useTableSizing = () => useRequiredContext(TableSizingContext, "useTableSizing");
export const useTablePagination = () => useRequiredContext(TablePaginationContext, "useTablePagination");
export const useTableFilteredData = () => useRequiredContext(TableFilteredDataContext, "useTableFilteredData");
export const useTablePageData = () => useRequiredContext(TablePageDataContext, "useTablePageData");
export const useTableHeaderActions = () => useRequiredContext(TableHeaderActionsContext, "useTableHeaderActions");
export const useTableRowActions = () => useRequiredContext(TableRowActionsContext, "useTableRowActions");
export const useTableBatchAction = () => useRequiredContext(TableBatchActionContext, "useTableBatchAction");

export const useTableRefs = () => {
  const ctx = useContext(TableRefContext);
  if (!ctx) throw new Error("useTableRefs must be used within TableRefProvider");
  return ctx;
};
