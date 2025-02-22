import { execSync, spawn } from "child_process";
import { base64Decode } from "./base64.js";
import { fetchData } from "./fetch_config.js";
import { selectFast } from "./select_fast_channel.js";

try {
  execSync(
    "ps -aux | grep sslocal | grep -v grep | awk '{print $2}' | xargs kill"
  );
} catch (e) {}

try {
  const url = process.env["LADDER_URL"];
  const port = parseInt(process.env["LADDER_PORT"]);
  const data = base64Decode(await fetchData(url));
  console.log(data);
  const ssServer = await selectFast(
    port + 1,
    data.split("\r\n").filter((l) => l.length != 0)
  );
  if (ssServer == undefined) {
    console.error("cannot find avaliable ss server");
    process.exit(1);
  }
  const readableServer = decodeURIComponent(ssServer);
  const serverName = readableServer.slice(readableServer.lastIndexOf("#"));
  console.log("==============================");
  console.log(`===== select ${serverName}`);
  console.log("==============================");
  spawn(
    `nohup sslocal -v -b 0.0.0.0:${port} --server-url ${ssServer} > /home/caicongcong/dev/ladder/log 2>&1 &`,
    { shell: true },
    {
      stdio: ["inherit", "inherit", "inherit"],
    }
  );
} catch (error) {
  console.error("Error fetching data:", error);
  process.exit(1);
}
