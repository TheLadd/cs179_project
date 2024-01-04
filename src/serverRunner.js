const { execSync } = require("child_process");
const isWindows = process.platform === "win32";

try {
  // Try running with python3
  execSync("python3 server/app.py", { stdio: "inherit" });
} catch (error) {
  if (isWindows) {
    // If on Windows, try running with python
    try {
      execSync("python server/app.py", { stdio: "inherit" });
    } catch (error) {
      console.error("Error running server:", error);
      process.exit(1);
    }
  } else {
    console.error("Error running server:", error);
    process.exit(1);
  }
}
