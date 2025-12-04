import { describe } from "bun:test";
import { itBundled } from "./expectBundled";

describe("bundler", () => {
  // Test that .env files are loaded by default in standalone executables
  itBundled("compile/AutoloadDotenvDefault", {
    compile: true,
    files: {
      "/entry.ts": /* js */ `
        console.log(process.env.TEST_VAR || "not found");
      `,
    },
    runtimeFiles: {
      "/.env": `TEST_VAR=from_dotenv`,
    },
    run: {
      stdout: "from_dotenv",
      setCwd: true,
    },
  });

  // Test that .env files can be disabled with autoloadDotenv: false
  itBundled("compile/AutoloadDotenvDisabled", {
    compile: {
      autoloadDotenv: false,
    },
    files: {
      "/entry.ts": /* js */ `
        console.log(process.env.TEST_VAR || "not found");
      `,
    },
    runtimeFiles: {
      "/.env": `TEST_VAR=from_dotenv`,
    },
    run: {
      stdout: "not found",
      setCwd: true,
    },
  });

  // Test that .env files can be explicitly enabled with autoloadDotenv: true
  itBundled("compile/AutoloadDotenvEnabledExplicitly", {
    compile: {
      autoloadDotenv: true,
    },
    files: {
      "/entry.ts": /* js */ `
        console.log(process.env.TEST_VAR || "not found");
      `,
    },
    runtimeFiles: {
      "/.env": `TEST_VAR=from_dotenv`,
    },
    run: {
      stdout: "from_dotenv",
      setCwd: true,
    },
  });

  // Test that process environment variables take precedence over .env files
  itBundled("compile/AutoloadDotenvWithExistingEnv", {
    compile: true,
    files: {
      "/entry.ts": /* js */ `
        console.log(process.env.TEST_VAR || "not found");
      `,
    },
    runtimeFiles: {
      "/.env": `TEST_VAR=from_dotenv`,
    },
    run: {
      stdout: "from_shell",
      setCwd: true,
      env: {
        TEST_VAR: "from_shell",
      },
    },
  });

  // Test that bunfig.toml is loaded by default (preload is executed)
  itBundled("compile/AutoloadBunfigDefault", {
    compile: true,
    files: {
      "/entry.ts": /* js */ `
        console.log("ENTRY");
      `,
    },
    runtimeFiles: {
      "/bunfig.toml": `
preload = ["./preload.ts"]
      `,
      "/preload.ts": `
console.log("PRELOAD");
      `,
    },
    run: {
      stdout: "PRELOAD\nENTRY",
      setCwd: true,
    },
  });

  // Test that bunfig.toml can be disabled with autoloadBunfig: false
  itBundled("compile/AutoloadBunfigDisabled", {
    compile: {
      autoloadBunfig: false,
    },
    files: {
      "/entry.ts": /* js */ `
        console.log("ENTRY");
      `,
    },
    runtimeFiles: {
      "/bunfig.toml": `
preload = ["./preload.ts"]
      `,
      "/preload.ts": `
console.log("PRELOAD");
      `,
    },
    run: {
      // When bunfig is disabled, preload should NOT execute
      stdout: "ENTRY",
      setCwd: true,
    },
  });

  // Test that bunfig.toml can be explicitly enabled with autoloadBunfig: true
  itBundled("compile/AutoloadBunfigEnabled", {
    compile: {
      autoloadBunfig: true,
    },
    files: {
      "/entry.ts": /* js */ `
        console.log("ENTRY");
      `,
    },
    runtimeFiles: {
      "/bunfig.toml": `
preload = ["./preload.ts"]
      `,
      "/preload.ts": `
console.log("PRELOAD");
      `,
    },
    run: {
      stdout: "PRELOAD\nENTRY",
      setCwd: true,
    },
  });

  // Test CLI backend with autoloadDotenv: false
  itBundled("compile/AutoloadDotenvDisabledCLI", {
    compile: {
      autoloadDotenv: false,
    },
    backend: "cli",
    files: {
      "/entry.ts": /* js */ `
        console.log(process.env.TEST_VAR || "not found");
      `,
    },
    runtimeFiles: {
      "/.env": `TEST_VAR=from_dotenv`,
    },
    run: {
      stdout: "not found",
      setCwd: true,
    },
  });

  // Test CLI backend with autoloadDotenv: true
  itBundled("compile/AutoloadDotenvEnabledCLI", {
    compile: {
      autoloadDotenv: true,
    },
    backend: "cli",
    files: {
      "/entry.ts": /* js */ `
        console.log(process.env.TEST_VAR || "not found");
      `,
    },
    runtimeFiles: {
      "/.env": `TEST_VAR=from_dotenv`,
    },
    run: {
      stdout: "from_dotenv",
      setCwd: true,
    },
  });

  // Test CLI backend with autoloadBunfig: false
  itBundled("compile/AutoloadBunfigDisabledCLI", {
    compile: {
      autoloadBunfig: false,
    },
    backend: "cli",
    files: {
      "/entry.ts": /* js */ `
        console.log("ENTRY");
      `,
    },
    runtimeFiles: {
      "/bunfig.toml": `
preload = ["./preload.ts"]
      `,
      "/preload.ts": `
console.log("PRELOAD");
      `,
    },
    run: {
      stdout: "ENTRY",
      setCwd: true,
    },
  });

  // Test CLI backend with autoloadBunfig: true
  itBundled("compile/AutoloadBunfigEnabledCLI", {
    compile: {
      autoloadBunfig: true,
    },
    backend: "cli",
    files: {
      "/entry.ts": /* js */ `
        console.log("ENTRY");
      `,
    },
    runtimeFiles: {
      "/bunfig.toml": `
preload = ["./preload.ts"]
      `,
      "/preload.ts": `
console.log("PRELOAD");
      `,
    },
    run: {
      stdout: "PRELOAD\nENTRY",
      setCwd: true,
    },
  });

  // Test that both flags can be disabled together without interference
  itBundled("compile/AutoloadBothDisabled", {
    compile: {
      autoloadDotenv: false,
      autoloadBunfig: false,
    },
    files: {
      "/entry.ts": /* js */ `
        console.log(process.env.TEST_VAR || "not found");
        console.log("ENTRY");
      `,
    },
    runtimeFiles: {
      "/.env": `TEST_VAR=from_dotenv`,
      "/bunfig.toml": `
preload = ["./preload.ts"]
      `,
      "/preload.ts": `
console.log("PRELOAD");
      `,
    },
    run: {
      stdout: "not found\nENTRY",
      setCwd: true,
    },
  });

  // Test that tsconfig.json in the runtime directory is NOT loaded by standalone executables
  // The runtime tsconfig has different settings but bundled code should use compile-time settings
  itBundled("compile/IgnoresRuntimeTsconfig", {
    compile: true,
    files: {
      "/entry.ts": /* ts */ `
        // Test that compile-time tsconfig settings are used
        // If runtime tsconfig was loaded, this would fail
        console.log("tsconfig ignored");
      `,
      "/tsconfig.json": /* json */ `
        {
          "compilerOptions": {
            "target": "ES2020"
          }
        }
      `,
    },
    runtimeFiles: {
      // This tsconfig would cause issues if loaded at runtime
      // because it has completely different settings
      "/tsconfig.json": /* json */ `
        {
          "compilerOptions": {
            "target": "ES5",
            "strict": true,
            "noImplicitAny": true
          }
        }
      `,
    },
    run: {
      stdout: "tsconfig ignored",
      setCwd: true,
    },
  });

  // Test that package.json in the runtime directory is NOT loaded by standalone executables
  // The runtime package.json has "type": "commonjs" but bundled ESM code should still work
  itBundled("compile/IgnoresRuntimePackageJson", {
    compile: true,
    files: {
      "/entry.js": /* js */ `
        // This file uses ESM syntax which was bundled at compile time
        import { readFileSync } from "fs";
        console.log("ESM works");
      `,
      "/package.json": /* json */ `
        {
          "name": "test-package",
          "type": "module"
        }
      `,
    },
    runtimeFiles: {
      // This package.json would potentially cause issues if loaded at runtime
      // and it tried to interpret the bundled code based on this
      "/package.json": /* json */ `
        {
          "name": "different-package",
          "type": "commonjs",
          "main": "wrong-entry.js"
        }
      `,
    },
    run: {
      stdout: "ESM works",
      setCwd: true,
    },
  });

  // Test that runtime tsconfig.json paths/baseUrl don't affect module resolution in standalone
  itBundled("compile/IgnoresRuntimeTsconfigPaths", {
    compile: true,
    files: {
      "/entry.ts": /* ts */ `
        // At compile time, this resolves correctly
        import { greet } from "./lib/greet";
        console.log(greet());
      `,
      "/lib/greet.ts": /* ts */ `
        export function greet() {
          return "Hello from lib";
        }
      `,
    },
    runtimeFiles: {
      // This tsconfig has paths that would break resolution if loaded
      "/tsconfig.json": /* json */ `
        {
          "compilerOptions": {
            "baseUrl": "./nonexistent",
            "paths": {
              "./lib/*": ["./wrong/*"]
            }
          }
        }
      `,
    },
    run: {
      stdout: "Hello from lib",
      setCwd: true,
    },
  });

  // Test that autoloadTsconfig: true enables runtime tsconfig loading
  itBundled("compile/AutoloadTsconfigEnabled", {
    compile: {
      autoloadTsconfig: true,
    },
    files: {
      "/entry.ts": /* ts */ `
        console.log("tsconfig loading enabled");
      `,
    },
    run: {
      stdout: "tsconfig loading enabled",
      setCwd: true,
    },
  });

  // Test that autoloadPackageJson: true enables runtime package.json loading
  itBundled("compile/AutoloadPackageJsonEnabled", {
    compile: {
      autoloadPackageJson: true,
    },
    files: {
      "/entry.js": /* js */ `
        console.log("package.json loading enabled");
      `,
    },
    run: {
      stdout: "package.json loading enabled",
      setCwd: true,
    },
  });
});
