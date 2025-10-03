# Scan Visualizer

A web-based tool for visualizing raster scanning effects with configurable parameters and real SEM image support.

## 🚀 Quick Start

**Option 1: Run directly in browser (Recommended)**
- Click [here](https://nanographs.github.io/scan-visualizer/) to open the visualizer
- No installation required - runs entirely in your browser
- Hosted on GitHub Pages for instant access

**Option 2: Download and run locally**
1. Clone or download this repository
2. Start a local HTTP server: `python3 -m http.server 8000`
3. Open `http://localhost:8000` in your browser
4. Start experimenting with different patterns and parameters

**Note**: Local development requires an HTTP server for SEM image patterns to work correctly due to browser CORS restrictions.

## 🎯 What it does

This tool simulates raster scanning effects by modeling:
- **Dwell time**: How long the scanner stays at each pixel
- **Line delay**: Time between scan lines  
- **Bandwidth**: System response characteristics (1-1000 kHz exponential)
- **Slew rate**: Maximum rate of change (0.001-1.0 FS/μs exponential)

## 🎨 Features

- **6 SEM test images** + **9 generated patterns**: Real microscopy images and test patterns
- **Real-time simulation**: See how scanning parameters affect image quality
- **Visual pattern gallery**: Click thumbnails to switch patterns instantly
- **Multiple view modes**: Normal, Displacement Heatmap, Difference
- **Parameter tuning**: Adjust bandwidth, dwell time, line delay, and slew rate
- **Performance metrics**: Real-time line time, frame time, and FPS calculations

## 📊 How to use

1. **Select a pattern** from the visual gallery (SEM images or generated patterns)
2. **Adjust parameters** using sliders:
   - Bandwidth (kHz): System bandwidth limitation (1-1000, exponential)
   - Dwell time (ns): Time per pixel (10-1000)
   - Line delay (μs): Time between lines (0-100)
   - Slew rate (FS/μs): Maximum rate of change (0.001-1.0, exponential)
3. **View results** in real-time - no "Simulate" button needed!
4. **Compare** the ideal (left) vs simulated (right) images
5. **Analyze** the beam position plot and timing metrics
6. **Change view mode** to see Displacement Heatmap or Difference

## 🔬 Technical Details

The simulation models a first-order system response:
- Digital command signal (red line)
- First line response (blue line)  
- Second line response (green line)
- Last line response (orange line)

## 🌐 GitHub Pages Hosting

This project is automatically deployed to GitHub Pages:
- **Live URL**: https://nanographs.github.io/scan-visualizer/
- **Source**: The `index.html` file serves as the main entry point
- **Deployment**: Automatic updates when code is pushed to the main branch
- **No build process**: Pure HTML/CSS/JavaScript - works directly in browsers

## 🛠️ Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- JavaScript ES6+
- CSS3

## 📝 License

This project is open source. Feel free to use, modify, and distribute.

## 🤝 Contributing

Found a bug or want to add a feature? Open an issue or submit a pull request!

---

*Built with vanilla HTML, CSS, and JavaScript - no frameworks required!*
