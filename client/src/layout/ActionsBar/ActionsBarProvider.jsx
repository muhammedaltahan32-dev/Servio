import React from "react";
import { ActionsBarContext } from "./context.js";

export const ActionsBarProvider = React.memo(({ children }) => {
  const [isActionsBarOpened, setOpenActions] = React.useState(false);
  const [actionsBarContent, setActionsBarContent] = React.useState(null);
  const openActionsBar = React.useCallback(() => setOpenActions(true), []);
  const closeActionsBar = React.useCallback(() => {
    setOpenActions(false);
    setActionsBarContent(null);
  }, []);
  const memoizedValue = React.useMemo(
    () => ({
      isActionsBarOpened,
      actionsBarContent,
      setActionsBarContent,
      openActionsBar,
      closeActionsBar,
    }),
    [isActionsBarOpened, actionsBarContent, openActionsBar, closeActionsBar],
  );
  return <ActionsBarContext value={memoizedValue}>{children}</ActionsBarContext>;
});
ActionsBarProvider.displayName = "ActionsBarProvider";
export default ActionsBarProvider;
