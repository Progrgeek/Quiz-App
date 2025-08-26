/**
 * Week 2 Day 8: Automated Style Migration Tool
 * Systematically replaces hardcoded styles with design tokens
 */

import { styleMigrationMap } from './styleMigration.js';

export class AutomatedStyleMigrator {
  /**
   * Apply style migrations to a file content string
   */
  static migrateFileContent(content) {
    let migratedContent = content;
    
    // Apply basic color token migrations
    const colorMigrations = {
      // Blue tokens
      'bg-blue-50': 'bg-primary-50',
      'bg-blue-100': 'bg-primary-100',
      'bg-blue-200': 'bg-primary-200',
      'bg-blue-400': 'bg-primary-400',
      'bg-blue-500': 'bg-primary-500',
      'bg-blue-600': 'bg-primary-600',
      'text-blue-500': 'text-primary-500',
      'text-blue-600': 'text-primary-600',
      'border-blue-400': 'border-primary-400',
      'border-blue-500': 'border-primary-500',
      'hover:bg-blue-100': 'hover:bg-primary-100',
      'hover:bg-blue-75': 'hover:bg-primary-75',
      'hover:text-blue-600': 'hover:text-primary-600',
      
      // Green tokens (success)
      'bg-green-100': 'bg-success-100',
      'bg-green-500': 'bg-success-500',
      'text-green-800': 'text-success-800',
      'border-green-500': 'border-success-500',
      
      // Red tokens (error)
      'bg-red-100': 'bg-error-100',
      'bg-red-500': 'bg-error-500',
      'text-red-800': 'text-error-800',
      'border-red-500': 'border-error-500',
      
      // Gray tokens (neutral)
      'bg-gray-50': 'bg-neutral-50',
      'bg-gray-100': 'bg-neutral-100',
      'text-gray-500': 'text-neutral-500',
      'text-gray-600': 'text-neutral-600',
      'text-gray-700': 'text-neutral-700',
      'border-gray-300': 'border-neutral-300',
      'border-gray-400': 'border-neutral-400',
      'hover:bg-gray-50': 'hover:bg-neutral-50',
      'hover:border-gray-400': 'hover:border-neutral-400'
    };
    
    // Apply migrations
    Object.entries(colorMigrations).forEach(([oldToken, newToken]) => {
      const regex = new RegExp(`\\b${oldToken}\\b`, 'g');
      migratedContent = migratedContent.replace(regex, newToken);
    });
    
    return migratedContent;
  }
  
  /**
   * Generate a migration report for a file
   */
  static generateMigrationReport(content) {
    const migrations = [];
    const colorMigrations = {
      'bg-blue-50': 'bg-primary-50',
      'bg-blue-100': 'bg-primary-100',
      'bg-blue-200': 'bg-primary-200',
      'bg-blue-500': 'bg-primary-500',
      'bg-blue-600': 'bg-primary-600',
      'text-blue-500': 'text-primary-500',
      'text-blue-600': 'text-primary-600',
      'border-blue-400': 'border-primary-400',
      'border-blue-500': 'border-primary-500',
      'bg-green-100': 'bg-success-100',
      'bg-red-100': 'bg-error-100',
      'text-gray-500': 'text-neutral-500',
      'text-gray-600': 'text-neutral-600',
      'text-gray-700': 'text-neutral-700'
    };
    
    Object.entries(colorMigrations).forEach(([oldToken, newToken]) => {
      const regex = new RegExp(`\\b${oldToken}\\b`, 'g');
      const matches = content.match(regex);
      if (matches) {
        migrations.push({
          from: oldToken,
          to: newToken,
          count: matches.length
        });
      }
    });
    
    return migrations;
  }
  
  /**
   * Extract hardcoded styles that need manual review
   */
  static extractHardcodedStyles(content) {
    const hardcodedPatterns = [
      // Hardcoded colors
      /className="[^"]*bg-(red|blue|green|yellow|purple|indigo|pink|gray)-\d+[^"]*/g,
      /className="[^"]*text-(red|blue|green|yellow|purple|indigo|pink|gray)-\d+[^"]*/g,
      /className="[^"]*border-(red|blue|green|yellow|purple|indigo|pink|gray)-\d+[^"]*/g,
      
      // Hardcoded spacing that could use design tokens
      /className="[^"]*p-\d+[^"]*/g,
      /className="[^"]*m-\d+[^"]*/g,
      /className="[^"]*px-\d+[^"]*/g,
      /className="[^"]*py-\d+[^"]*/g
    ];
    
    const findings = [];
    hardcodedPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern);
      if (matches) {
        findings.push({
          pattern: pattern.toString(),
          matches: matches,
          type: ['colors', 'colors', 'colors', 'spacing', 'spacing', 'spacing', 'spacing'][index]
        });
      }
    });
    
    return findings;
  }
}

export default AutomatedStyleMigrator;
