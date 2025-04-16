# GitHub Pages Deployment Guide

This document provides instructions for optimizing image loading on your GitHub Pages site.

## Fast Image Loading on Mobile

For the best mobile experience with fast loading images, follow these steps:

### Step 1: Install Required Packages

Run the following command to install the Sharp image processing library:

```bash
npm install sharp
```

### Step 2: Generate Optimized Images

Run the image optimization script:

```bash
node create-github-optimized-images.js
```

This will create a new `/mobile/` folder containing optimized versions of all your images:

- `-mobile.jpg` versions: Smaller, compressed versions for mobile devices
- `-mobile.webp` versions: WebP format for modern browsers (even smaller)
- `-thumb.jpg` versions: Tiny thumbnails for previews

### Step 3: Commit the New Images to GitHub

Make sure to commit and push the `/mobile/` folder with all optimized images to your repository:

```bash
git add mobile/
git commit -m "Add optimized mobile images"
git push
```

### Step 4: Deploy to GitHub Pages

Your site should now automatically use the optimized images on mobile devices. No further changes are needed as the `mobile-image-optimizer.js` script automatically detects mobile browsers and serves the appropriate images.

## Advanced Optimization (Optional)

For even better performance, you can use the generated HTML snippets for picture tags. In the `/mobile/` folder, you'll find a file called `picture-tag-snippets.html` that contains HTML code for each image.

Replace each `<img>` tag in your HTML with the corresponding `<picture>` element from the snippets file for the optimal multi-resolution loading experience.

## Resources

- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [WebP Browser Support](https://caniuse.com/webp)
