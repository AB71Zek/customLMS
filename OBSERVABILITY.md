# OpenTelemetry Observability Stack

This document explains the observability services included in the Custom LMS Escape Room application.

## Services Overview

### 1. **Jaeger** (Distributed Tracing)
- **URL**: http://localhost:16686
- **Purpose**: Visualize distributed traces across microservices
- **Features**: 
  - Trace visualization
  - Service dependency mapping
  - Performance analysis
  - Error tracking

### 2. **Zipkin** (Alternative Tracing)
- **URL**: http://localhost:9411
- **Purpose**: Alternative distributed tracing system
- **Features**:
  - Trace collection and visualization
  - Service topology
  - Latency analysis

### 3. **OpenTelemetry Collector** (Data Pipeline)
- **Purpose**: Collect, process, and export telemetry data
- **Endpoints**:
  - OTLP gRPC: `4317`
  - OTLP HTTP: `4318`
  - Health Check: `13133`
  - Metrics: `8888`
  - Prometheus Exporter: `8889`
  - pprof: `1888`
  - zpages: `55679`

### 4. **Prometheus** (Metrics Collection)
- **URL**: http://localhost:9090
- **Purpose**: Metrics collection and alerting
- **Features**:
  - Time-series database
  - Query language (PromQL)
  - Alerting rules
  - Service discovery

## Architecture Flow

```
Frontend/Backend Apps
        ↓ (OTLP)
OpenTelemetry Collector
        ↓
    ┌─────────┬─────────┐
    ↓         ↓         ↓
  Jaeger   Zipkin   Prometheus
```

## Configuration Files

### `otel-collector-config.yaml`
- Configures data receivers, processors, and exporters
- Sets up pipelines for traces and metrics
- Defines service extensions (health check, pprof, zpages)

### `prometheus.yaml`
- Scrape configuration for metrics collection
- Targets all services for monitoring
- Defines scrape intervals and paths

## Environment Variables

### Frontend & Backend Services
```yaml
OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
OTEL_SERVICE_NAME: customlms-frontend/customlms-backend
OTEL_RESOURCE_ATTRIBUTES: service.name=...,service.version=1.0.0
NEXT_OTEL_VERBOSE: 1
```

## Usage Instructions

### 1. **Start the Stack**
```bash
docker-compose up --build
```

### 2. **Access Observability Tools**

#### Jaeger UI
- Navigate to: http://localhost:16686
- View traces from your application
- Search by service name: `customlms-frontend` or `customlms-backend`

#### Zipkin UI
- Navigate to: http://localhost:9411
- Alternative trace visualization
- Service dependency analysis

#### Prometheus
- Navigate to: http://localhost:9090
- Query metrics using PromQL
- View service targets and health

#### OpenTelemetry Collector
- Health check: http://localhost:13133
- Metrics: http://localhost:8888/metrics
- Prometheus exporter: http://localhost:8889/metrics

### 3. **View Application Traces**

1. **Generate Activity**: Use the escape room application
2. **Check Jaeger**: Look for traces from `customlms-frontend` and `customlms-backend`
3. **Analyze Performance**: View trace spans and timing
4. **Debug Issues**: Identify bottlenecks and errors

### 4. **Monitor Metrics**

1. **Access Prometheus**: http://localhost:9090
2. **Query Metrics**: Use PromQL to query application metrics
3. **Set Up Alerts**: Configure alerting rules for critical metrics

## Custom Metrics

The application generates custom metrics for:
- Room creation events
- User interactions
- API response times
- Database query performance
- Error rates

## Troubleshooting

### Common Issues

1. **No Traces in Jaeger**
   - Check if OpenTelemetry Collector is running
   - Verify OTLP endpoint configuration
   - Check application logs for instrumentation errors

2. **Prometheus Not Scraping**
   - Verify service targets are up
   - Check scrape configuration
   - Ensure metrics endpoints are accessible

3. **High Memory Usage**
   - Adjust batch processor settings in collector config
   - Reduce scrape intervals in Prometheus
   - Monitor collector health endpoint

### Health Checks

- **Collector Health**: http://localhost:13133
- **Prometheus Targets**: http://localhost:9090/targets
- **Service Status**: `docker-compose ps`

## Performance Considerations

- **Batch Processing**: Configured for optimal throughput
- **Memory Limits**: Set to prevent OOM issues
- **Scrape Intervals**: Balanced between detail and performance
- **Retention**: Configure based on storage requirements

## Security Notes

- Services are exposed on localhost for development
- In production, configure proper authentication
- Use TLS for secure communication
- Restrict network access as needed
