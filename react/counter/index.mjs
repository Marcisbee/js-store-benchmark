/**
 * @param {HTMLElement} target
 */
export default async function run(target) {
	for (let i = 0; i < 1000; i++) {
		const h1 = target.querySelector("h1");
		const elementReactPromise = elementUpdatedTo(target, i + 1);

		h1.click();

		await elementReactPromise;
	}
}

async function elementUpdatedTo(target, targetValue) {
	function isValid() {
		// rome-ignore lint/suspicious/noDoubleEquals: <explanation>
		return target.querySelector("h1")?.innerText == targetValue;
	}

	return new Promise((resolve, reject) => {
		if (isValid()) {
			resolve();
			return;
		}

		new MutationObserver((mutationRecords, observer) => {
			if (!isValid()) {
				return;
			}

			observer.disconnect();
			resolve();
		}).observe(target, {
			characterData: true,
			attributes: false,
			childList: false,
			subtree: true,
		});
	});
}
