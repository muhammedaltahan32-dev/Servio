import React from "react";

export const MenuContext = React.createContext({});
export const MenuContextRefs = React.createContext({});
export const useMenu = () => React.useContext(MenuContext);
export const useMenuRefs = () => React.useContext(MenuContextRefs);