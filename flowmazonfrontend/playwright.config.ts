import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2etests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only.
   1 retry is enough, tsts shouldn't be THAT flaky! */
  retries: process.env.CI ? 1 : 0,
  /*In CI, if there are 10 failures then the whole test suite
  run should be aborted */
  maxFailures: process.env.CI ? 10 : undefined,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4000', //Docker Compose is running an NExt,je container at this address

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retry-with-trace',
    screenshot: 'only-on-failure',
    video: 'retry-with-video',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      //USE THIS POJECT AS DESCRIBED IN README

      name: 'test against Frontend/Backend launch config',
      use: {
        baseURL: 'http://localhost:3020',
        ...devices['Desktop Chrome'],
      },
    },
    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  //`docker compose up --watch`
  //would rebuild a restart a single container whose
  //watched source directory has changed, and not the
  //containers that depend on it.
  //
  //Therefore, when restarting a test run because source
  //files changed, I need to wait for both the frontend's
  //and the backend's URLs to be available because either
  //of those could be being rebuilt in parallel by
  //docker compose up --watch
  //
  //Therefore I cannot use `url` option in `webServer`
  //as it cannot be given an array of url's to wait for
  //and will need to use wait-on NPM package in a
  //script ni pacakge.json. This means I will also
  //need to monitor the files myself using
  //onchange which is just as well because I cannot
  //use Playwright's watch mode as it only watches
  //for changes to test file and not other (source) files
  //in the app folder.
  //
  //If I am going to do onchange and wait-on myself
  //then I need to launch `docker compose up --watch`
  //concurrently self also so I the URL's I would wait on
  //would become available so I can move on to relanuch
  //the Playwright test suite.
  //
  //THEREFORE, webServer has no use for me for local
  //continuous testing. Hence I also see not use
  //for it for other purposes (e.g. in CI pipeline runs)
  //
  //Since I run manually run tests against the full stack
  //running for Local Continuous Testing, even for that
  //webServer should already be running and therefore
  //does not need to be run.
  //
  //TODO: Note that if in the future we need to run
  //frontend and backend instances for manually invoked
  //tests separately from LCT, the best thing might
  //be to run containers against db running not
  //in a container but on local machine. This means
  //after the tests are run data can be inspected
  //but frontend and backend app build and execution
  //does not step over .NET Integration tests where
  //build output gets locked during build process,
  //OR we would need to create seaprate _profiles_
  //e.g. a "Test" profile in addition to "Release"
  //and "Debug" so build output of .NET projects
  //goes into a separate `bin\Test` folder.
  //this is the only way of specifying a directly for
  //build output and no command line switch to
  //do this exists.
  webServer: undefined,
});
