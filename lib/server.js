import { createServer } from "node:http";

const hostname = "127.0.0.1";
const port = 0;

export class Server {
  #server;

  constructor(handler) {
    this.#server = createServer(async (req, res) => {
      res.setHeader("Content-Type", "application/json");
      const result = await handler(req, res);
      res.end(JSON.stringify(result));
    });
  }

  async start() {
    return new Promise((resolve, reject) => {
      this.#server.listen(port, hostname, () => {
        const { port } = this.#server.address();
        console.log(`Server running at http://${hostname}:${port}`);
        resolve({ port, hostname });
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
