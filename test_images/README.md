# Test Images for Scan Visualizer

This folder contains SCM (Scanning Capacitance Microscopy) test images that can be used as patterns in the Scan Visualizer.

## Image Requirements

- **Format**: JPG, PNG, or other web-compatible formats
- **Aspect Ratio**: Images should have a scale bar at the bottom, making them non-square
- **Naming**: Use descriptive names like `image1.jpg`, `image2.jpg`, etc.
- **Content**: SCM images that show slow scan data (no scan distortion)

## How It Works

- Images are loaded as pattern options in the pattern gallery
- Horizontal resolution = selected resolution slider value
- Vertical resolution = scaled to maintain aspect ratio
- Images are cached for performance
- Any remaining space at the bottom is filled with black

## Adding New Images

1. Add your image files to this folder
2. Update the `patterns` array in `index.html` to include your new images
3. Follow the naming convention: `{id: 'imageN', name: 'SCM Image N', type: 'image', src: 'test_images/imageN.jpg'}`

## Example Images

Place your SCM test images here. The system will automatically:
- Scale them to the selected resolution
- Maintain aspect ratio
- Handle loading errors gracefully
- Cache images for performance
