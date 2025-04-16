// Generate mobile-optimized images with sharp
// This script creates smaller versions of all gallery images
// specifically for mobile devices

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const config = {
  // Source directory containing images
  inputDir: './',
  
  // Output directory for mobile images
  outputDir: './mobile-images/',
  
  // File types to process
  imageExtensions: ['.jpg', '.jpeg', '.png'],
  
  // Mobile image width
  mobileWidth: 600,
  
  // Quality of output images (1-100)
  quality: 75,
  
  // Whether to create WebP versions as well (for modern browsers)
  createWebP: true,
  
  // WebP quality
  webpQuality: 75
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
    // Check if it's a file (not a directory)
    const filePath = path.join(dir, file);
    if (!fs.lstatSync(filePath).isFile()) return false;
    
    // Check if it's an image by extension
    const extension = path.extname(file).toLowerCase();
    return config.imageExtensions.includes(extension);
  });
}

// Process each image
async function createMobileImages() {
  const imageFiles = getImageFiles(config.inputDir);
  console.log(`Found ${imageFiles.length} images to process`);
  
  let successCount = 0;
  let errorCount = 0;
  let totalSavings = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(config.inputDir, file);
    const fileExt = path.extname(file);
    const fileName = path.basename(file, fileExt);
    
    // Skip processed files
    if (file.includes('-mobile')) continue;
    
    // Output paths
    const mobileOutputPath = path.join(config.outputDir, `${fileName}-mobile${fileExt}`);
    const webpOutputPath = path.join(config.outputDir, `${fileName}-mobile.webp`);
    
    try {
      // Get original file size
      const originalSize = fs.statSync(inputPath).size;
      
      // Get image info
      const metadata = await sharp(inputPath).metadata();
      
      // Skip if image is already smaller than target
      if (metadata.width <= config.mobileWidth) {
        console.log(`Skipping ${file} - already smaller than ${config.mobileWidth}px`);
        continue;
      }
      
      // Create regular mobile version
      await sharp(inputPath)
        .resize({ 
          width: config.mobileWidth,
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: config.quality })
        .toFile(mobileOutputPath);
      
      // Create WebP version if enabled
      if (config.createWebP) {
        await sharp(inputPath)
          .resize({ 
            width: config.mobileWidth,
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: config.webpQuality })
          .toFile(webpOutputPath);
      }
      
      // Get compressed file size
      const mobileSize = fs.statSync(mobileOutputPath).size;
      const savings = originalSize - mobileSize;
      const savingsPercent = (savings / originalSize * 100).toFixed(2);
      
      totalSavings += savings;
      successCount++;
      
      console.log(`Created mobile version of ${file}: ${(originalSize/1024).toFixed(2)}KB → ${(mobileSize/1024).toFixed(2)}KB (${savingsPercent}% saved)`);
    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
      errorCount++;
    }
  }
  
  const totalSavingsMB = (totalSavings / (1024 * 1024)).toFixed(2);
  
  console.log(`
Mobile image creation complete:
- ${imageFiles.length} images found
- ${successCount} mobile images created
- ${errorCount} errors encountered
- ${totalSavingsMB}MB total space saved
  `);
  
  // Now generate the HTML snippet for using these images
  generateResponsiveImageHTML(imageFiles);
}

// Generate HTML snippet for using responsive images
function generateResponsiveImageHTML(imageFiles) {
  let html = `<!-- Generated responsive image HTML -->
<!-- Add this to your index.html file in each gallery-item replacing the img tag -->

`;

  imageFiles.forEach(file => {
    if (file.includes('-mobile')) return;
    
    const fileExt = path.extname(file);
    const fileName = path.basename(file, fileExt);
    
    html += `<!-- For ${file} -->
<picture>
  <source 
    srcset="mobile-images/${fileName}-mobile.webp" 
    media="(max-width: 768px)" 
    type="image/webp"
  >
  <source 
    srcset="mobile-images/${fileName}-mobile${fileExt}" 
    media="(max-width: 768px)"
  >
  <img 
    src="${file}" 
    alt="${fileName}" 
    loading="lazy" 
    class="lazy-image"
  >
</picture>

`;
  });
  
  fs.writeFileSync(
    path.join(config.outputDir, 'responsive-image-html.html'), 
    html
  );
  
  console.log(`Generated responsive image HTML example at ${config.outputDir}responsive-image-html.html`);
}

// Run the process
createMobileImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
