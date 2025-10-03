# Scan Visualizer - Technical Specification

## Overview
The Scan Visualizer is a web-based tool for simulating scanning microscopy systems with bandwidth and slew rate limitations. It provides real-time visualization of scan performance with multiple view modes and comprehensive timing analysis.

## Core Architecture

### HTML Structure
```html
<div class="container">
  <!-- Pattern Gallery at the very top -->
  <div class="pattern-section">
    <h3>Select Pattern:</h3>
    <div class="pattern-gallery" id="patternGallery">
      <!-- Pattern thumbnails generated dynamically -->
    </div>
  </div>
  
  <!-- Images with vertical labels -->
  <div class="images-container">
    <div class="image-wrapper">
      <div class="image-label">Ideal Pattern</div>
      <div class="image-content"><canvas id="ideal"></canvas></div>
    </div>
    <div class="image-wrapper">
      <div class="image-label">Simulated Scan</div>
      <div class="image-content"><canvas id="sim"></canvas></div>
    </div>
  </div>
  
  <!-- Timing information -->
  <div class="timing-info">
    Line: <span id="lineTime">--</span> | Frame: <span id="frameTime">--</span> | FPS: <span id="fps">--</span>
  </div>
  
  <!-- Main controls (unified control panel) -->
  <div class="main-controls">
    <!-- 4 slider rows with number inputs -->
    <!-- Resolution and View Mode controls -->
  </div>
  
  <!-- Plot with beam position traces -->
  <div class="plot-container">
    <canvas id="plot"></canvas>
    <div class="plot-legend">Red = Digital command; Blue = 1st line; Green = 2nd line; Orange = Last line</div>
  </div>
  
  <!-- Heading and system info -->
  <h2>Scan Visualizer</h2>
  <div class="limitation-info">...</div>
  
  <!-- Timing information -->
  <div class="timing-info">...</div>
</div>
```

## Control Specifications

### 1. Bandwidth Control
- **Element IDs**: `bw` (slider), `bw-display` (number input)
- **Range**: 1-1000 kHz (exponential scaling)
- **Slider Range**: 0-100 (exponential mapping)
- **Conversion Functions**: `sliderToBandwidth()`, `bandwidthToSlider()`
- **Step**: 1 kHz
- **Default**: 20 kHz (slider value 43)
- **Scaling**: Exponential (0-100 slider maps to 1-1000 kHz exponentially)

### 2. Dwell Time Control
- **Element IDs**: `dwell` (slider), `dwell-display` (number input)
- **Range**: 10-1000 ns (linear scaling)
- **Slider Range**: 10-1000
- **Step**: 10 ns
- **Default**: 100 ns

### 3. Line Delay Control
- **Element IDs**: `delay` (slider), `delay-display` (number input)
- **Display Unit**: μs (microseconds)
- **Internal Unit**: ns (nanoseconds)
- **Range**: 0-100 μs (0-100,000 ns)
- **Slider Range**: 0-100,000 ns
- **Step**: 100 ns (0.1 μs)
- **Conversion**: Input μs × 1000 = Internal ns
- **Default**: 0 μs

### 4. Slew Rate Control
- **Element IDs**: `slewRate` (slider), `slewRate-display` (number input)
- **Range**: 0.001-1.0 FS/μs (exponential scaling)
- **Slider Range**: 0-100 (exponential mapping)
- **Conversion Functions**: `sliderToSlewRate()`, `slewRateToSlider()`
- **Step**: 0.001 FS/μs
- **Default**: 0.05 FS/μs

### 5. Resolution Control
- **Element ID**: `resolution`
- **Type**: Discrete slider with tick marks
- **Options**: 128, 256, 512, 1024, 2048 (power-of-two)
- **Default**: 256 (slider position 1)
- **Impact**: Affects canvas dimensions and timing calculations
- **Display**: Shows current resolution in "256x256" format
- **Performance**: Max resolution limited to 2048 for optimal performance

### 6. Pattern Gallery
- **Element ID**: `patternGallery`
- **Type**: Visual thumbnail gallery (replaces dropdown)
- **Options**: image1, zone, checker, gradx, grady, ramp2d, slant, chirp, text, dots
- **Default**: image1 (SEM Image 1) - image patterns appear first
- **Desktop**: Square thumbnails (80px, aspect-ratio: 1)
- **Mobile**: Compact rectangular (50x40px)
- **Functions**: `createPatternThumbnail()`, `selectPattern()`, `initializePatternGallery()`, `updateImageThumbnail()`
- **Visual Feedback**: Hover effects, selection highlighting
- **Image Patterns**: SEM test images loaded from `test_images/` folder with aspect ratio preservation

### 7. View Mode Control
- **Element ID**: `viewMode`
- **Options**: normal, error, difference
- **Default**: normal
- **Functions**: `calculateDisplacement()`, `drawDisplacementHeatmap()`, `drawDifference()`

## Image Pattern Architecture

### Loading Pipeline
The application supports external image patterns (e.g., SEM images) with a unified processing pipeline:

1. **Image Loading** (`preloadImages()`)
   - Loads images directly from local paths (requires HTTP server)
   - Creates Image objects from source files
   - Caches loaded images in `imageCache` Map

2. **Pixel Data Extraction**
   - Extracts raw pixel data immediately after image loads
   - Stores in `imageDataCache` Map as `{data, width, height}`
   - Uses temporary canvas to get `getImageData()`
   - **CORS-safe**: Works when served via HTTP (local or deployed)

3. **Pattern Drawing** (`drawImageFromPixelData()`)
   - Draws using cached pixel data (not Image object)
   - Scales pixel data from source to target resolution
   - Preserves aspect ratio (width = resolution, height = scaled)
   - Fills remaining space with black
   - Uses `putImageData()` for rendering

4. **Thumbnail Updates** (`updateImageThumbnail()`)
   - Updates pattern gallery thumbnail after pixel data loads
   - Replaces "Loading image..." placeholder with actual image

### Unified Simulation
- **Image patterns use the same `simulate()` function as generated patterns**
- **No special cases or alternative code paths**
- **Pixel data is extracted early, making images identical to generated patterns**
- **All view modes work the same way for images and generated patterns**

### CORS Considerations
- **Local Development**: Requires HTTP server (e.g., `python3 -m http.server 8000`)
- **GitHub Pages**: Works automatically (same origin)
- **File Protocol** (`file://`): Will not work due to browser security
- **Console Warning**: Displays helpful message if CORS errors occur

### Data Structures
```javascript
// Image cache for Image objects
const imageCache = new Map();
// Pattern src → Image object

// Image data cache for extracted pixels
const imageDataCache = new Map();
// Pattern src → {data: Uint8ClampedArray, width: number, height: number}
```

## Core Functions

### Simulation Engine
```javascript
function simulate(srcCtx, simCtx, dwellNs, delayNs, bwkHz, slewRateUs)
```
- **Parameters**: Source context, simulation context, dwell time, delay, bandwidth, slew rate
- **Process**: 
  1. Calculate time constants (τ = 1/(2π×bw×1000))
  2. Apply bandwidth limitation (exponential response)
  3. Apply slew rate limitation (rate limiting)
  4. Generate scan traces for plotting
- **Returns**: Array of trace data for plotting

### Timing Calculations
```javascript
function calculateTiming(dwellNs, delayNs, resolution)
```
- **Line Time**: (resolution × dwell time) + delay
- **Frame Time**: line time × resolution
- **FPS**: 1000 / frame time (ms)
- **Returns**: Object with timing data

### Displacement Analysis
```javascript
function calculateDisplacement(dwellNs, delayNs, bwkHz, slewRateUs, w, h)
```
- **Process**: Simulates scan with limitations, calculates position errors
- **Returns**: Array of displacement values for each pixel
- **Usage**: Used for displacement heatmap visualization

### View Mode Functions
```javascript
function drawDisplacementHeatmap(ctx, displacements, w, h)
function drawDifference(idealCtx, simCtx, w, h)
```
- **Displacement Heatmap**: Color-coded visualization (blue=low error, red=high error)
- **Difference**: Grayscale pixel-by-pixel comparison

## Event Handling

### Slider Events
```javascript
document.getElementById("bw").oninput = function() {
  updateDisplayValues();
  runSimulation();
};
```

### Number Input Events
```javascript
document.getElementById("bw-display").oninput = function() {
  updateSliderFromInput("bw", "bw-display");
  runSimulation();
};
```

### Dropdown Events
```javascript
document.getElementById("pattern").onchange = runSimulation;
document.getElementById("resolution").onchange = runSimulation;
document.getElementById("viewMode").onchange = runSimulation;
```

## Data Flow

### Simulation Pipeline
1. **Parameter Collection**: Read from input elements
2. **Unit Conversion**: Convert μs to ns for line delay
3. **Canvas Setup**: Set dimensions and display size
4. **Pattern Generation**: Draw ideal pattern
5. **Simulation**: Apply bandwidth and slew rate limitations
6. **Plotting**: Generate beam position traces
7. **Timing Calculation**: Compute performance metrics
8. **Status Update**: Show system limitations
9. **View Mode**: Apply displacement heatmap or difference if selected

### Display Updates
- **Real-time**: All changes trigger immediate simulation
- **Synchronized**: Sliders and number inputs stay in sync
- **Responsive**: Canvas scaling adapts to screen size

## Current Layout Order (Updated)

### Visual Hierarchy
1. **Pattern Gallery** (visual pattern selection at the very top)
2. **Images with vertical labels** (ideal pattern and simulated scan)
3. **Timing information** (line time, frame time, FPS)
4. **Main controls** (bandwidth, dwell time, line delay, slew rate, resolution, view mode)
5. **Plot with beam position traces** (red, blue, green, orange lines)
6. **"Scan Visualizer" heading**
7. **System limitations display**

### Layout Rationale
- **Pattern gallery at top**: Visual pattern selection for immediate feedback
- **Images next**: Show selected pattern and simulation results
- **Main controls**: All parameters in one unified control panel (sliders + resolution + view mode)
- **Plot prominent**: Shows effects of parameter changes
- **Heading and info**: Contextual information
- **System limitations**: Performance metrics and constraints

## CSS Architecture

### Layout System
- **Container**: Max-width container with responsive design
- **Images**: Flexbox with vertical labels on desktop, horizontal on mobile
- **Controls**: Card-based layout with shadows
- **Mobile**: Stacked layout with touch-friendly controls

### Key CSS Classes
- `.pattern-section`: Pattern gallery container with header
- `.pattern-gallery`: Grid layout for pattern thumbnails
- `.pattern-thumbnail`: Individual pattern thumbnail with hover effects
- `.pattern-label`: Pattern name overlay on thumbnails
- `.images-container`: Flexbox for image layout
- `.image-wrapper`: Individual image container
- `.image-label`: Vertical text labels
- `.main-controls`: Primary control section
- `.slider-row`: Individual control row
- `.label-input-group`: Label + number input grouping
- `.secondary-controls`: Secondary control section
- `.timing-info`: Performance metrics display
- `.limitation-info`: System status display

### Responsive Breakpoints
- **Desktop**: Side-by-side images, inline controls
- **Mobile** (max-width: 768px): Compact layout with optimized spacing

### Mobile Layout Optimizations
- **Pattern Gallery**: Compact rectangular thumbnails (50x40px) with 6px gaps
- **Compact Sliders**: Row layout with smaller fonts and reduced padding
- **Smaller Inputs**: 50px width number inputs with 12px font
- **Reduced Spacing**: 8px margins between controls, 5px gaps
- **Flexible Layout**: Sliders take remaining space, labels stay compact
- **Touch-Friendly**: 20px height sliders for better thumb interaction

## Critical Dependencies

### JavaScript Functions (Must Preserve)
- `drawPattern()` - Pattern generation (handles both generated and image patterns)
- `simulate()` - Core simulation engine (unified for all pattern types)
- `plot()` - Beam position plotting
- `calculateTiming()` - Performance calculations
- `updateTimingDisplay()` - Timing display updates
- `calculateDisplacement()` - Position error analysis
- `drawDisplacementHeatmap()` - Heatmap visualization
- `drawDifference()` - Difference visualization
- `updateLimitationStatus()` - System status display
- `sliderToSlewRate()`, `slewRateToSlider()` - Exponential conversions
- `sliderToBandwidth()`, `bandwidthToSlider()` - Exponential conversions
- `updateDisplayValues()` - Slider to input sync
- `updateSliderFromInput()` - Input to slider sync
- `runSimulation()` - Main simulation orchestrator
- `createPatternThumbnail()` - Generate pattern thumbnail
- `selectPattern()` - Handle pattern selection
- `initializePatternGallery()` - Initialize pattern gallery
- `updateImageThumbnail()` - Update image thumbnail after pixel data loads
- `preloadImages()` - Load and extract pixel data from image patterns
- `drawImagePattern()` - Draw image patterns from cached pixel data
- `drawImageFromPixelData()` - Scale and render pixel data to canvas
- `drawImagePlaceholder()` - Show placeholder for missing images

### HTML Elements (Must Preserve)
- Canvas elements: `ideal`, `sim`, `plot`
- Control elements: All input and select elements
- Pattern gallery: `patternGallery` container
- Display elements: Timing and limitation status elements

### CSS Classes (Must Preserve)
- All layout and styling classes
- Responsive breakpoints
- Mobile-specific overrides

## Testing Checklist

### Functional Tests
- [ ] All sliders update number inputs
- [ ] All number inputs update sliders
- [ ] Out-of-range values work in number inputs
- [ ] Exponential scaling works for bandwidth and slew rate
- [ ] Unit conversion works for line delay (μs ↔ ns)
- [ ] All view modes work (normal, displacement, difference)
- [ ] Timing calculations are accurate
- [ ] System limitations display correctly
- [ ] Canvas scaling works at all resolutions
- [ ] Mobile layout is functional

### Regression Prevention
- [ ] All 28 features from inventory are present
- [ ] No JavaScript errors in console
- [ ] All event handlers are attached
- [ ] CSS classes are preserved
- [ ] HTML structure is maintained
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable

## Testing Framework

### Automated Slider Tests
The application includes comprehensive slider validation tests to prevent regressions:

#### Test Files
- **`test_sliders.html`**: Standalone test suite with visual results
- **`validate_sliders.js`**: Node.js test runner for CI/CD
- **`test_comprehensive.js`**: Comprehensive functionality tests
- **`benchmark_performance.js`**: Performance benchmark suite
- **`runSliderTests()`**: Built-in console test function

#### Test Coverage
- **Default Values**: Validates slider defaults match display values
- **Exponential Scaling**: Tests bandwidth and slew rate scaling functions
- **Bidirectional Conversion**: Verifies slider ↔ value conversions
- **Edge Cases**: Tests min/max values and boundary conditions
- **Unit Conversions**: Validates line delay μs ↔ ns conversion

#### Running Tests
```javascript
// In browser console
runSliderTests();

// Or open test_sliders.html in browser
// Or run: node validate_sliders.js
```

### Critical Test Points
- **Bandwidth**: Slider 43 → 20 kHz (default)
- **Slew Rate**: Slider 57 → 0.05 FS/μs (default)
- **Exponential Scaling**: Both bandwidth and slew rate use exponential mapping
- **Unit Conversion**: Line delay properly converts μs ↔ ns

## Future Development Guidelines

### When Making Changes
1. **Run slider tests** before and after changes
2. **Test all 28 features** before and after changes
3. **Preserve all function names** and signatures
4. **Maintain all element IDs** and CSS classes
5. **Keep event handling intact**
6. **Test on both desktop and mobile**
7. **Verify exponential scaling still works**
8. **Check out-of-range input functionality**
9. **Validate all view modes**
10. **Confirm timing calculations**
11. **Ensure responsive design**

### Code Organization
- Keep simulation functions together
- Maintain clear separation between UI and logic
- Preserve the event handling structure
- Document any new functions added
- Update this specification when adding features

## Deployment and Development

### Local Development
**Requires HTTP Server** for image patterns to work:
```bash
# Navigate to project directory
cd "/path/to/Scan Visualizer"

# Start Python HTTP server
python3 -m http.server 8000

# Open in browser
http://localhost:8000
```

**Why HTTP Server is Required:**
- Browser security (CORS) blocks `getImageData()` when using `file://` protocol
- HTTP server provides same-origin access to images
- Allows pixel data extraction from image patterns

### GitHub Pages Deployment
**Automatic Deployment:**
- Push to `main` branch
- GitHub Pages serves from repository root
- Image patterns work automatically (same origin)
- No CORS issues in production

### Adding New Image Patterns
1. **Add image file** to `test_images/` folder
2. **Add pattern definition** to `patterns` array:
   ```javascript
   { id: 'image2', name: 'SEM Image 2', type: 'image', src: 'test_images/your_image.jpeg' }
   ```
3. **Position at top** of patterns array (images appear first)
4. **Supported formats**: JPEG, PNG (any format supported by HTML Image)
5. **Aspect ratio**: Automatically preserved, scaled to fit resolution

### Development Workflow
1. **Make changes** to `index.html`
2. **Test locally** with HTTP server
3. **Verify** all patterns work (generated and images)
4. **Check** mobile responsiveness
5. **Run tests** (if available)
6. **Update** this specification
7. **Commit and push** to GitHub
8. **Verify** on GitHub Pages

This specification serves as the definitive reference for maintaining and extending the Scan Visualizer without losing functionality.
