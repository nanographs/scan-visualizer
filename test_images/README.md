# Test Images for Scan Visualizer

This folder contains SEM (Scanning Electron Microscopy) test images that can be used as patterns in the Scan Visualizer.

## Current Images (6 total)

1. **Octo_1_10kV 2024-07-14_16-16-32.jpeg** - Octo 16:16 (default pattern)
2. **Octo_1_10kV 2024-07-14_16-20-04.jpeg** - Octo 16:20
3. **Edge of the eye no artifacts 2k.jpeg** - Eye Edge 2k
4. **2b pilot00099 (1).jpeg** - Pilot 00099
5. **saved2024-04-06_18-52-04_8bit.jpeg** - Saved 8bit
6. **messed it up a bit but ya know.jpeg** - Messed Up

## Image Requirements

- **Format**: JPEG, PNG, or other web-compatible formats
- **Aspect Ratio**: Images with scale bars (non-square) are supported
- **Naming**: Any filename works - define display name in patterns array
- **Content**: SEM/microscopy images that show slow scan data (no scan distortion)

## How It Works

1. **Image Loading**: Images are loaded via fetch and converted to data URLs
2. **Pixel Data Extraction**: Raw pixel data is extracted and cached immediately
3. **Pattern Drawing**: Images are drawn using cached pixel data (CORS-safe)
4. **Simulation**: Images work identically to generated patterns
5. **Aspect Ratio**: Horizontal = resolution slider, Vertical = scaled to maintain ratio
6. **Performance**: Images are cached for instant switching

## Adding New Images

1. Add your image file(s) to this folder
2. Update the `patterns` array in `index.html`:
   ```javascript
   { id: 'imageN', name: 'Your Image Name', type: 'image', src: 'test_images/your_image.jpeg' }
   ```
3. Place new images at the top of the patterns array (images appear first)
4. Refresh the page - images will load automatically

## Technical Details

- **Requires HTTP Server**: Local development needs `python3 -m http.server 8000`
- **CORS-Safe**: Works on GitHub Pages without any issues
- **Unified Pipeline**: Images use the same simulation code as generated patterns
- **No Special Cases**: Image patterns are converted to pixel data early in the pipeline
