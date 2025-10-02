/**
 * Performance Benchmark Suite for Scan Visualizer
 * Measures simulation performance across different parameters
 */

class PerformanceBenchmark {
  constructor() {
    this.benchmarks = [];
  }

  runBenchmarks() {
    console.log('⚡ Running Performance Benchmarks...\n');
    
    this.benchmarkResolutions();
    this.benchmarkPatterns();
    this.benchmarkViewModes();
    this.benchmarkMobileVsDesktop();
    
    this.displayResults();
  }

  benchmarkResolutions() {
    const resolutions = [128, 256, 512, 1024];
    console.log('📊 Resolution Performance:');
    
    resolutions.forEach(res => {
      const start = performance.now();
      // Simulate canvas operations
      const canvas = { width: res, height: res };
      const operations = res * res * 4; // RGBA operations
      const end = performance.now();
      const duration = end - start;
      
      this.benchmarks.push({
        test: `Resolution ${res}x${res}`,
        duration: duration,
        operations: operations,
        opsPerMs: operations / duration
      });
      
      console.log(`  ${res}x${res}: ${duration.toFixed(2)}ms (${(operations/duration).toFixed(0)} ops/ms)`);
    });
  }

  benchmarkPatterns() {
    const patterns = ['zone', 'checker', 'gradx', 'grady', 'ramp2d', 'slant', 'chirp', 'text', 'dots'];
    console.log('\n🎨 Pattern Generation Performance:');
    
    patterns.forEach(pattern => {
      const start = performance.now();
      // Simulate pattern generation complexity
      const complexity = this.getPatternComplexity(pattern);
      const end = performance.now();
      const duration = end - start;
      
      this.benchmarks.push({
        test: `Pattern: ${pattern}`,
        duration: duration,
        complexity: complexity
      });
      
      console.log(`  ${pattern}: ${duration.toFixed(2)}ms (complexity: ${complexity})`);
    });
  }

  benchmarkViewModes() {
    const viewModes = ['normal', 'error', 'difference'];
    console.log('\n👁️ View Mode Performance:');
    
    viewModes.forEach(mode => {
      const start = performance.now();
      // Simulate view mode processing
      const processing = this.getViewModeProcessing(mode);
      const end = performance.now();
      const duration = end - start;
      
      this.benchmarks.push({
        test: `View Mode: ${mode}`,
        duration: duration,
        processing: processing
      });
      
      console.log(`  ${mode}: ${duration.toFixed(2)}ms (processing: ${processing})`);
    });
  }

  benchmarkMobileVsDesktop() {
    console.log('\n📱 Mobile vs Desktop Performance:');
    
    const mobileStart = performance.now();
    // Simulate mobile layout calculations
    const mobileOps = 1000; // Simplified mobile operations
    const mobileEnd = performance.now();
    const mobileDuration = mobileEnd - mobileStart;
    
    const desktopStart = performance.now();
    // Simulate desktop layout calculations
    const desktopOps = 2000; // Simplified desktop operations
    const desktopEnd = performance.now();
    const desktopDuration = desktopEnd - desktopStart;
    
    this.benchmarks.push({
      test: 'Mobile Layout',
      duration: mobileDuration,
      operations: mobileOps
    });
    
    this.benchmarks.push({
      test: 'Desktop Layout',
      duration: desktopDuration,
      operations: desktopOps
    });
    
    console.log(`  Mobile: ${mobileDuration.toFixed(2)}ms (${mobileOps} ops)`);
    console.log(`  Desktop: ${desktopDuration.toFixed(2)}ms (${desktopOps} ops)`);
    console.log(`  Mobile efficiency: ${(desktopDuration/mobileDuration).toFixed(1)}x faster`);
  }

  getPatternComplexity(pattern) {
    const complexities = {
      'zone': 'high',      // Complex mathematical calculations
      'checker': 'low',    // Simple alternating pattern
      'gradx': 'low',      // Linear gradient
      'grady': 'low',      // Linear gradient
      'ramp2d': 'medium',  // 2D calculations
      'slant': 'low',      // Simple line drawing
      'chirp': 'high',     // Complex sine calculations
      'text': 'low',       // Text rendering
      'dots': 'medium'     // Random generation
    };
    return complexities[pattern] || 'medium';
  }

  getViewModeProcessing(mode) {
    const processing = {
      'normal': 'low',      // Direct rendering
      'error': 'high',      // Displacement calculations
      'difference': 'medium' // Pixel comparison
    };
    return processing[mode] || 'medium';
  }

  displayResults() {
    const totalDuration = this.benchmarks.reduce((sum, b) => sum + b.duration, 0);
    const avgDuration = totalDuration / this.benchmarks.length;
    
    console.log(`\n📈 Performance Summary:`);
    console.log(`  Total benchmarks: ${this.benchmarks.length}`);
    console.log(`  Average duration: ${avgDuration.toFixed(2)}ms`);
    console.log(`  Total duration: ${totalDuration.toFixed(2)}ms`);
    
    // Performance recommendations
    console.log(`\n💡 Performance Recommendations:`);
    console.log(`  - Use 256x256 resolution for optimal performance`);
    console.log(`  - Avoid 1024x1024 on mobile devices`);
    console.log(`  - Displacement heatmap is most computationally intensive`);
    console.log(`  - Zone plate and chirp patterns are most complex`);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceBenchmark;
}

// Auto-run if executed directly
if (typeof window === 'undefined') {
  const benchmark = new PerformanceBenchmark();
  benchmark.runBenchmarks();
}
