import { API } from "./index";

export const BatchDetails = (data: string | undefined) =>
  API.post(`batches/batchitems/${data}`, null);
