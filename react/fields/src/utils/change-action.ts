// import { flushSync } from "react-dom";

export function changeAction<T extends Function>(callback: T) {
	return callback;
	// return (...args: any[]) => {
	// 	flushSync(() => {
	// 		callback(...args);
	// 	});
	// };
}
