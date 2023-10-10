if (process.env.NODE_ENV === "development") {
	const esbuild = new EventSource("/esbuild");
	let isOpen = true;

	esbuild.addEventListener("open", (_e) => {
		if (isOpen) {
			return;
		}
		location.reload();
	});

	esbuild.addEventListener("error", (_e) => {
		isOpen = false;
	});

	esbuild.addEventListener("change", (e) => {
		const { added, removed, updated } = JSON.parse(e.data);

		if (!added.length && !removed.length && updated.length > 0) {
			for (const link of document.getElementsByTagName("link") as any) {
				for (const updatedItem of updated) {
					if (/\.map$/.test(updatedItem)) {
						continue;
					}

					const url = new URL(link.href);

					if (url.host === location.host && url.pathname === updatedItem) {
						const next = link.cloneNode();
						next.href = updatedItem + "?" + Math.random().toString(36).slice(2);
						next.onload = () => link.remove();
						link.parentNode.insertBefore(next, link.nextSibling);
						return;
					}
				}
			}
		}

		location.reload();
	});
}
