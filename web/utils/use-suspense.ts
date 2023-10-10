import { startTransition, useLayoutEffect } from "react";

const pendingPromises: Record<string, any> = {};
const fulfilledPromises: Record<string, any> = {};
const rejectedPromises: Record<string, any> = {};

export function useSuspense<Data = any>(
	promiseFactory: () => Promise<Data>,
	inputs: (string | number)[],
): Data | undefined {
	const key = String(inputs);
	const cached = fulfilledPromises[key];
	const error = rejectedPromises[key];

	if (error) {
		setTimeout(() => {
			fulfilledPromises[key] = undefined;
			rejectedPromises[key] = undefined;
			pendingPromises[key] = undefined;
		}, 100);
		throw error;
	}

	if (!fulfilledPromises[key]) {
		if (pendingPromises[key]) {
			startTransition(() => {
				throw pendingPromises[key];
			});
		}

		fulfilledPromises[key] = undefined;
		rejectedPromises[key] = undefined;
		startTransition(() => {
			throw (pendingPromises[key] ??= promiseFactory()
				.then((res) => (fulfilledPromises[key] = res))
				.catch((err) => (rejectedPromises[key] = err)));
		});
	}

	useLayoutEffect(() => {
		rejectedPromises[key] = undefined;
		pendingPromises[key] = undefined;
		return () => {
			fulfilledPromises[key] = undefined;
			rejectedPromises[key] = undefined;
			pendingPromises[key] = undefined;
		};
	}, [key]);

	if (cached) {
		return cached;
	}
}
