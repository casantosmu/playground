import pg from "pg";

class Client {
  #client;

  constructor(client) {
    this.#client = client;
  }

  async exec(string) {
    await this.#client.query(string);
  }

  async batchInsert({ tableName, columns, values }) {
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

    await this.#client.query(query, values.flat());
  }

  async transaction(callback) {
    try {
      await this.#client.query("BEGIN");
      await callback(this);
      await this.#client.query("COMMIT");
    } catch (error) {
      await this.#client.query("ROLLBACK");
      throw error;
    }
  }
}

export const createClient = async () => {
  const client = new pg.Client(process.env.PG_URI);
  await client.connect();
  return new Client(client);
};
