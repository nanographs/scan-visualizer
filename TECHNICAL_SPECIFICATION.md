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
  
  <!-- Main controls (thumb-accessible) -->
  <div class="main-controls">
    <!-- 4 slider rows with number inputs -->
  </div>
  
  <!-- Plot with beam position traces -->
  <div class="plot-container">
    <canvas id="plot"></canvas>
    <div class="plot-legend">Red = Digital command; Blue = 1st line; Green = 2nd line; Orange = Last line</div>
  </div>
  
  <!-- Secondary controls -->
  <div class="secondary-controls">
    <!-- Resolution, Pattern, View Mode dropdowns -->
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
- **Options**: 128, 256, 512, 1024 (power-of-two)
- **Default**: 256
- **Impact**: Affects canvas dimensions and timing calculations

### 6. Pattern Gallery
- **Element ID**: `patternGallery`
- **Type**: Visual thumbnail gallery (replaces dropdown)
- **Options**: zone, checker, gradx, grady, ramp2d, slant, chirp, text, dots
- **Default**: zone (Zone Plate)
- **Desktop**: Square thumbnails (80px min, aspect-ratio: 1)
- **Mobile**: Compact rectangular (50x40px)
- **Functions**: `createPatternThumbnail()`, `selectPattern()`, `initializePatternGallery()`
- **Visual Feedback**: Hover effects, selection highlighting

### 7. View Mode Control
- **Element ID**: `viewMode`
- **Options**: normal, error, difference
- **Default**: normal
- **Functions**: `calculateDisplacement()`, `drawDisplacementHeatmap()`, `drawDifference()`

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
4. **Main controls/sliders** (bandwidth, dwell time, line delay, slew rate)
5. **Plot with beam position traces** (red, blue, green, orange lines)
6. **Secondary controls** (resolution, view mode)
7. **"Scan Visualizer" heading**
8. **System limitations display**

### Layout Rationale
- **Pattern gallery at top**: Visual pattern selection for immediate feedback
- **Images next**: Show selected pattern and simulation results
- **Main controls**: Primary parameters for thumb access
- **Plot prominent**: Shows effects of parameter changes
- **Secondary controls**: Less frequently changed settings (resolution, view mode)
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
- `drawPattern()` - Pattern generation
- `simulate()` - Core simulation engine
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

This specification serves as the definitive reference for maintaining and extending the Scan Visualizer without losing functionality.
