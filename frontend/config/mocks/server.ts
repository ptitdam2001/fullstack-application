import { worker } from "./browser";

export default async () => {
	if (import.meta.env.DEV) {
		await worker.start();
	}
  return worker;
};
