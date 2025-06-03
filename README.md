## Running the app in Debug mode

Use VS Code compund launch configuartion **Frontend/Backend** to run in debug mode. Just select from launch configurations dropdown it in Debug sidebar window (Ctrl), then whenever yo upress F5, the configuration will launch.

Bear in mind that to stop debugging with this compound configuration, yuo will need to press Shift+F5 twice and not once.

## Configuration

For details of configuration key/value pairs that need to be provided to each service, and how to provide these - e.g. using config files in local development but environment variables at build and/or run of deployment or containers - see the READMEs of respective services ([frontend app](./flowmazonfrontend/README.md) and [backend api](./flowmazonbackend/flowmazonapi/README.md)).

You can also check out any Docker compose files (see [compose.yaml](./compose.yaml) for local continuous testing using Playwright tests) and TestContainers-based code (in [API Integration Tests](./flowmazonbackend/flowmazonapi.IntegrationTests/)) for some examples of how config values are provided to the services.

## What I will do differently next time

- Use [Bogus](https://github.com/bchavez/Bogus) instead of [AutoFixture](https://github.com/AutoFixture/AutoFixture).

  - AutoFixture looks dated. Releases are infrequent (last one was 7 months before the date of this writing). [Documenation](https://github.com/AutoFixture/AutoFixture?tab=readme-ov-file#documentation) was updated in 2021 and many of the links mentioned in it contain very old posts.
  - AutoFixture is too basic. I was quite surprised to discover that despite how long it's been around, there [seems to be no out of the box way](https://autofixture.github.io/docs/quick-start/) of generating a number in a specified range. This makes it particular difficult to use with `Price` for example which is bounded by zero below and would almost have an upper limit also.

  Bogus not only doesn't have the problem above, it allows you to generate (semi-)meaningful test under within specified constraints really easy, and the code you write to do so would be really easy to read:

  ```csharp
  internal class ProductFaker : Faker<Product>
  {
      public ProductFaker()
      {
          RuleFor(p => p.Id, f => f.Random.Int(1, int.MaxValue));

          RuleFor(p => p.Name, f => f.Commerce.ProductName());
          RuleFor(p => p.Description, f => f.Lorem.Paragraph());
          RuleFor(p => p.Price, f => f.Finance.Amount(0, 5000));

      }
  }
  ```

  What's really great is that GitHub Pilot generated (almot all of) this code for me whereas when I was wrestling with AutoFixture, it was quiet. This may be something to do with how much Bogus-based (and possibly Faker-based; Bogus is a port of Faker.js) test code there is out there that LLMs have been trained on.
