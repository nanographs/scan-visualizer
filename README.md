# Scan Visualizer

A web-based tool for visualizing raster scanning effects with configurable parameters.

## 🚀 Quick Start

**Option 1: Run directly in browser (Recommended)**
- Click [here](https://adammccombs.github.io/scan-visualizer-app/) to open the visualizer
- No installation required - runs entirely in your browser
- Hosted on GitHub Pages for instant access

**Option 2: Download and run locally**
1. Download the `scan_visualizer.html` file
2. Open it in any modern web browser
3. Start experimenting with different patterns and parameters

## 🎯 What it does

This tool simulates raster scanning effects by modeling:
- **Dwell time**: How long the scanner stays at each pixel
- **Line delay**: Time between scan lines
- **Bandwidth**: System response characteristics

## 🎨 Features

- **Multiple test patterns**: Checkerboard, gradients, zone plates, and more
- **Real-time simulation**: See how scanning parameters affect image quality
- **Visual feedback**: Compare ideal vs. simulated results
- **Parameter tuning**: Adjust dwell time, delays, and bandwidth

## 📊 How to use

1. **Select a pattern** from the dropdown menu
2. **Adjust parameters**:
   - Dwell time (ns): Time per pixel
   - Line delay (ns): Time between lines  
   - Bandwidth (kHz): System response
3. **Click "Simulate"** to see the results
4. **Compare** the ideal (left) vs simulated (right) images
5. **Analyze** the timing plot below

## 🔬 Technical Details

The simulation models a first-order system response:
- Digital command signal (red line)
- First line response (blue line)  
- Second line response (green line)
- Last line response (orange line)

## 🌐 GitHub Pages Hosting

This project is automatically deployed to GitHub Pages:
- **Live URL**: https://adammccombs.github.io/scan-visualizer-app/
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
