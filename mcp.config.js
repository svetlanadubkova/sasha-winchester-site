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
    // General image optimization tools
    "optimize-images": "node optimize-images.js",
    "compress-images": "node compress-images.js",
    "responsive-images": "node create-responsive-images.js",
    
    // Mobile-specific image optimization
    "mobile-images": "node optimize-mobile-images.js",
    
    // Install dependencies needed for image processing
    "install-deps": "npm install sharp"
  }
};