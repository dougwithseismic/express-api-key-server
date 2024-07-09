# API Key and License Management Server

This project is a robust API key and license management server built with Express.js. It provides a secure and scalable solution for managing API keys, credits, and licenses for your services.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Running the Server](#running-the-server)
7. [API Endpoints](#api-endpoints)
8. [Control Panel](#control-panel)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Contributing](#contributing)
12. [License](#license)

## Features

- API key generation and management
- Credit system for API usage
- License creation and validation
- Rate limiting
- Swagger API documentation
- React-based control panel
- Logging with Winston
- Redis caching for improved performance

## Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- PostgreSQL (v12.x or later)
- Redis (v6.x or later)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/api-key-server.git
   cd api-key-server
   ```

2. Install dependencies:

   ```
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory with the following content:

   ```
   PORT=3000
   DATABASE_URL=postgresql://username:password@localhost:5432/api_key_server
   REDIS_URL=redis://localhost:6379
   ```

   Replace the `DATABASE_URL` and `REDIS_URL` with your actual database and Redis connection strings.

2. Adjust other configuration settings in `src/config/` directory as needed.

## Database Setup

Run the following SQL commands to create the necessary tables:

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE licenses (
  id UUID PRIMARY KEY,
  api_key_id UUID NOT NULL REFERENCES api_keys(id),
  product_id TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_api_keys_key ON api_keys(key);
CREATE INDEX idx_licenses_api_key_id ON licenses(api_key_id);
```

## Running the Server

1. Start the server in development mode:

   ```
   npm run dev
   ```

2. For production:

   ```
   npm run build
   npm start
   ```

The server will be available at `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

- `/api/keys`: API key management
- `/api/licenses`: License management
- `/api/protected`: Protected routes requiring API key authentication

For detailed API documentation, visit `http://localhost:3000/api-docs` when the server is running.

## Control Panel

The control panel is a React-based web interface for managing API keys and licenses.

To access the control panel:

1. Ensure the server is running
2. Visit `http://localhost:3000/control-panel`

## Testing

Run the test suite:

```
npm test
```

## Deployment

1. Set up your production environment (e.g., AWS, Heroku, DigitalOcean)
2. Configure environment variables for production
3. Build the project: `npm run build`
4. Deploy the `dist` directory and start the server using `npm start`

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
