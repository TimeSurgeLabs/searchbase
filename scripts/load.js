const fs = require("fs");
const path = require("path");

function scrubNonUtfCharacters(str) {
  return str.replace(/[^\x00-\x7F]/g, "");
}

function processFile(filePath, callback) {
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      console.error(`Error reading file: ${filePath}`);
      return;
    }

    const scrubbedData = scrubNonUtfCharacters(data);
    try {
      await callback(filePath, scrubbedData);
    } catch (error) {
      console.error(`Error processing file: ${filePath}`, error);
    }
  });
}

async function traverseDirectory(dirPath, callback) {
  fs.readdir(dirPath, async (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${dirPath}`);
      return;
    }

    for (const file of files) {
      const filePath = path.join(dirPath, file);

      try {
        const stats = await fs.promises.stat(filePath);

        if (stats.isFile()) {
          const fileExtension = path.extname(filePath);

          if (fileExtension === ".md" || fileExtension === ".txt") {
            await processFile(filePath, callback);
          }
        } else if (stats.isDirectory()) {
          await traverseDirectory(filePath, callback);
        }
      } catch (error) {
        console.error(`Error retrieving file stats: ${filePath}`, error);
      }
    }
  });
}

// Example usage
const directoryPath = process.argv[2];
const serverURL = process.argv[3];

if (!directoryPath) {
  console.error("Please provide a directory path as an argument.");
  process.exit(1);
}

async function handleFileContent(path, fileContent) {
  const resp = await fetch(serverURL + "/api/load", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: fileContent }),
  });

  if (resp.ok) {
    console.log(`${path}: File content successfully loaded.`);
    return;
  }

  throw new Error(
    `Error loading file content: ${resp.status} ${resp.statusText}`
  );
}

traverseDirectory(directoryPath, handleFileContent).catch((error) => {
  console.error("Error traversing directory:", error);
});
