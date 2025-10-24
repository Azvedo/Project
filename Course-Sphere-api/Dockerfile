FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copy csproj(s) and restore as a distinct layer
# the build context is the Course-Sphere-api folder, so copy relative files
COPY *.sln ./
COPY *.csproj ./
COPY ./controllers/*.cs ./controllers/
COPY ./Dtos/*.cs ./Dtos/
COPY ./Models/*.cs ./Models/
COPY ./Repositories/*.cs ./Repositories/
COPY ./Services/*.cs ./Services/

RUN dotnet restore

# copy everything else and publish
COPY . ./
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
COPY --from=build /app/publish ./
ENTRYPOINT ["dotnet", "Course-Sphere-api.dll"]
