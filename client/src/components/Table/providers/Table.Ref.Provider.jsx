import React, { useRef, useMemo } from "react";
import { TableRefContext } from "../context";

export const TableRefProvider = ({ children }) => {
  const tableContainerRef = useRef(null);

  const value = useMemo(() => ({ tableContainerRef }), []);

  return <TableRefContext.Provider value={value}>{children}</TableRefContext.Provider>;
};