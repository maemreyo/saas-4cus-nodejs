/**
 * Script to generate TypeDoc documentation for individual modules
 * Usage: npm run docs:generate:module -- --module=<module-name>
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const moduleArg = args.find(arg => arg.startsWith('--module='));

if (!moduleArg) {
  console.error('Error: Please specify a module using --module=<module-name>');
  console.log('Example: npm run docs:generate:module -- --module=core');
  console.log('\nAvailable modules:');

  // List available modules
  const srcPath = path.join(process.cwd(), 'src');
  if (fs.existsSync(srcPath)) {
    const modules = fs.readdirSync(srcPath)
      .filter(file => {
        const filePath = path.join(srcPath, file);
        return fs.statSync(filePath).isDirectory();
      });
    modules.forEach(module => console.log(`  - ${module}`));
  }

  process.exit(1);
}

const moduleName = moduleArg.split('=')[1];
const modulePath = path.join('src', moduleName);

// Check if module exists
if (!fs.existsSync(modulePath)) {
  console.error(`Error: Module "${moduleName}" not found at ${modulePath}`);
  process.exit(1);
}

// Create module-specific TypeDoc config
const moduleConfig = {
  entryPoints: [modulePath],
  entryPointStrategy: "expand",
  out: `docs/api/${moduleName}`,
  name: `${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Module API`,
  readme: fs.existsSync(path.join(modulePath, 'README.md'))
    ? path.join(modulePath, 'README.md')
    : './README.md',
  tsconfig: './tsconfig.json',
  exclude: [
    "**/node_modules/**",
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/tests/**"
  ],
  hideGenerator: true,
  includeVersion: true,
  categorizeByGroup: true,
  excludeInternal: true
};

// Write temporary config file
const tempConfigPath = `typedoc.${moduleName}.json`;
fs.writeFileSync(tempConfigPath, JSON.stringify(moduleConfig, null, 2));

try {
  console.log(`Generating documentation for module: ${moduleName}`);
  console.log(`Output directory: docs/api/${moduleName}`);

  // Clean output directory
  const outputDir = path.join('docs', 'api', moduleName);
  if (fs.existsSync(outputDir)) {
    execSync(`rimraf ${outputDir}`);
  }

  // Generate documentation
  execSync(`typedoc --options ${tempConfigPath}`, { stdio: 'inherit' });

  console.log(`\n✅ Documentation generated successfully!`);
  console.log(`📁 View at: ${outputDir}/index.html`);

  // Generate module index
  generateModuleIndex();

} catch (error) {
  console.error('Error generating documentation:', error.message);
  process.exit(1);
} finally {
  // Clean up temporary config file
  if (fs.existsSync(tempConfigPath)) {
    fs.unlinkSync(tempConfigPath);
  }
}

/**
 * Generate an index file listing all module documentations
 */
function generateModuleIndex() {
  const docsApiPath = path.join('docs', 'api');
  const indexPath = path.join(docsApiPath, 'modules-index.html');

  if (!fs.existsSync(docsApiPath)) {
    return;
  }

  const modules = fs.readdirSync(docsApiPath)
    .filter(file => {
      const filePath = path.join(docsApiPath, file);
      return fs.statSync(filePath).isDirectory() && file !== 'assets';
    });

  const indexContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Module Documentation Index</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
    h1 { color: #333; }
    .module-list {
      list-style: none;
      padding: 0;
    }
    .module-item {
      margin: 1rem 0;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      transition: box-shadow 0.2s;
    }
    .module-item:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .module-link {
      font-size: 1.2rem;
      text-decoration: none;
      color: #0066cc;
    }
    .module-path {
      color: #666;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
    .generated-date {
      color: #999;
      font-size: 0.8rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <h1>📚 Module Documentation Index</h1>
  <p>Generated API documentation for individual modules:</p>

  <ul class="module-list">
    ${modules.map(module => `
    <li class="module-item">
      <a href="./${module}/index.html" class="module-link">
        ${module.charAt(0).toUpperCase() + module.slice(1)} Module
      </a>
      <div class="module-path">Path: src/${module}</div>
    </li>
    `).join('')}
  </ul>

  <p class="generated-date">Generated on: ${new Date().toLocaleString()}</p>
</body>
</html>
  `;

  fs.writeFileSync(indexPath, indexContent);
  console.log(`\n📄 Module index generated at: ${indexPath}`);
}