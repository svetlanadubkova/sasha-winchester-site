const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const config = {
  // Source directory containing images
  inputDir: './',
  
  // Output directory for optimized images
  outputDir: './optimized/',
  
  // File types to process
  imageExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
  
  // Sizes to generate (width in pixels)
  sizes: {
    small: 400,
    medium: 800,
    large: 1200
  },
  
  // Quality of output images (1-100)
  quality: 80,
  
  // Whether to create a size suffix in filename
  addSizeSuffix: false,
  
  // Whether to replace original files (use with caution!)
  replaceOriginals: false
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
  console.log(`Created output directory: ${config.outputDir}`);
}

// Get all image files in the input directory
function getImageFiles(dir) {
  const files = fs.readdirSync(dir);
  
  return files.filter(file => {
    const extension = path.extname(file).toLowerCase();
    return config.imageExtensions.includes(extension);
  });
}

// Process each image
async function optimizeImages() {
  const imageFiles = getImageFiles(config.inputDir);
  console.log(`Found ${imageFiles.length} images to process`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(config.inputDir, file);
    const fileExt = path.extname(file);
    const fileName = path.basename(file, fileExt);
    
    try {
      // Get image info
      const metadata = await sharp(inputPath).metadata();
      console.log(`Processing: ${file} (${metadata.width}x${metadata.height})`);
      
      // For each size configuration
      for (const [sizeName, targetWidth] of Object.entries(config.sizes)) {
        // Skip if image is already smaller than target
        if (metadata.width <= targetWidth) {
          console.log(`Skipping ${sizeName} for ${file} - already smaller than ${targetWidth}px`);
          continue;
        }
        
        // Determine output filename
        const suffix = config.addSizeSuffix ? `-${sizeName}` : '';
        const outputFilename = `${fileName}${suffix}${fileExt}`;
        const outputPath = config.replaceOriginals 
          ? inputPath 
          : path.join(config.outputDir, outputFilename);
        
        // Process the image
        await sharp(inputPath)
          .resize({ width: targetWidth, withoutEnlargement: true })
          .jpeg({ quality: config.quality })
          .toFile(outputPath);
        
        console.log(`Created ${sizeName} version of ${file}`);
        successCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
      errorCount++;
    }
  }
  
  console.log(`
Image optimization complete:
- ${imageFiles.length} images found
- ${successCount} optimized versions created
- ${errorCount} errors encountered
  `);
}

// Run the optimization
optimizeImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
