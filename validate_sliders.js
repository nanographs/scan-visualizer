/**
 * Slider Validation Test Suite
 * 
 * This module provides functions to validate all slider functionality
 * and prevent regressions. Run these tests after any slider changes.
 */

// Import conversion functions (these should match the main application)
function sliderToBandwidth(sliderValue) {
  const minBw = 1;
  const maxBw = 1000;
  const ratio = maxBw / minBw;
  return minBw * Math.pow(ratio, sliderValue / 100);
}

function bandwidthToSlider(bandwidthValue) {
  const minBw = 1;
  const maxBw = 1000;
  const ratio = maxBw / minBw;
  return 100 * (Math.log(bandwidthValue / minBw) / Math.log(ratio));
}

function sliderToSlewRate(sliderValue) {
  const minSlew = 0.001;
  const maxSlew = 1.0;
  const ratio = maxSlew / minSlew;
  return minSlew * Math.pow(ratio, sliderValue / 100);
}

function slewRateToSlider(slewRateValue) {
  const minSlew = 0.001;
  const maxSlew = 1.0;
  const ratio = maxSlew / minSlew;
  return 100 * (Math.log(slewRateValue / minSlew) / Math.log(ratio));
}

/**
 * Test suite for slider functionality
 */
class SliderValidator {
  constructor() {
    this.tests = [];
    this.results = [];
  }

  /**
   * Run all slider validation tests
   */
  runAllTests() {
    console.log('🧪 Running Slider Validation Tests...\n');
    
    this.testBandwidthDefaults();
    this.testSlewRateDefaults();
    this.testBandwidthExponentialScaling();
    this.testSlewRateExponentialScaling();
    this.testBidirectionalConversion();
    this.testEdgeCases();
    
    this.displayResults();
    return this.allTestsPassed();
  }

  /**
   * Test that default values are correct
   */
  testBandwidthDefaults() {
    const sliderValue = 43;
    const expectedBandwidth = 20;
    const actualBandwidth = sliderToBandwidth(sliderValue);
    const tolerance = 1;
    
    this.addTest(
      'Bandwidth Default Value',
      `Slider ${sliderValue} should give ${expectedBandwidth} kHz`,
      expectedBandwidth,
      actualBandwidth,
      tolerance
    );
  }

  testSlewRateDefaults() {
    const sliderValue = 57;
    const expectedSlewRate = 0.05;
    const actualSlewRate = sliderToSlewRate(sliderValue);
    const tolerance = 0.005;
    
    this.addTest(
      'Slew Rate Default Value',
      `Slider ${sliderValue} should give ${expectedSlewRate} FS/μs`,
      expectedSlewRate,
      actualSlewRate,
      tolerance
    );
  }

  /**
   * Test bandwidth exponential scaling at key points
   */
  testBandwidthExponentialScaling() {
    const testCases = [
      { slider: 0, expected: 1, tolerance: 0.1, description: 'Min bandwidth' },
      { slider: 25, expected: 5.6, tolerance: 0.5, description: 'Low bandwidth' },
      { slider: 50, expected: 31.6, tolerance: 1, description: 'Mid bandwidth' },
      { slider: 75, expected: 177.8, tolerance: 5, description: 'High bandwidth' },
      { slider: 100, expected: 1000, tolerance: 1, description: 'Max bandwidth' }
    ];

    testCases.forEach(testCase => {
      const actual = sliderToBandwidth(testCase.slider);
      this.addTest(
        `Bandwidth Scaling - ${testCase.description}`,
        `Slider ${testCase.slider} → ${actual.toFixed(1)} kHz`,
        testCase.expected,
        actual,
        testCase.tolerance
      );
    });
  }

  /**
   * Test slew rate exponential scaling at key points
   */
  testSlewRateExponentialScaling() {
    const testCases = [
      { slider: 0, expected: 0.001, tolerance: 0.0001, description: 'Min slew rate' },
      { slider: 25, expected: 0.0056, tolerance: 0.0005, description: 'Low slew rate' },
      { slider: 50, expected: 0.0316, tolerance: 0.001, description: 'Mid slew rate' },
      { slider: 75, expected: 0.178, tolerance: 0.01, description: 'High slew rate' },
      { slider: 100, expected: 1.0, tolerance: 0.01, description: 'Max slew rate' }
    ];

    testCases.forEach(testCase => {
      const actual = sliderToSlewRate(testCase.slider);
      this.addTest(
        `Slew Rate Scaling - ${testCase.description}`,
        `Slider ${testCase.slider} → ${actual.toFixed(3)} FS/μs`,
        testCase.expected,
        actual,
        testCase.tolerance
      );
    });
  }

  /**
   * Test bidirectional conversion (slider → value → slider)
   */
  testBidirectionalConversion() {
    const testCases = [
      { name: 'Bandwidth', value: 20, sliderToValue: sliderToBandwidth, valueToSlider: bandwidthToSlider },
      { name: 'Bandwidth', value: 100, sliderToValue: sliderToBandwidth, valueToSlider: bandwidthToSlider },
      { name: 'Slew Rate', value: 0.05, sliderToValue: sliderToSlewRate, valueToSlider: slewRateToSlider },
      { name: 'Slew Rate', value: 0.1, sliderToValue: sliderToSlewRate, valueToSlider: slewRateToSlider }
    ];

    testCases.forEach(testCase => {
      const sliderPos = testCase.valueToSlider(testCase.value);
      const backToValue = testCase.sliderToValue(sliderPos);
      const tolerance = testCase.name.includes('Bandwidth') ? 1 : 0.01;
      
      this.addTest(
        `${testCase.name} Bidirectional Conversion`,
        `${testCase.value} → slider ${sliderPos.toFixed(1)} → ${backToValue.toFixed(3)}`,
        testCase.value,
        backToValue,
        tolerance
      );
    });
  }

  /**
   * Test edge cases and boundary conditions
   */
  testEdgeCases() {
    // Test that slider 0 gives minimum values
    this.addTest(
      'Bandwidth Minimum',
      'Slider 0 should give 1 kHz',
      1,
      sliderToBandwidth(0),
      0.1
    );

    this.addTest(
      'Slew Rate Minimum',
      'Slider 0 should give 0.001 FS/μs',
      0.001,
      sliderToSlewRate(0),
      0.0001
    );

    // Test that slider 100 gives maximum values
    this.addTest(
      'Bandwidth Maximum',
      'Slider 100 should give 1000 kHz',
      1000,
      sliderToBandwidth(100),
      1
    );

    this.addTest(
      'Slew Rate Maximum',
      'Slider 100 should give 1.0 FS/μs',
      1.0,
      sliderToSlewRate(100),
      0.01
    );
  }

  /**
   * Add a test to the suite
   */
  addTest(name, description, expected, actual, tolerance) {
    const passed = Math.abs(actual - expected) <= tolerance;
    const test = {
      name,
      description,
      expected,
      actual,
      tolerance,
      passed
    };
    
    this.tests.push(test);
    this.results.push(test);
    
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${name}: ${description}`);
    if (!passed) {
      console.log(`  Expected: ${expected}, Actual: ${actual}, Tolerance: ${tolerance}`);
    }
  }

  /**
   * Display test results summary
   */
  displayResults() {
    const passed = this.tests.filter(test => test.passed).length;
    const total = this.tests.length;
    const allPassed = passed === total;
    
    console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
    
    if (allPassed) {
      console.log('🎉 All slider tests passed! ✅');
    } else {
      console.log('⚠️  Some tests failed. Check the output above for details.');
      const failedTests = this.tests.filter(test => !test.passed);
      console.log('\nFailed tests:');
      failedTests.forEach(test => {
        console.log(`  ❌ ${test.name}: Expected ${test.expected}, got ${test.actual}`);
      });
    }
    
    return allPassed;
  }

  /**
   * Check if all tests passed
   */
  allTestsPassed() {
    return this.tests.every(test => test.passed);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SliderValidator, sliderToBandwidth, bandwidthToSlider, sliderToSlewRate, slewRateToSlider };
}

// Auto-run tests if this script is executed directly
if (typeof window === 'undefined') {
  const validator = new SliderValidator();
  const success = validator.runAllTests();
  process.exit(success ? 0 : 1);
}
