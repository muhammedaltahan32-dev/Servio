import React from "react";

export const useControlledState = (controlledValue, defaultValue) => {
	const isControlled = controlledValue !== undefined;

	const [internalState, setInternalState] = React.useState(isControlled ? controlledValue : defaultValue);

	const state = isControlled ? controlledValue : internalState;

	const setState = React.useCallback(
		(newValue) => {
			if (!isControlled) {
				setInternalState(newValue);
			}
		},
		[isControlled],
	);

	return [state, setState];
};

export default useControlledState;
