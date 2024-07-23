import process from "node:process";
import runNpmScript from "./tools/npmScriptRunner.ts";

const scriptName = process.argv[2] || "";

try {
  const isLongRunning = await runNpmScript(scriptName);
  if (!isLongRunning) {
    process.exit(0);
  }
} catch (e) {
  printError(e);
  process.exit(1);
}

function printError(error: unknown): void {
  if (error === undefined) {
    return;
  }

  if (!(error instanceof Error)) {
    let str = "";

    if (error === null) {
      str = "(null)";
    } else if (typeof error === "string") {
      str = error;
    } else {
      str = JSON.stringify(error);
    }

    console.error(str);
    return;
  }

  const title = `${error.name}: ${error.message}`;
  console.error(`\x1b[0m${title}\x1b[0m`);

  if (error.stack) {
    const restStack = error.stack.startsWith(title) ? error.stack.substring(title.length + 1) : error.stack;
    console.error(`Error stack:\n${restStack}`);
  }

  if (error.cause !== undefined) {
    console.error("Caused by:");
    printError(error.cause);
  }
}
