module.exports = {
  name: 'sasha-winchester',
  description: 'Sasha Winchester - Svetlana Dubkova Artist Portfolio',
  server: {
    type: 'static',
    path: './',
    port: 3000
  },
  build: {
    command: '',
    output: './'
  },
  scripts: {
    // Optimize images to different sizes
    "optimize-images": "node optimize-images.js",
    
    // Just compress images without resizing
    "compress-images": "node compress-images.js",
    
    // Create responsive image variants
    "responsive-images": "node create-responsive-images.js",
    
    // Install dependencies needed for image processing
    "install-deps": "npm install sharp"
  }
};