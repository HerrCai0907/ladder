import { execSync, spawn } from "child_process";

export async function selectFast(port, serverUrls) {
  let ss = await Promise.all(
    serverUrls.map(async (url, i) => {
      const currentPort = port + i;
      const p = spawn(
        "sslocal",
        ["-b", `127.0.0.1:${currentPort}`, "--server-url", url],
        {
          stdio: ["inherit", "ignore", "inherit"],
        }
      );
      return new Promise((r) => {
        setTimeout(async () => {
          const start = Date.now();
          try {
            execSync(
              `curl -s --connect-timeout 1 https://www.google.com --proxy 127.0.0.1:${currentPort}`
            );
            const latency = Date.now() - start;
            console.log(`latency ${latency}ms : ${decodeURIComponent(url)}`);
            r([latency, url]);
          } catch (e) {
            console.log(`unavaliable: ${decodeURIComponent(url)}`);
            r(null);
          }
          p.kill();
        }, 2000);
      });
    })
  );

  return ss
    .filter((v) => v != null)
    .reduce(
      (p, c) => {
        return p[0] > c[0] ? c : p;
      },
      [Number.MAX_SAFE_INTEGER, null]
    )[1];
}
