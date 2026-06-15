# Use the official .NET 9.0 ASP.NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Use the official .NET 9.0 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["PeopleCoreLandingPage.csproj", "./"]
RUN dotnet restore "./PeopleCoreLandingPage.csproj"

# Copy the rest of the source code and build
COPY . .
WORKDIR "/src/."
RUN dotnet build "PeopleCoreLandingPage.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "PeopleCoreLandingPage.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PeopleCoreLandingPage.dll"]
