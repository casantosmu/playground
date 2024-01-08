import pg from "pg";

export class Client extends pg.Client {
  constructor() {
    super(process.env.PG_URI);
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
    await this.query(query, values);
  }

  async transaction(callback) {
    try {
      await this.query("BEGIN");
      await callback(this);
      await this.query("COMMIT");
    } catch (error) {
      await this.query("ROLLBACK");
      throw error;
    }
  }
}
