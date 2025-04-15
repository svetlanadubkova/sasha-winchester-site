# Sasha Winchester Portfolio Site

## Image Optimization

This project includes several tools to optimize images for faster loading on mobile devices.

### Setup

Before using the image optimization tools, you need to install the required dependencies:

```
npx mcp run install-deps
```

This will install the Sharp image processing library.

### Available Image Tools

The project includes three different image optimization tools:

#### 1. Simple Image Compression

This tool compresses all images without resizing them:

```
npx mcp run compress-images
```

This is the fastest option and will create compressed versions of all images in the `/compressed` directory.

#### 2. Multi-size Image Optimization

This tool creates multiple versions of each image at different sizes:

```
npx mcp run optimize-images
```

It will create small, medium, and large versions of each image in the `/optimized` directory.

#### 3. Responsive Image Creation

This tool creates responsive image variants with the appropriate naming convention for use with srcset:

```
npx mcp run responsive-images
```

It generates different sizes of each image and also creates an HTML example file showing how to use them with the srcset attribute for responsive loading.

### Configuration

You can modify the settings for each tool by editing their respective JavaScript files:

- `compress-images.js` - For simple compression
- `optimize-images.js` - For creating multiple sizes
- `create-responsive-images.js` - For responsive images with srcset

### Using Optimized Images

After running any of the optimization tools, you'll need to update your HTML to reference the optimized images.

For the responsive images approach, you can use the HTML examples generated in the `responsive-examples.html` file as a reference.
