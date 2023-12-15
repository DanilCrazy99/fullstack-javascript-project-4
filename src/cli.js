import { Command } from 'commander';
import pageLoader from './page-loader.js';

const commanderConfig = new Command();

commanderConfig
  .description(
    `Page loader utility.\n
For using this cli program you need write URL a website which you need to download.
Format for working: page-loader <URL> [-o <path to folder for saving>]`,
  )
  .version('0.0.2')
  .arguments('<url>')
  .option(
    '-o, --output <path>',
    'output dir',
    '/home/user/<current-dir>',
  )
  .action((url) => {
    pageLoader(url, commanderConfig.opts().output)
    // eslint-disable-next-line no-console
      .then((path) => console.log(`Path to HTML: ${path}`))
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(`CLI Error Output:\n${e.name}: ${e.message}`);
        process.exit(1);
      });
  });

export default commanderConfig;
