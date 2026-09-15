# Docker Infrastructure and Containerization

Container configurations, production multi-stage Dockerfiles, and local orchestration services for the sysTROL Industrial Engineering Platform.

---

## Architecture

The platform uses Docker and Docker Compose for both local development dependencies and production artifact builds:

- `docker/Dockerfile.api`: Multi-stage build for the Fastify REST API backend and BullMQ worker.
- `docker/Dockerfile.internal`: Multi-stage build for the Next.js 15 internal ERP dashboard (standalone output mode).
- `docker-compose.yml`: Root compose definition running PostgreSQL, Redis, MinIO S3 storage, and the API service.

---

## Directory Structure

```
docker/
├── Dockerfile.api             # Multi-stage production container for API
├── Dockerfile.internal        # Multi-stage production container for Internal ERP
└── README.md                  # Docker operations and reference guide
```

---

## Local Development Stack

Run supporting services locally via Docker Compose from repository root:

```bash
# Start database, cache, and object storage services
docker compose up -d postgres redis minio

# View status of running containers
docker compose ps

# View service logs
docker compose logs -f postgres
docker compose logs -f minio

# Stop all local containers
docker compose down
```

### Services and Ports

| Service | Container Name | Host Port | Internal Port | Persistent Volume |
|---|---|---|---|---|
| PostgreSQL 16 | `systrol_postgres` | `5432` | `5432` | `postgres_data` |
| Redis 7 | `systrol_redis` | `6379` | `6379` | `redis_data` |
| MinIO (S3 API) | `systrol_minio` | `9000` | `9000` | `minio_data` |
| MinIO Console | `systrol_minio` | `9001` | `9001` | `minio_data` |
| Fastify API | `systrol_api` | `4000` | `4000` | - |

---

## Building Production Containers

### API Container
Build the backend container from repository root:

```bash
docker build -f docker/Dockerfile.api -t systrol-api:latest .
```

Run the container:
```bash
docker run -p 4000:4000 \
  -e DATABASE_URL="postgresql://systrol:systrol_secret_password@host.docker.internal:5432/systrol_erp?schema=public" \
  -e REDIS_URL="redis://host.docker.internal:6379" \
  -e JWT_SECRET="production-super-secret-jwt-key-32chars-min" \
  -e JWT_REFRESH_SECRET="production-super-secret-refresh-key-32chars" \
  systrol-api:latest
```

### Internal ERP Web Container
Build the internal Next.js application:

```bash
docker build -f docker/Dockerfile.internal -t systrol-internal:latest .
```

Run the container:
```bash
docker run -p 3001:3001 \
  -e NEXT_PUBLIC_API_URL="http://localhost:4000" \
  systrol-internal:latest
```
