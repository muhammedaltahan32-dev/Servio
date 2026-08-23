import { createContext, useContext } from "react";

export const TableStateContext = createContext(null);
export const TableFunctionContext = createContext(null);
export const TableRefContext = createContext(null);

export const useTableState = () => {
  const ctx = useContext(TableStateContext);
  if (!ctx) throw new Error("useTableState must be used within TableStateProvider");
  return ctx;
};

export const useTableFunctions = () => {
  const ctx = useContext(TableFunctionContext);
  if (!ctx) throw new Error("useTableFunctions must be used within TableFunctionProvider");
  return ctx;
};

export const useTableRefs = () => {
  const ctx = useContext(TableRefContext);
  if (!ctx) throw new Error("useTableRefs must be used within TableRefProvider");
  return ctx;
};