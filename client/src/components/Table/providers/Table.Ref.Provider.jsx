import React, { useRef, useMemo } from "react";
import { TableRefContext } from "../context";

const TableRefProviderComponent = ({ children }) => {
  const tableContainerRef = useRef(null);

  const value = useMemo(() => ({ tableContainerRef }), []);

  return <TableRefContext.Provider value={value}>{children}</TableRefContext.Provider>;
};

export const TableRefProvider = React.memo(TableRefProviderComponent);
