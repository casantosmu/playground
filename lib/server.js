import { createServer } from "node:http";

export class Server {
  #server;

  constructor(handler) {
    this.#server = createServer(async (req, res) => {
      res.setHeader("Content-Type", "application/json");
      const result = await handler(req, res);
      res.end(JSON.stringify(result));
    });
  }

  async start({ port = 0, address = "127.0.0.1" } = {}) {
    return new Promise((resolve, reject) => {
      this.#server.listen(port, address, () => {
        const { port, address } = this.#server.address();
        console.log(`Server running at http://${address}:${port}`);
        resolve({ port, address });
      });
      this.#server.once("error", reject);
    });
  }

  async stop() {
    return new Promise((resolve, reject) => {
      this.#server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }
}
