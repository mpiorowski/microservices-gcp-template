# Microservices GCP template

Microservices Google Cloud Platform template using:

- [SvelteKit](https://kit.svelte.dev/) (Frontend using [Svelte](https://svelte.dev/) and [TypeScript](https://www.typescriptlang.org/))
- [Fastify](https://www.fastify.io/) (Microservices using [NodeJS](https://nodejs.dev/) and [TypeScript](https://www.typescriptlang.org/))
- [PostgreSQL](https://www.postgresql.org/) (Database)
- [Docker](https://www.docker.com/) (Containerization)

This template is using my another library - [SvelteInit](https://github.com/mpiorowski/svelte-init), feel free to check it out.

## Architecture

- Frontend is deployed to [Vercel](https://vercel.com/)
- Gateway and Microservices are deployed to [Google Cloud Run](https://cloud.google.com/run)
- Client talks to the gateway using [GraphQL](https://graphql.org/)
- The gateway talks to the microservices using HTTP
- [Mercurius](https://mercurius.dev/) as GraphQL server
- [URQL](https://formidable.com/open-source/urql/) as GraphQL client
- Each microservice has his own database (if needed)
- Files are stored in [Google Cloud Storage](https://cloud.google.com/storage)
- Emails are sent using [Google Cloud Pub/Sub](https://cloud.google.com/pubsub) via [SendGrid](https://sendgrid.com/)
- Automatic deployment using [GitHub Actions](https://docs.github.com/en/actions)

## Base features

- User authentication via magic link
- Async email sending
- File upload and download

## Development setup

In `docker-compose.yml` write down Your SendGrid Api Key.

### Install npm libraries:

```bash
npm --prefix ./client install
npm --prefix ./gateway install
npm --prefix ./server install
```

### Start development gateway and microservices:

```bash
docker-compose up
```

### Start development frontend:

```bash
npm --prefix ./client start
```
