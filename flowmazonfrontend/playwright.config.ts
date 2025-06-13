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
    baseURL: process.env.LCT
      ? //First option is the Next.js app's baseURL to use
        //when Playwright tests are run
        //against Next.js app container as part of
        //Local Continuous Testing (contianer for the Next.js
        //app and API app and database would be created
        //by Docker Compose and defined in compose.yaml)
        'http://localhost:4000'
      : 'http://localhost:3010', //THIS second option
    // is the baseURL that would be used when you run a
    // Playwright test manually using the Sidebar or
    // Playwright's standalone UI Mode

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
      //USE THIS PROJECT AS FOLLOWS:
      //
      //1. SELECT this project in Playwright section of
      //Testing sidebar.
      //Make sure other projects are deselcted.
      //
      //2. Launch this workspace in a separate instance of VS Code
      //by going to "File" menu, then select "Duplicate Workspace".
      //
      //3. In the separate instance, got to "Run and Debug" sidebar,
      // (Ctrl+D is the shortcut), then select a debug
      //configuartion, e.g. the "Frontend/Backend" launch
      //configuration for full-stack debugging, and press Run (F5).
      //Set any breakpoints you want to be hit when Playwright tests
      //are run.
      //
      //4. Now in the original instance of VS Code, Run or Debug
      //a Playwright test from Testing sidebar. Your breakpoints
      //in the app in the other instance of VS Code would be hit.
      //
      //IF YOU ENCOUNTER A BUILD ISSUE WHEN STARTING LAUNCH
      //CONFIGURATION IN OTHER INSTANCE OF VS CODE,
      //this could be because the webServer from
      //Playwright configuration is hanging around in the original
      // instance which locks .NET compile output.
      //
      //TO GET AROUND IT, CLOSE WEBSERVER BY RELOADING VS CODE,
      //then restart the launch configuration in the second
      //VS Code instance.
      //
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
  //

  webServer: !process.env.LCT
    ? //we are testing in VS Code or in CI
      {
        command:
          //--no-launch-profile in the `dotnet run` command below ensures that
          //a launch profile would not be loaded in `Properties\launchSettings.json`
          //within the folder of the project being launched.
          //Somehow this is the highest priority config source that even overrides
          //ASPNETCORE_URLS provided on the command line (as we do below)!
          'npx concurrently --names "FRONTEND,BACKEND" --prefix-colors "blue,magenta" --kill-others "npx cross-env NEXT_PUBLIC_BACKEND_URL=http://localhost:3012 npx next dev --port 3010" "cross-env ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://localhost:3012 ALLOWED_CORS_ORIGINS=http://localhost:3010 dotnet run --no-launch-profile --project ../flowmazonbackend/flowmazonapi/flowmazonapi.csproj"',
        url: 'http://localhost:3012/health/ready', //API project takes longer to start. just a hack, as we should (somehow) be waiting on both
        //frontend and backend URLs

        //
        //reuseExistingServer basically means
        //that if the web server, whose `command`
        //is defined above, is already running - as determined
        //by the address specified in `url` above being
        //available - when Playwright is launched, then
        //Playwright would throw an error.
        //
        //Reusing existing server in CI is a moot point
        //but perhaps it's not a bad idea to ensure that
        //when Playwright runs in CI, it is able to start
        //with a fresh build and launch of the code under test
        //and otherwise throws an error (if the
        //webserver is already running)
        //
        //The value given, which is the default in
        //autogenerated playwright config file, makes
        //sense for local runs BECAUSE IF YOU RUN
        //A TEST THROUGH TESTING SIDEBAR IN VS CODE
        //then Playwright's VS Code extension (that
        //makes the tests available to run in Testing
        //sidebar) leaves the web server running. So if you
        //set this option to false for local runs also, then
        //after the first execution, a subsequent test run
        //locally in VS Code would throw an error.
        //
        //If you must restart the web server once you have run
        //a test through testing sidebar, I have found
        //that "Reload Window" from the Command Pallette
        //kills off the web server.
        reuseExistingServer: !process.env.CI,
      }
    : undefined, //no need to run web server in Local
  //Continuous Testing mode when it would have been started
  //in watch mod already by `docker compose up --watch`,
});
