FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

USER app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["flowmazonapi/flowmazonapi.csproj", "flowmazonapi/"]
RUN dotnet restore "flowmazonapi/flowmazonapi.csproj"
COPY . .
WORKDIR "/src/flowmazonapi"
RUN dotnet build "flowmazonapi.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "flowmazonapi.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --chown=app:app --from=publish /app/publish .
ENTRYPOINT ["dotnet", "flowmazonapi.dll"]   
