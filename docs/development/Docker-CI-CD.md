# Docker and CI/CD Learning Guide

This project uses Docker and GitHub Actions as a learning path for reproducible delivery. CI validates the application and publishes a Docker image from `main`. Application deployment remains optional until a provider is selected.

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

GitHub Actions runs on pull requests and pushes to `main`. The baseline pipeline is:

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

Pull requests build the Docker image without logging in or pushing it. Pushes to `main` publish the validated image to `<DOCKERHUB_USERNAME>/finledger` with branch, commit SHA, and `latest` tags.

Configure these values in the GitHub repository settings:

- Repository variable `DOCKERHUB_USERNAME` containing the Docker Hub username.
- Repository secret `DOCKERHUB_TOKEN` containing a Docker Hub access token with permission to push the `finledger` repository.

The image build uses safe placeholder Supabase values and does not require production secrets. The published image is a CI artifact and is not a production deployment target until production public configuration and a deployment provider are selected.

## CD Roadmap

Application deployment will be added after selecting a target such as Railway, Render, or another container platform. The deployment process must:

- Store environment variables in the provider secret manager.
- Build from a reviewed commit or CI artifact.
- Run the production image.
- Keep Supabase credentials out of logs and source control.
- Provide a rollback path.

Until a target is selected, do not add deployment-specific credentials or configuration.
