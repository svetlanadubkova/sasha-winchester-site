const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const config = {
  // Source directory containing images
  inputDir: './',
  
  // Directory to save compressed images
  outputDir: './compressed/',
  
  // File types to process
  imageExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
  
  // Quality of output images (1-100)
  quality: 75,
  
  // Whether to replace original files
  replaceOriginals: false
};

// Create output directory if it doesn't exist
if (!config.replaceOriginals && !fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
  console.log(`Created output directory: ${config.outputDir}`);
}

// Get all image files in the input directory
function getImageFiles(dir) {
  const files = fs.readdirSync(dir);
  
  return files.filter(file => {
    // Check if it's a file (not a directory)
    const filePath = path.join(dir, file);
    if (!fs.lstatSync(filePath).isFile()) return false;
    
    // Check if it's an image by extension
    const extension = path.extname(file).toLowerCase();
    return config.imageExtensions.includes(extension);
  });
}

// Process each image
async function compressImages() {
  const imageFiles = getImageFiles(config.inputDir);
  console.log(`Found ${imageFiles.length} images to process`);
  
  let successCount = 0;
  let errorCount = 0;
  let totalSavings = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(config.inputDir, file);
    
    // Skip processed files if in same directory
    if (file.includes('-compressed')) continue;
    
    const outputPath = config.replaceOriginals 
      ? inputPath 
      : path.join(config.outputDir, file);
    
    try {
      // Get original file size
      const originalSize = fs.statSync(inputPath).size;
      
      // Get file extension
      const ext = path.extname(file).toLowerCase();
      
      // Determine which Sharp method to use based on file type
      let sharpInstance = sharp(inputPath);
      
      if (ext === '.jpg' || ext === '.jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality: config.quality });
      } else if (ext === '.png') {
        sharpInstance = sharpInstance.png({ quality: config.quality });
      } else if (ext === '.gif') {
        // GIFs are handled differently, we need to preserve animation
        sharpInstance = sharpInstance.gif();
      }
      
      // Process the image
      await sharpInstance.toFile(outputPath);
      
      // Get compressed file size
      const compressedSize = fs.statSync(outputPath).size;
      const savings = originalSize - compressedSize;
      const savingsPercent = (savings / originalSize * 100).toFixed(2);
      
      totalSavings += savings;
      successCount++;
      
      console.log(`Compressed ${file}: ${(originalSize/1024).toFixed(2)}KB → ${(compressedSize/1024).toFixed(2)}KB (${savingsPercent}% saved)`);
    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
      errorCount++;
    }
  }
  
  const totalSavingsMB = (totalSavings / (1024 * 1024)).toFixed(2);
  
  console.log(`
Image compression complete:
- ${imageFiles.length} images found
- ${successCount} images compressed
- ${errorCount} errors encountered
- ${totalSavingsMB}MB total space saved
  `);
}

// Run the compression
compressImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
