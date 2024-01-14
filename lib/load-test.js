import autocannon from "autocannon";

export const loadTest = async ({ url, verifyBody }) => {
  const result = await autocannon({ url, verifyBody });
  return autocannon.printResult(result);
};
