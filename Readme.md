# MoneyFlow-PLC

MoneyFlow-PLC is a Node.js-based banking application developed by Monday Chimaobi Julius.

## Description

MoneyFlow-PLC App allows users to perform various banking operations including account creation, deposit, withdrawal, balance inquiry, and fund transfer. It is built using Node.js, Express.js, MongoDB, and Docker for containerization.

## Dockerization

The application has been dockerized for easier deployment and management across different environments. The Docker setup includes a Dockerfile for building the application image and a docker-compose.yml file for managing multi-container applications.

## Features

- Account management (creation, update, deletion)
- Deposit and withdrawal operations
- Balance inquiry
- Fund transfer between accounts
- Daily withdrawal limit enforcement
- Transaction history tracking

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Docker

## Setup Instructions

1. Clone the repository:
- git clone <repository-url>
2. Install dependencies:
- npm install
3. Set up environment variables:
- Create a `.env` file based on `.env.example` and configure MongoDB connection URI and other necessary variables.

4. Start the application:
- npm start
5. Access the application at `http://localhost:4000` (or as configured).

## API Documentation

- API documentation and endpoints can be found in the `docs/` directory or accessed programmatically.

## Author

Monday Chimaobi Julius - [GitHub Profile](https://github.com/your-github-profile)

## License

This project is licensed under the MIT License - see the LICENSE file for details.