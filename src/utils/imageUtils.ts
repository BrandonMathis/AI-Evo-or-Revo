import fs from "fs";
import path from "path";

export interface SlideImage {
  path: string;
  title: string;
  parentDir: string; // Added parent directory name
}

export function getAllImages(): SlideImage[] {
  const images: SlideImage[] = [];
  const rootImagesDir = path.join(process.cwd(), "public", "images");

  // Check if the directory exists
  if (!fs.existsSync(rootImagesDir)) {
    console.warn("Images directory does not exist:", rootImagesDir);
    return [];
  }

  // Function to process a directory recursively
  function processDirectory(dirPath: string, relativePath: string = "") {
    const items = fs.readdirSync(dirPath);

    // Process all files in the current directory
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const itemStat = fs.statSync(itemPath);

      if (itemStat.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(itemPath, path.join(relativePath, item));
      } else {
        // Check if the file is an image
        const ext = path.extname(item).toLowerCase();
        if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext)) {
          // Create a title from the filename (remove extension and replace dashes/underscores with spaces)
          const title = path
            .basename(item, ext)
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word

          // Get parent directory name
          const pathParts = relativePath.split(path.sep);
          const parentDir = pathParts.length > 0 ? pathParts[0] : "Images";

          // Format parent directory name (remove numbers, capitalize)
          const formattedParentDir = parentDir
            .replace(/^\d+\s*/, "") // Remove leading numbers
            .replace(/[-_]/g, " ") // Replace dashes/underscores with spaces
            .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letter of each word

          // Add the image to our list
          images.push({
            path: `/images${relativePath ? `/${relativePath}` : ""}/${item}`,
            title: title,
            parentDir: formattedParentDir,
          });
        }
      }
    }
  }

  // Start processing from the root images directory
  try {
    processDirectory(rootImagesDir);
  } catch (error) {
    console.error("Error processing images directory:", error);
  }

  // Sort images by path for consistent ordering
  return images.sort((a, b) => a.path.localeCompare(b.path));
}
