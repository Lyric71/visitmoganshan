// One place to start a browser for the stays scripts.
//
// Every capture script runs the Google Chrome installed on this machine, not
// the Chromium build that Playwright downloads. Trip.com treats the two
// differently: the bundled build is recognisable as an automation binary and
// meets the sign in wall far more often, while a real Chrome with the
// automation flag hidden is served the ordinary page.
//
// Resolution order:
//   1. CHROME_PATH in the environment, if set, is used as the executable.
//   2. Otherwise Playwright's "chrome" channel, which finds the stable Chrome
//      wherever the platform installs it.
//
// A missing Chrome is an error here rather than a silent fall back to the
// bundled Chromium, because a pass that quietly changed browsers would be
// blocked in ways the log could not explain.

import { existsSync } from 'node:fs';
import process from 'node:process';

/** Start Chrome. `headful` shows the window, for when a selector has moved. */
export async function launchChrome({ headful = false } = {}) {
  const { chromium } = await import('playwright');
  const options = {
    headless: !headful,
    args: ['--disable-blink-features=AutomationControlled'],
  };
  const explicit = process.env.CHROME_PATH;
  if (explicit) {
    if (!existsSync(explicit)) {
      throw new Error(`CHROME_PATH points at ${explicit}, which does not exist.`);
    }
    options.executablePath = explicit;
  } else {
    options.channel = 'chrome';
  }
  try {
    return await chromium.launch(options);
  } catch (error) {
    throw new Error(
      `Could not start Google Chrome (${explicit ? explicit : 'channel "chrome"'}). ` +
        'Install Chrome or set CHROME_PATH to its executable. ' +
        `Playwright said: ${error.message.split('\n')[0]}`,
    );
  }
}
