import { constants as fsConstants } from "node:fs";
import { access } from "node:fs/promises";
import process from "node:process";

const CHROMIUM_SOCKET_SUFFIX_BUDGET = 48;
const UNIX_SOCKET_BUDGET = 100;

export async function configureBrowserTempEnvironment(env = process.env) {
  const explicit = env.ORDIVON_WEB_BROWSER_TMPDIR;
  const ambient = explicit || env.TMPDIR || env.TMP || env.TEMP || "/tmp";
  const tempRoot = Buffer.byteLength(ambient) + CHROMIUM_SOCKET_SUFFIX_BUDGET <= UNIX_SOCKET_BUDGET
    ? ambient
    : "/tmp";

  if (tempRoot === "/tmp") {
    await access("/tmp", fsConstants.W_OK).catch(() => {
      throw new Error(
        `browser temporary root is too long for Chromium Unix sockets (${ambient}); ` +
          "set ORDIVON_WEB_BROWSER_TMPDIR to a short writable path",
      );
    });
  }

  env.TMPDIR = tempRoot;
  env.TMP = tempRoot;
  env.TEMP = tempRoot;
  return tempRoot;
}
