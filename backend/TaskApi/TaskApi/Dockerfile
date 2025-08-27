# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /out /p:UseAppHost=false

# Runtime stage (non-root)
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
# Disable diagnostics in prod for smaller mem footprint
ENV DOTNET_EnableDiagnostics=0
# Create non-root user
RUN useradd -u 10001 appuser && mkdir -p /app/data && chown -R appuser:appuser /app
COPY --from=build /out .
USER appuser
VOLUME ["/app/data"]
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/swagger >/dev/null || exit 1
ENTRYPOINT ["dotnet", "TaskApi.dll"]
