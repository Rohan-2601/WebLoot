import { runExtractionEngine } from './server/engine/index.js';
console.log(runExtractionEngine('<img src="    " />', 'https://example.com/page'));
