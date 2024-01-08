import autocannon from "autocannon";

export const loadTest = async ({ url }) => {
  const result = await autocannon({ url });
  return autocannon.printResult(result);
};
