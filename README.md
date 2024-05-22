# Secret Note API

This project is a RESTful API built with NestJS and TypeScript that allows users to create, read, update, and delete secret notes. The notes are encrypted before being stored in the database and decrypted when retrieved.

## Features

- Create a new secret note
- Retrieve a list of all secret notes (with limited information)
- Retrieve a single secret note (decrypted or encrypted)
- Update an existing secret note
- Delete a secret note

## Technologies Used

### Backend

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeScript**: A statically-typed superset of JavaScript that adds optional static typing to the language.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **TypeORM**: An Object-Relational Mapping (ORM) library for TypeScript and JavaScript that provides a convenient way to interact with databases.
- **Crypto**: A built-in Node.js module for handling encryption and decryption.
- **Jest**: A delightful JavaScript testing framework for writing unit tests and end-to-end tests.

### DevOps

- **Docker**: A platform for building, deploying, and running applications in containers.
- **Docker Compose**: A tool for defining and running multi-container Docker applications.
- **GitHub Actions**: A continuous integration and continuous delivery (CI/CD) platform for automating build, test, and deployment workflows.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Docker
- Docker Compose

### Installation

1. Clone the repository:

```bash
git clone https://github.com/SuperStar0106/sphere-notes-api.git
```

2. Install dependencies:

```bash
cd sphere-note-api
npm install
```

3. Set up the environment variables:

```bash
cp .env.example .env
```

Update the `.env` file with your desired configuration, such as the database URL and encryption key.

4. Start the application and database using Docker Compose:

```bash
docker-compose up -d
```

This will start the application and the PostgreSQL database in separate containers.

5. Run database migrations:

```bash
# Run migrations
npm run migration:run
```

6. Start the application:

```bash
npm run start
```

#### The API will be available at <http://localhost:3000>

### Running Tests

To run the unit tests and end-to-end tests, use the following command:

```bash
npm test
npm test:e2e
```

### Building and Running in Production

1. Build the application:

```bash
npm run build
```

2. Start the application in production mode:

```bash
npm run start:prod
```

### GitHub Actions

This project includes a GitHub Actions workflow for building and testing the application on every push to the `main` branch. The workflow is defined in the `.github/workflows/main.yml` file. It performs the following steps:

1. Checks out the repository code
2. Sets up Node.js environment
3. Installs project dependencies
4. Runs unit tests
5. Runs end-to-end tests
6. Builds the application

### Docker

The project can be packaged and deployed as a Docker container. The `Dockerfile` and `docker-compose.yml` files are included in the repository for this purpose. The `Dockerfile` defines the steps to build the Docker image, and the `docker-compose.yml` file defines the services(application and database) and their configurations.
To build and run the application using Docker, follow these steps:

1. Build the Docker image:

```bash
docker build t secret-note-api .
```

2. Run the application and database using Docker Compose:

```bash
docker-compose up -d
```

## Encryption

The Secret Note API uses the AES-256-CBC algorithm for encrypting and decrypting the notes. The encryption key is stored as an environment variable (`ENCRYPT_KEY`) and should be kept secure. The encryption and decryption logic is implemented in the `src/utils/crypto.utils.ts` file.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please opoen an issue or submit a pull request.
