import { Application, TSConfigReader, TypeDocReader } from 'typedoc';

/**
 * Advanced TypeDoc configuration for module-based documentation
 * This file provides more control over the documentation generation process
 */
export function configureTypeDoc(app: Application) {
  app.options.addReader(new TSConfigReader());
  app.options.addReader(new TypeDocReader());

  // Set compiler options
  app.options.setValue('compilerOptions', {
    module: 'commonjs',
    target: 'es2020',
    lib: ['es2020'],
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true
  });

  // Custom module categorization
  app.converter.addUnknownSymbolResolver((ref) => {
    // Custom logic for resolving unknown symbols
    return undefined;
  });
}

/**
 * Module-specific documentation configurations
 */
export const moduleConfigs = {
  core: {
    name: 'Core Module',
    entryPoints: ['./src/core'],
    categoryOrder: ['Main', 'Utilities', 'Types', '*']
  },
  utils: {
    name: 'Utilities Module',
    entryPoints: ['./src/utils'],
    categoryOrder: ['String', 'Array', 'Object', 'Date', '*']
  },
  components: {
    name: 'Components Module',
    entryPoints: ['./src/components'],
    categoryOrder: ['UI', 'Layout', 'Forms', '*']
  },
  services: {
    name: 'Services Module',
    entryPoints: ['./src/services'],
    categoryOrder: ['API', 'Auth', 'Storage', '*']
  }
};

/**
 * Documentation tags for better organization
 * Use these in your code comments:
 *
 * @module ModuleName - Defines module membership
 * @category CategoryName - Groups related items
 * @since version - Indicates when feature was added
 * @deprecated - Marks deprecated features
 * @internal - Excludes from public docs
 * @example - Provides usage examples
 * @remarks - Additional implementation notes
 * @see - Cross-references to related items
 */

/**
 * Example module documentation
 * @module Core
 * @category Main
 */
export class ExampleClass {
  /**
   * Example method with full documentation
   * @param input - The input parameter
   * @returns The processed result
   * @since 1.0.0
   * @example
   * ```typescript
   * const example = new ExampleClass();
   * const result = example.process('test');
   * console.log(result); // 'Processed: test'
   * ```
   * @see {@link ExampleInterface}
   */
  process(input: string): string {
    return `Processed: ${input}`;
  }
}

/**
 * Example interface documentation
 * @module Core
 * @category Types
 */
export interface ExampleInterface {
  /** Unique identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Optional description */
  description?: string;
}
