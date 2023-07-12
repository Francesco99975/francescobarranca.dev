import { Vitals } from "../../interfaces/vitals";

export default defineEventHandler(async (event) => {
  const data = await readBody<Vitals>(event);

  console.log(data);

  return data;
});
