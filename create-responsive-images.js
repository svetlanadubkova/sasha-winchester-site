const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const config = {
  // Source directory containing images
  inputDir: './',
  
  // Output directory for responsive images
  outputDir: './responsive/',
  
  // File types to process
  imageExtensions: ['.jpg', '.jpeg', '.png'],
  
  // Sizes to generate for responsive images
  sizes: [
    { name: 'sm', width: 400 },
    { name: 'md', width: 800 },
    { name: 'lg', width: 1200 }
  ],
  
  // Quality of output images (1-100)
  quality: 80,
  
  // Generate HTML examples with srcset
  generateHtmlExamples: true
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
    // Skip already processed responsive images
    if (file.includes('-sm') || file.includes('-md') || file.includes('-lg')) {
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

// Generate HTML with srcset for a responsive image
function generateHtmlExample(file, sizes) {
  const fileExt = path.extname(file);
  const fileName = path.basename(file, fileExt);
  
  const srcset = sizes.map(size => {
    return `${config.outputDir}${fileName}-${size.name}${fileExt} ${size.width}w`;
  }).join(', ');
  
  return `
<!-- Responsive image example for ${file} -->
<img 
  src="${config.outputDir}${fileName}-md${fileExt}" 
  srcset="${srcset}" 
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px" 
  alt="${fileName}" 
  loading="lazy"
/>
`;
}

// Process each image
async function createResponsiveImages() {
  const imageFiles = getImageFiles(config.inputDir);
  console.log(`Found ${imageFiles.length} images to process`);
  
  let successCount = 0;
  let errorCount = 0;
  let htmlExamples = '';
  
  for (const file of imageFiles) {
    const inputPath = path.join(config.inputDir, file);
    const fileExt = path.extname(file);
    const fileName = path.basename(file, fileExt);
    
    const generatedSizes = [];
    
    try {
      // Get image info
      const metadata = await sharp(inputPath).metadata();
      console.log(`Processing: ${file} (${metadata.width}x${metadata.height})`);
      
      // For each responsive size
      for (const size of config.sizes) {
        // Skip if image is already smaller than target
        if (metadata.width <= size.width) {
          console.log(`Skipping ${size.name} for ${file} - already smaller than ${size.width}px`);
          continue;
        }
        
        // Determine output filename
        const outputFilename = `${fileName}-${size.name}${fileExt}`;
        const outputPath = path.join(config.outputDir, outputFilename);
        
        // Process the image
        await sharp(inputPath)
          .resize({ width: size.width, withoutEnlargement: true })
          .jpeg({ quality: config.quality })
          .toFile(outputPath);
        
        console.log(`Created ${size.name} version (${size.width}px) of ${file}`);
        generatedSizes.push(size);
        successCount++;
      }
      
      // Generate HTML example if requested
      if (config.generateHtmlExamples && generatedSizes.length > 0) {
        htmlExamples += generateHtmlExample(file, generatedSizes);
      }
    } catch (error) {
      console.error(`Error processing ${file}: ${error.message}`);
      errorCount++;
    }
  }
  
  // Save HTML examples if generated
  if (config.generateHtmlExamples && htmlExamples) {
    fs.writeFileSync(
      path.join(config.outputDir, 'responsive-examples.html'), 
      htmlExamples
    );
    console.log(`Generated responsive HTML examples in ${config.outputDir}responsive-examples.html`);
  }
  
  console.log(`
Responsive image creation complete:
- ${imageFiles.length} images found
- ${successCount} responsive versions created
- ${errorCount} errors encountered
  `);
}

// Run the process
createResponsiveImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
