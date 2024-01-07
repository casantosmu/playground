import pg from "pg";

class Client {
  #client;

  constructor(client) {
    this.#client = client;
  }

  async exec(string) {
    await this.#client.query(string);
  }

  async bulkInsert({ tableName, columns, records }) {
    const columnNames = Object.keys(columns);
    const columnTypes = Object.values(columns);
    const query = `
      INSERT INTO ${tableName}(${columnNames.join(",")})
      SELECT * FROM UNNEST(${columnTypes.map(
        (columnType, index) => `$${index + 1}::${columnType.toUpperCase()}[]`
      )});
    `;
    const values = columnNames.map((columnName) =>
      records.map((record) => record[columnName])
    );
    await this.#client.query(query, values);
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
