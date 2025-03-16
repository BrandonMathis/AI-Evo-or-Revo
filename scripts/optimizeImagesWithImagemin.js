/**
 * Image Optimization Script
 *
 * This script optimizes images in the public/images directory and saves them to public/images-optimized.
 * It maintains the original directory structure and file formats while reducing file sizes.
 *
 * Supported formats:
 * - JPEG: Optimized with mozjpeg (quality 80, progressive)
 * - PNG: Optimized with pngquant (quality 65-80%)
 * - GIF: Optimized with gifsicle (optimization level 3)
 * - SVG: Optimized with svgo (preserving viewBox and IDs)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import imageminPngquant from "imagemin-pngquant";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminSvgo from "imagemin-svgo";
import imageminGifsicle from "imagemin-gifsicle";

// Configuration
const CONFIG = {
  jpeg: {
    quality: 80,
    progressive: true,
  },
  png: {
    quality: [0.65, 0.8],
    speed: 1,
  },
  gif: {
    optimizationLevel: 3,
    interlaced: true,
  },
  svg: {
    plugins: [
      { name: "removeViewBox", active: false },
      { name: "cleanupIDs", active: false },
    ],
  },
};

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and destination directories
const imagesDir = path.join(__dirname, "..", "public", "images");
const optimizedDir = path.join(__dirname, "..", "public", "images-optimized");

/**
 * Recursively deletes a directory and its contents
 * @param {string} dirPath - Path to the directory to delete
 */
function deleteFolderRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // Recursive call for directories
        deleteFolderRecursive(curPath);
      } else {
        // Delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

/**
 * Gets all subdirectories in a directory
 * @param {string} srcPath - Path to search for subdirectories
 * @returns {string[]} - Array of subdirectory paths
 */
function getDirectories(srcPath) {
  return fs
    .readdirSync(srcPath)
    .filter((file) => fs.statSync(path.join(srcPath, file)).isDirectory())
    .map((dir) => path.join(srcPath, dir));
}

/**
 * Recursively gets all subdirectories
 * @param {string} srcPath - Path to start the search
 * @returns {string[]} - Array of all directory paths
 */
function getAllDirectories(srcPath) {
  const dirs = [srcPath];
  const subdirs = getDirectories(srcPath);

  for (const subdir of subdirs) {
    dirs.push(...getAllDirectories(subdir));
  }

  return dirs;
}

/**
 * Optimizes a JPEG image
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<Buffer>} - Optimized image buffer
 */
async function optimizeJpeg(buffer) {
  return await imageminMozjpeg(CONFIG.jpeg)(buffer);
}

/**
 * Optimizes a PNG image
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<Buffer>} - Optimized image buffer
 */
async function optimizePng(buffer) {
  return await imageminPngquant(CONFIG.png)(buffer);
}

/**
 * Optimizes a GIF image
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<Buffer>} - Optimized image buffer
 */
async function optimizeGif(buffer) {
  return await imageminGifsicle(CONFIG.gif)(buffer);
}

/**
 * Optimizes an SVG image
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<Buffer>} - Optimized image buffer
 */
async function optimizeSvg(buffer) {
  return await imageminSvgo({ plugins: CONFIG.svg.plugins })(buffer);
}

/**
 * Processes a single image file
 * @param {string} filePath - Path to the image file
 * @param {string} targetDir - Directory to save the optimized image
 * @returns {Promise<{originalSize: number, optimizedSize: number}>} - Size information
 */
async function processImage(filePath, targetDir) {
  const fileName = path.basename(filePath);
  const fileExt = path.extname(filePath).toLowerCase();
  const destPath = path.join(targetDir, fileName);

  try {
    const buffer = fs.readFileSync(filePath);
    let optimizedBuffer;

    // Process based on file extension
    if (/\.jpe?g$/i.test(fileExt)) {
      optimizedBuffer = await optimizeJpeg(buffer);
      console.log(`Optimized JPEG: ${fileName}`);
    } else if (/\.png$/i.test(fileExt)) {
      optimizedBuffer = await optimizePng(buffer);
      console.log(`Optimized PNG: ${fileName}`);
    } else if (/\.gif$/i.test(fileExt)) {
      optimizedBuffer = await optimizeGif(buffer);
      console.log(`Optimized GIF: ${fileName}`);
    } else if (/\.svg$/i.test(fileExt)) {
      optimizedBuffer = await optimizeSvg(buffer);
      console.log(`Optimized SVG: ${fileName}`);
    } else {
      // Unsupported format, just copy the file
      fs.copyFileSync(filePath, destPath);
      console.log(`Copied: ${fileName} (unsupported format)`);
      return { originalSize: buffer.length, optimizedSize: buffer.length };
    }

    // Write the optimized file
    fs.writeFileSync(destPath, optimizedBuffer);

    // Calculate size reduction
    const originalSize = buffer.length;
    const optimizedSize = optimizedBuffer.length;
    const reduction = (
      ((originalSize - optimizedSize) / originalSize) *
      100
    ).toFixed(2);

    console.log(
      `  Size reduction: ${reduction}% (${(originalSize / 1024).toFixed(
        2
      )}KB → ${(optimizedSize / 1024).toFixed(2)}KB)`
    );

    return { originalSize, optimizedSize };
  } catch (error) {
    console.error(`Error processing ${fileName}: ${error.message}`);
    return { originalSize: 0, optimizedSize: 0 };
  }
}

/**
 * Main function to process all images
 */
async function main() {
  try {
    // Clean and recreate the optimized directory
    if (fs.existsSync(optimizedDir)) {
      deleteFolderRecursive(optimizedDir);
      console.log(`Cleaned directory: ${optimizedDir}`);
    }

    // Create optimized directory
    fs.mkdirSync(optimizedDir, { recursive: true });
    console.log(`Created directory: ${optimizedDir}`);

    console.log("Starting image optimization process...");

    // Get all directories and subdirectories
    const allDirs = getAllDirectories(imagesDir);

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let totalFiles = 0;

    // Process each directory
    for (const dir of allDirs) {
      const relativePath = path.relative(imagesDir, dir);
      const targetDir = relativePath
        ? path.join(optimizedDir, relativePath)
        : optimizedDir;

      // Create target directory if it doesn't exist
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Get all files in the directory
      const files = fs
        .readdirSync(dir)
        .filter((file) => fs.statSync(path.join(dir, file)).isFile())
        .map((file) => path.join(dir, file));

      // Process each file
      for (const filePath of files) {
        const { originalSize, optimizedSize } = await processImage(
          filePath,
          targetDir
        );

        if (originalSize > 0) {
          totalOriginalSize += originalSize;
          totalOptimizedSize += optimizedSize;
          totalFiles++;
        }
      }
    }

    // Print summary
    if (totalFiles > 0) {
      const totalReduction = (
        ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) *
        100
      ).toFixed(2);

      console.log("\nOptimization Summary:");
      console.log(`  Total files processed: ${totalFiles}`);
      console.log(`  Total size reduction: ${totalReduction}%`);
      console.log(
        `  Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`
      );
      console.log(
        `  Optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`
      );
      console.log(
        `  Saved: ${(
          (totalOriginalSize - totalOptimizedSize) /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
    }

    console.log("\nImage optimization completed successfully!");
    console.log(`Optimized images are in: ${optimizedDir}`);
  } catch (error) {
    console.error("Error optimizing images:", error);
    process.exit(1);
  }
}

// Run the main function
main();
