# Docker and CI/CD Learning Guide

This project uses Docker and GitHub Actions as a learning path for reproducible delivery. The first target is CI. CD remains optional until a deployment provider is selected.

## Docker Scope

The image packages the Next.js application in production mode. Supabase is an external service and is not included in the image. Redis is intentionally not part of the MVP.

The image must:

- Use a supported Node.js runtime.
- Install dependencies from the lockfile.
- Build the application in a separate build stage.
- Run with a non-development start command.
- Receive environment configuration at runtime.
- Never contain `.env.local`, credentials, or service-role keys.

## Local Docker Learning Steps

1. Build the image:

   ```bash
   docker build -t finledger:local .
   ```

2. Run it with local environment values supplied at runtime:

   ```bash
   docker run --rm -p 3000:3000 --env-file .env.local finledger:local
   ```

3. Open `http://localhost:3000` and verify the application starts.

Do not commit the environment file. Do not bake environment values into the Docker image.

## CI Pipeline

GitHub Actions should run on pull requests and pushes to `main`. The baseline pipeline is:

```text
checkout
→ setup Node.js
→ npm ci
→ lint
→ typecheck
→ test
→ build
→ docker build
```

The Docker build only verifies that the image can be produced. It does not require production secrets.

## CD Roadmap

CD will be added after selecting a deployment target such as Railway, Render, or another container platform. The deployment process must:

- Store environment variables in the provider secret manager.
- Build from a reviewed commit or CI artifact.
- Run the production image.
- Keep Supabase credentials out of logs and source control.
- Provide a rollback path.

Until a target is selected, do not add deployment-specific credentials or configuration.
