export const IDLE_TIMEOUT = 30 * 1000;
const BACKEND_API_URL = 'https://random-data-api.com/api/coffee/random_coffee';

export type Coffee = {
	id: number;
	uid: string;
	blend_name: string;
	origin: string;
	variety: string;
	notes: string;
	intensifier: string;
};

export async function fetchCoffee() {
	const resp = await fetch(BACKEND_API_URL);
	if (!resp.ok) {
		throw new Error(await resp.text());
	}
	const json = await resp.json();
	// in the realworld app here should be parsing with zod
	// or some openapi generated client, etc..
	// so we donsent need to dangerosly cast types with 'as'
	// typescript types not exist after transpilation to js
	// so if backend returns not Coffee here we could get
	// some hard to find runtime errors
	return json as Coffee;
}
