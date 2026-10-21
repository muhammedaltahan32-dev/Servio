import React from "react";

export const ActionsBarContext = React.createContext({});
export const useActionsBar = () => React.useContext(ActionsBarContext);
