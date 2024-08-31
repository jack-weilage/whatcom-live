export class BaseClient {
	#urlConstructor: (endpoint: string) => URL
	#responseHandler: (res: Promise<Response>) => unknown
	#globalHeaders: Headers

	constructor(
		urlConstructor: (endpoint: string) => URL,
		responseHandler: (res: Promise<Response>) => unknown,
		additionalHeaders?: Record<string, string>,
	) {
		this.#urlConstructor = urlConstructor
		this.#responseHandler = responseHandler

		this.#globalHeaders = new Headers({
			// Always include custom User-Agent, unless it specifically needs to be overwritten.
			'User-Agent': 'whatcom.live/0.0.0',
			...additionalHeaders,
		})
	}

	getEndpoint<T>(endpoint: string, headers?: Record<string, string>) {
		const final_headers = new Headers(headers)
		for (const [key, value] of this.#globalHeaders.entries()) {
			final_headers.append(key, value)
		}

		return this.#responseHandler(
			fetch(this.#urlConstructor(endpoint), {
				// Merge global headers with the per-endpoint ones.
				headers: final_headers,
			}),
		) as Promise<T>
	}
}
