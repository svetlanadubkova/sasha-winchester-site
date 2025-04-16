// GitHub Pages Optimized Images Creator
// This script creates properly sized images for GitHub Pages deployment
// Run with: node create-github-optimized-images.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const config = {
  // Source directory containing images
  inputDir: './',
  
  // Output directory for mobile images
  mobileDir: './mobile/',
  
  // File types to process
  imageExtensions: ['.jpg', '.jpeg', '.png'],
  
  // Mobile image width
  mobileWidth: 600,
  
  // Quality of output images (1-100)
  quality: 75,
  
  // Whether to create WebP versions as well
  createWebP: true,
  
  // Whether to create thumbnail versions
  createThumbnails: true,
  
  // Thumbnail width
  thumbnailWidth: 200
};

// Create output directory if it doesn't exist
if (!fs.existsSync(config.mobileDir)) {
  fs.mkdirSync(config.mobileDir, { recursive: true });
  console.log(`Created output directory: ${config.mobileDir}`);
}

// Get all image files in the input directory
function getImageFiles(dir) {
  const files = fs.readdirSync(dir);
  
  return files.filter(file => {
    // Skip already processed files
    if (file.includes('-mobile') || file.includes('-thumb')) {
      return false;
    }
    
    // Check if it's a file (not a directory)
    const filePath = path.join(dir, file);
    if (!fs.lstatSync(filePath).isFile()) return false;
    
    // Check if it's an image by extension
    const extension = path.extname(file).toLowerCase();
    return config.imageExtensions.includes(extension);
  });
}

// Process each image
async function createOptimizedImages() {
  const imageFiles = getImageFiles(config.inputDir);
  console.log(`Found ${imageFiles.length} images to process`);
  
  let successCount = 0;
  let errorCount = 0;
  let totalSavings = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(config.inputDir, file);
    const fileExt = path.extname(file);
    const fileName = path.basename(file, fileExt);
    
    try {
      // Get original file size
      const originalSize = fs.statSync(inputPath).size;
      
      // Create mobile version
      const mobileOutputPath = path.join(config.mobileDir, `${fileName}-mobile${fileExt}`);
      
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
        const webpOutputPath = path.join(config.mobileDir, `${fileName}-mobile.webp`);
        
        await sharp(inputPath)
          .resize({ 
            width: config.mobileWidth,
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: config.quality })
          .toFile(webpOutputPath);
      }
      
      // Create thumbnail if enabled
      if (config.createThumbnails) {
        const thumbOutputPath = path.join(config.mobileDir, `${fileName}-thumb${fileExt}`);
        
        await sharp(inputPath)
          .resize({ 
            width: config.thumbnailWidth,
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: config.quality })
          .toFile(thumbOutputPath);
      }
      
      // Get mobile file size
      const mobileSize = fs.statSync(mobileOutputPath).size;
      const savings = originalSize - mobileSize;
      const savingsPercent = (savings / originalSize * 100).toFixed(2);
      
      totalSavings += savings;
      successCount++;
      
      console.log(`Processed ${file}: ${(originalSize/1024).toFixed(2)}KB → ${(mobileSize/1024).toFixed(2)}KB (${savingsPercent}% saved)`);
    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
      errorCount++;
    }
  }
  
  const totalSavingsMB = (totalSavings / (1024 * 1024)).toFixed(2);
  
  console.log(`
GitHub Pages optimized images creation complete:
- ${imageFiles.length} images found
- ${successCount} images optimized
- ${errorCount} errors encountered
- ${totalSavingsMB}MB total space saved
  `);
  
  // Generate HTML snippet for picture tags
  generatePictureTagHTML(imageFiles);
}

// Generate HTML snippet for responsive images
function generatePictureTagHTML(imageFiles) {
  let html = `<!-- 
  OPTIMIZED IMAGE HTML SNIPPETS
  Replace your current img tags with these picture elements for optimal loading
  -->

`;

  imageFiles.forEach(file => {
    const fileExt = path.extname(file);
    const fileName = path.basename(file, fileExt);
    
    html += `<!-- For ${file} -->
<picture>
  <!-- WebP version for modern browsers -->
  <source 
    srcset="mobile/${fileName}-mobile.webp" 
    media="(max-width: 768px)" 
    type="image/webp"
  >
  <!-- Fallback mobile version -->
  <source 
    srcset="mobile/${fileName}-mobile${fileExt}" 
    media="(max-width: 768px)"
  >
  <!-- Original version for desktop -->
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
    path.join(config.mobileDir, 'picture-tag-snippets.html'), 
    html
  );
  
  console.log(`Generated HTML snippets at ${config.mobileDir}picture-tag-snippets.html`);
}

// Run the process
createOptimizedImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
