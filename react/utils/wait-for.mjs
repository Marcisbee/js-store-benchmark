// Observe committed DOM changes, with a deadline so broken targets cannot hang a run.
export function waitFor(target, predicate, description, options) {
	return new Promise((resolve, reject) => {
		if (predicate()) return resolve();
		const observer = new MutationObserver(() => {
			if (!predicate()) return;
			clearTimeout(timer);
			observer.disconnect();
			resolve();
		});
		const timer = setTimeout(() => {
			observer.disconnect();
			reject(new Error(`Timed out waiting for ${description}`));
		}, 10000);
		observer.observe(target, options);
	});
}
