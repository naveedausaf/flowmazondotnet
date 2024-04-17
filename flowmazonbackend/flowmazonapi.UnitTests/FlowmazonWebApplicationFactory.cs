
using System.Data.Common;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;

namespace flowmazonapi.UnitTests;

public class FlowmazonWebApplicationFactory : WebApplicationFactory<Program>
{



    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {


        //Remove the DbContext just to be sure it's not being used
        builder.ConfigureServices((webHostBuilderContext, services) =>
                {

                    var dbContextDescriptor = services.SingleOrDefault(
                d => d.ServiceType ==
                    typeof(DbContextOptions<FlowmazonDbContext>));

                    if (dbContextDescriptor is not null)
                    {
                        services.Remove(dbContextDescriptor);
                    }

                    var dbConnectionDescriptor = services.SingleOrDefault(
                        d => d.ServiceType ==
                            typeof(DbConnection));
                    if (dbConnectionDescriptor != null)
                    {
                        services.Remove(dbConnectionDescriptor);
                    }

                    //we put in a dummy Flowmazon contrext otherwise 
                    //container complains on build. I don;t want to
                    //suppress teh complaints by switching ValidateScopes
                    //and ValidateOnBuild off. They are only on in Development
                    //environment (which is waht I use in testing) and form 
                    //a good sanity check.

                    //but we do want mock services
                    //which we will do in individual tests


                });



    }



}