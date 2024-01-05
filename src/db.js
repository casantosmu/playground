import pg from "pg";

export const client = new pg.Client(process.env.PG_URI);

export const batchInsert = async ({ tableName, columns, values }) => {
  const query = `
    INSERT INTO ${tableName}(${columns.join(", ")})
    VALUES ${values
      .map(
        (value, valueIndex) =>
          `(${value
            .map(
              (_, paramIndex) =>
                `$${value.length * valueIndex + paramIndex + 1}`
            )
            .join(", ")})`
      )
      .join(", ")};
  `;

  await client.query(query, values.flat());
};

export const transaction = async (callback) => {
  try {
    await client.query("BEGIN");
    await callback();
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
};
