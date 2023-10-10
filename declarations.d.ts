declare module "@js-store-benchmark/results" {
	export const results: Record<
		string,
		{
			type: string;
			name: string;
			content: () => Promise<any[]>;
		}[]
	>;
}

declare module "*.css";
