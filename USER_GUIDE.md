# Scan Visualizer - User Guide

## 🎯 What is the Scan Visualizer?

The Scan Visualizer is a web-based tool for simulating scanning microscopy systems with realistic hardware limitations. It helps you understand how bandwidth and slew rate limitations affect scan performance.

## 🚀 Getting Started

### Opening the Application
1. Open `scan_visualizer.html` in your web browser
2. The application will load with default settings
3. You'll see two images: "Ideal Pattern" and "Simulated Scan"

### Understanding the Interface

#### **Images (Top)**
- **Ideal Pattern**: Shows the target pattern without limitations
- **Simulated Scan**: Shows how the pattern looks with hardware limitations

#### **Timing Information**
- **Line**: Time to scan one line
- **Frame**: Time to scan entire frame  
- **FPS**: Frames per second

#### **Main Controls (Thumb-Friendly)**
- **Bandwidth (kHz)**: System bandwidth limitation (1-1000 kHz)
- **Dwell time (ns)**: Time per pixel (10-1000 ns)
- **Line delay (μs)**: Delay between lines (0-100 μs)
- **Slew rate (FS/μs)**: Maximum rate of change (0.001-1.0 FS/μs)

#### **Plot (Beam Position Traces)**
- **Red**: Digital command signal
- **Blue**: First line actual position
- **Green**: Second line actual position
- **Orange**: Last line actual position

#### **Secondary Controls**
- **Resolution**: Image size (128x128 to 1024x1024)
- **Pattern**: Test pattern type
- **View**: Display mode (Normal, Displacement Heatmap, Difference)

## 🎛️ How to Use

### Basic Operation
1. **Adjust main controls** to see real-time effects
2. **Watch the plot** to understand position errors
3. **Check timing info** to see performance impact
4. **Try different patterns** to test various scenarios

### Understanding the Controls

#### **Bandwidth Control**
- **Low values (1-10 kHz)**: Strong filtering, smooth but slow
- **High values (100-1000 kHz)**: Fast response, may show artifacts
- **Exponential scaling**: Fine control at low frequencies

#### **Slew Rate Control**
- **Low values (0.001-0.01 FS/μs)**: Rate-limited, smooth transitions
- **High values (0.1-1.0 FS/μs)**: Fast changes, may cause overshoot
- **Exponential scaling**: Wide range with fine control

#### **Dwell Time**
- **Short times (10-100 ns)**: Fast scanning, may show limitations
- **Long times (500-1000 ns)**: Slow scanning, better signal quality

#### **Line Delay**
- **Zero delay**: Continuous scanning
- **Non-zero delay**: Pause between lines (flyback time)

### View Modes

#### **Normal Mode**
- Shows the simulated scan as it would appear
- Best for general use and understanding effects

#### **Displacement Heatmap**
- **Blue**: Low position error
- **Red**: High position error
- Shows where the beam position deviates from commanded

#### **Difference Mode**
- Grayscale difference between ideal and simulated
- **White**: Large differences
- **Black**: No differences

## 📱 Mobile Usage

### Touch-Friendly Design
- **Large sliders** for easy thumb control
- **Compact layout** to fit more on screen
- **Vertical labels** for space efficiency

### Mobile Tips
1. **Use your thumb** to adjust sliders
2. **Pinch to zoom** on images if needed
3. **Rotate device** for landscape viewing
4. **Tap number inputs** for precise values

## 🔧 Advanced Features

### Out-of-Range Values
- **Type any value** in number inputs, even outside slider ranges
- **Useful for testing** extreme conditions
- **Simulation uses your typed values** directly

### Exponential Scaling
- **Bandwidth and slew rate** use exponential scaling
- **Fine control** at low values
- **Wide range** coverage
- **Consistent with real hardware** behavior

### System Limitations Display
- Shows active bandwidth and slew rate constraints
- **Time constants** for bandwidth limitation
- **Maximum change per dwell** for slew rate limitation

## 🎨 Pattern Types

### **Zone Plate**
- Concentric circles for resolution testing
- Shows bandwidth effects clearly

### **Checkerboard**
- Alternating black/white squares
- Good for testing sharp transitions

### **Gradients**
- **Gradient X**: Horizontal intensity gradient
- **Gradient Y**: Vertical intensity gradient
- Shows slew rate limitations

### **2D Ramp**
- Diagonal intensity gradient
- Tests both X and Y limitations

### **Slanted Edge**
- Diagonal line for edge response testing
- Shows bandwidth effects on sharp edges

### **Sine Chirp**
- Frequency-swept sine wave
- Tests frequency response

### **Text Banner**
- "RESCAN TEST →" text
- Good for readability testing

### **Random Dots**
- Random pixel pattern
- Tests noise characteristics

## 📊 Understanding the Results

### **Timing Information**
- **Line time**: How long each line takes
- **Frame time**: Total scan time
- **FPS**: How fast you can scan

### **Beam Position Plot**
- **Red line**: What you commanded
- **Colored lines**: What actually happened
- **Gaps**: Show position errors
- **Curves**: Show bandwidth/slew rate effects

### **Displacement Heatmap**
- **Blue areas**: Good position accuracy
- **Red areas**: Poor position accuracy
- **Pattern**: Shows systematic errors

## 🚨 Troubleshooting

### **Images Not Updating**
- Check that all controls have valid values
- Try refreshing the page
- Check browser console for errors

### **Performance Issues**
- Reduce resolution (try 256x256 instead of 1024x1024)
- Avoid displacement heatmap on mobile
- Close other browser tabs

### **Mobile Issues**
- Ensure viewport meta tag is present
- Try landscape orientation
- Use touch-friendly controls

## 💡 Tips for Best Results

### **For Bandwidth Testing**
- Use zone plate pattern
- Try different bandwidth values
- Watch the beam position plot

### **For Slew Rate Testing**
- Use gradient patterns
- Set high bandwidth, low slew rate
- Look for "stair-step" effects

### **For Performance Testing**
- Use timing information
- Try different resolutions
- Test on mobile and desktop

### **For System Design**
- Start with high bandwidth, no slew rate
- Gradually add limitations
- Use displacement heatmap to see errors

## 🔬 Technical Details

### **Simulation Accuracy**
- **Bandwidth limitation**: First-order exponential response
- **Slew rate limitation**: Rate limiting with maximum change per dwell
- **Combined effects**: Bandwidth applied first, then slew rate

### **Performance Considerations**
- **Higher resolution**: More computation, slower updates
- **Complex patterns**: More calculation time
- **Displacement heatmap**: Most computationally intensive

### **Browser Compatibility**
- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Mobile browsers**: iOS Safari, Chrome Mobile
- **Canvas support**: Required for image generation

## 📚 Further Reading

- **Technical Specification**: See `TECHNICAL_SPECIFICATION.md`
- **Test Suite**: See `test_sliders.html` for validation
- **Performance**: See `benchmark_performance.js` for optimization

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Try the test suite: `test_sliders.html`
3. Verify all features are working
4. Check the technical specification for details

---

*This user guide covers the essential functionality of the Scan Visualizer. For technical details, see the Technical Specification document.*
