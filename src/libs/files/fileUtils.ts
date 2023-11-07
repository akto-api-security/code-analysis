import fs from 'fs'
import path from 'path'

// Function to read files recursively in a directory
export function readFilesRecursively(dir: string): string[] {
  const files = fs.readdirSync(dir);
  const fileArray = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // If it's a directory, recursively call the function
      fileArray.push(...readFilesRecursively(filePath));
    } else {
      // If it's a file, add its path to the array
      fileArray.push(filePath);
    }
  }

  return fileArray;
}

// Function to read the contents of a file
export function readFileContents(
  filePath: string, 
  success: (fileContent: string) => void, 
  err: (errStr: string) => void
) {
    fs.readFile(filePath, 'utf8', (errException, data) => {
      if (errException) {
        err(errException.message);
      } else {
        success(data);
      }
    });
}

export function getFileExtension(filePath: string) {
  return path.extname(filePath).slice(1); // Remove the leading dot (.)
}


