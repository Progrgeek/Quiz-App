// utils/ValidationTester.js - Comprehensive validation testing utility
import validationManager from './ValidationManager';

/**
 * Comprehensive testing utility for the validation system
 * Provides automated testing across all exercise types
 */
class ValidationTester {
  constructor() {
    this.testResults = [];
    this.availableExerciseTypes = [
      'dragAndDrop',
      'singleAnswer', 
      'multipleChoice',
      'multipleAnswers',
      'fillInTheBlanks',
      'gapFill',
      'highlight',
      'clickToChange',
      'sequencing',
      'rhymeExercises',
      'syllableCounting',
      'tableExercise'
    ];
  }

  // Load unified data for testing
  async loadUnifiedData(exerciseType) {
    try {
      const module = await import(`../components/${exerciseType}/unified${exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1)}Data.json`);
      return module.default;
    } catch (error) {
      console.error(`Failed to load unified data for ${exerciseType}:`, error);
      return null;
    }
  }

  // Test individual exercise type
  async testExerciseType(exerciseType) {
    const testStart = Date.now();
    console.log(`🧪 Testing validation for ${exerciseType}...`);

    try {
      // Load the data
      const data = await this.loadUnifiedData(exerciseType);
      if (!data) {
        return {
          exerciseType,
          success: false,
          error: 'Failed to load unified data',
          duration: Date.now() - testStart
        };
      }

      // Test validation
      const validationResult = await validationManager.validateExerciseType(exerciseType, data);
      
      const testResult = {
        exerciseType,
        success: validationResult.success,
        validationResult,
        dataInfo: {
          hasUI: !!data.ui,
          hasExamples: !!data.exampleContent,
          exerciseCount: data.exercises?.length || 0,
          uiButtonCount: Object.keys(data.ui?.buttons || {}).length,
          uiLabelCount: Object.keys(data.ui?.labels || {}).length,
          exampleSectionCount: data.exampleContent?.sections?.length || 0
        },
        duration: Date.now() - testStart
      };

      // Log results
      if (validationResult.success) {
        console.log(`✅ ${exerciseType} validation passed`, {
          duration: `${testResult.duration}ms`,
          exercises: testResult.dataInfo.exerciseCount
        });
      } else {
        console.log(`❌ ${exerciseType} validation failed`, {
          duration: `${testResult.duration}ms`,
          errors: validationResult.errors?.length || 0
        });
        
        // Log first few errors for debugging
        if (validationResult.errors?.length > 0) {
          console.log('First validation errors:', validationResult.errors.slice(0, 3));
        }
      }

      return testResult;

    } catch (error) {
      const errorResult = {
        exerciseType,
        success: false,
        error: error.message,
        duration: Date.now() - testStart
      };
      
      console.error(`💥 Test failed for ${exerciseType}:`, error);
      return errorResult;
    }
  }

  // Test all exercise types
  async testAllExerciseTypes() {
    console.log('🚀 Starting comprehensive validation tests...');
    const overallStart = Date.now();
    
    this.testResults = [];
    const summary = {
      total: this.availableExerciseTypes.length,
      passed: 0,
      failed: 0,
      errors: [],
      duration: 0
    };

    for (const exerciseType of this.availableExerciseTypes) {
      const result = await this.testExerciseType(exerciseType);
      this.testResults.push(result);

      if (result.success) {
        summary.passed++;
      } else {
        summary.failed++;
        summary.errors.push({
          exerciseType,
          error: result.error || 'Validation failed',
          errorCount: result.validationResult?.errors?.length || 0
        });
      }
    }

    summary.duration = Date.now() - overallStart;

    // Log overall results
    console.log('📊 Validation Test Summary:', {
      passed: `${summary.passed}/${summary.total}`,
      failed: summary.failed,
      duration: `${summary.duration}ms`,
      successRate: `${Math.round((summary.passed / summary.total) * 100)}%`
    });

    if (summary.failed > 0) {
      console.log('❌ Failed exercise types:', summary.errors);
    }

    return {
      summary,
      results: this.testResults,
      completedAt: new Date().toISOString()
    };
  }

  // Test specific data structure requirements
  async testDataStructureCompliance() {
    console.log('🔍 Testing data structure compliance...');
    
    const complianceResults = {};
    const requiredStructure = {
      ui: ['buttons', 'labels', 'messages'],
      exampleContent: ['title', 'description', 'sections', 'learningPoints'],
      exercises: 'array'
    };

    for (const exerciseType of this.availableExerciseTypes) {
      const data = await this.loadUnifiedData(exerciseType);
      if (!data) continue;

      const compliance = {
        exerciseType,
        hasRequiredStructure: true,
        missingElements: [],
        extraValidation: {}
      };

      // Check UI structure
      if (!data.ui) {
        compliance.hasRequiredStructure = false;
        compliance.missingElements.push('ui');
      } else {
        requiredStructure.ui.forEach(uiElement => {
          if (!data.ui[uiElement]) {
            compliance.missingElements.push(`ui.${uiElement}`);
          }
        });
      }

      // Check example content structure
      if (!data.exampleContent) {
        compliance.hasRequiredStructure = false;
        compliance.missingElements.push('exampleContent');
      } else {
        requiredStructure.exampleContent.forEach(element => {
          if (!data.exampleContent[element]) {
            compliance.missingElements.push(`exampleContent.${element}`);
          }
        });
      }

      // Check exercises
      if (!Array.isArray(data.exercises)) {
        compliance.hasRequiredStructure = false;
        compliance.missingElements.push('exercises (must be array)');
      } else {
        compliance.extraValidation.exerciseCount = data.exercises.length;
        compliance.extraValidation.exerciseTypes = [...new Set(data.exercises.map(ex => ex.type))];
      }

      // Final compliance check
      compliance.hasRequiredStructure = compliance.missingElements.length === 0;

      complianceResults[exerciseType] = compliance;
    }

    // Generate compliance summary
    const compliantTypes = Object.values(complianceResults).filter(r => r.hasRequiredStructure).length;
    const totalTypes = Object.keys(complianceResults).length;

    console.log(`📋 Data Structure Compliance: ${compliantTypes}/${totalTypes} types compliant`);

    return {
      summary: {
        compliant: compliantTypes,
        total: totalTypes,
        complianceRate: Math.round((compliantTypes / totalTypes) * 100)
      },
      results: complianceResults
    };
  }

  // Test validation performance
  async testValidationPerformance() {
    console.log('⚡ Testing validation performance...');
    
    const performanceResults = {};
    const iterations = 3; // Test each type multiple times

    for (const exerciseType of this.availableExerciseTypes) {
      const data = await this.loadUnifiedData(exerciseType);
      if (!data) continue;

      const times = [];
      
      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await validationManager.validateExerciseType(exerciseType, data);
        times.push(Date.now() - start);
      }

      performanceResults[exerciseType] = {
        iterations,
        times,
        average: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length),
        min: Math.min(...times),
        max: Math.max(...times),
        dataSize: JSON.stringify(data).length
      };
    }

    // Calculate overall performance metrics
    const allAverages = Object.values(performanceResults).map(r => r.average);
    const overallAverage = Math.round(allAverages.reduce((sum, avg) => sum + avg, 0) / allAverages.length);
    
    console.log(`⚡ Average validation time: ${overallAverage}ms`);

    return {
      summary: {
        overallAverage,
        fastestType: Object.keys(performanceResults).reduce((a, b) => 
          performanceResults[a].average < performanceResults[b].average ? a : b
        ),
        slowestType: Object.keys(performanceResults).reduce((a, b) => 
          performanceResults[a].average > performanceResults[b].average ? a : b
        )
      },
      results: performanceResults
    };
  }

  // Run comprehensive test suite
  async runFullTestSuite() {
    console.log('🎯 Running comprehensive validation test suite...');
    const suiteStart = Date.now();

    const results = {
      timestamp: new Date().toISOString(),
      validation: await this.testAllExerciseTypes(),
      compliance: await this.testDataStructureCompliance(),
      performance: await this.testValidationPerformance(),
      validationManager: {
        metrics: validationManager.getValidationMetrics(),
        cacheSize: validationManager.validationCache?.size || 0
      }
    };

    results.summary = {
      duration: Date.now() - suiteStart,
      validationPass: results.validation.summary.passed,
      validationTotal: results.validation.summary.total,
      complianceRate: results.compliance.summary.complianceRate,
      averageValidationTime: results.performance.summary.overallAverage
    };

    console.log('🎉 Test suite completed:', {
      duration: `${results.summary.duration}ms`,
      validationSuccess: `${results.summary.validationPass}/${results.summary.validationTotal}`,
      compliance: `${results.summary.complianceRate}%`,
      performance: `${results.summary.averageValidationTime}ms avg`
    });

    return results;
  }

  // Generate test report
  generateTestReport(testResults) {
    const report = {
      generatedAt: new Date().toISOString(),
      testSuite: 'Validation System Comprehensive Tests',
      results: testResults,
      recommendations: this.generateRecommendations(testResults)
    };

    return report;
  }

  generateRecommendations(testResults) {
    const recommendations = [];

    // Validation recommendations
    if (testResults.validation.summary.failed > 0) {
      recommendations.push({
        category: 'Validation',
        priority: 'high',
        message: `${testResults.validation.summary.failed} exercise types failed validation`,
        action: 'Review validation errors and fix data structure issues'
      });
    }

    // Compliance recommendations
    if (testResults.compliance.summary.complianceRate < 100) {
      recommendations.push({
        category: 'Compliance',
        priority: 'medium',
        message: `${100 - testResults.compliance.summary.complianceRate}% of types missing required structure elements`,
        action: 'Add missing UI, exampleContent, or exercise array elements'
      });
    }

    // Performance recommendations
    if (testResults.performance.summary.overallAverage > 100) {
      recommendations.push({
        category: 'Performance',
        priority: 'low',
        message: `Average validation time is ${testResults.performance.summary.overallAverage}ms`,
        action: 'Consider optimization if validation becomes a bottleneck'
      });
    }

    return recommendations;
  }

  // Export test results
  exportTestResults(testResults) {
    const report = this.generateTestReport(testResults);
    const blob = new Blob([JSON.stringify(report, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-test-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('📄 Test report exported');
    return report;
  }
}

// Create singleton instance
const validationTester = new ValidationTester();

// Development utilities
if (process.env.NODE_ENV === 'development') {
  window.validationTester = validationTester;
  
  // Add convenient global test function
  window.testValidation = async () => {
    const results = await validationTester.runFullTestSuite();
    validationTester.exportTestResults(results);
    return results;
  };
}

export default validationTester;
