# Backend Test 0001 - GraphQL API

This project is a GraphQL API built with Apollo Server and TypeScript, serving node data from JSON files (`node.json`, `trigger.json`, `action.json`, `response.json`, `resourceTemplate.json`). It implements the schema defined in `code_test_v1.pdf`, with Bearer token authentication (token: `test-token`). The test suite uses Jest to verify API functionality.

## Overview

The API provides a `node` query to retrieve `NodeObject` data by ID, including fields like `_id`, `name`, `trigger`, `responses`, `actions`, `parents`, and nested types (`Trigger`, `Action`, `Response`, `ResourceTemplate`). Authentication requires a Bearer token (`test-token`). The project uses TypeScript for type safety, Apollo Server for the GraphQL backend, and Jest with `ts-jest` for testing, covering valid queries, edge cases, and authentication.

## Prerequisites

- **Node.js**: Version 20.18.0 or higher.
- **npm**: Version 10.8.2 or higher (included with Node.js).
- A terminal or command-line interface.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/asif-ae/backend_test_0001
   cd backend_test_0001
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

## Running the Server

1. **Build the Project**:
   ```bash
   npm run build
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```
   The server runs at `http://localhost:4000/graphql`, with GraphQL Playground enabled for testing queries.

3. **Example Query**:
   Use a tool like Postman or the GraphQL Playground. Include the `Authorization` header with `Bearer test-token`. Example:
   ```graphql
   query {
     node(nodeId: "6296be3470a0c1052f89cccb") {
       _id
       name
       responses {
         _id
         name
       }
     }
   }
   ```
   **Curl Example**:
   ```bash
   curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer test-token" -d '{"query":"query { node(nodeId: \"6296be3470a0c1052f89cccb\") { _id name responses { _id name } } }"}' http://localhost:4000/graphql
   ```

## Running Tests

The test suite in `test/api.test.ts` verifies API functionality, including valid queries, edge cases, and authentication.

1. **Ensure the Server is Running**:
   ```bash
   npm start
   ```

2. **Run Tests**:
   ```bash
   npm run test
   ```

3. **Expected Test Output**:
   ```
   PASS  test/api.test.ts
     GraphQL API Tests
       ✓ should fetch node data with valid ID and all fields (157 ms)
       ✓ should fetch node with postActions (100 ms)
       ✓ should fetch global node with redirect (90 ms)
       ✓ should fetch node with trigger and resourceTemplate (95 ms)
       ✓ should fetch node with parents (85 ms)
       ✓ should return null for invalid nodeId (16 ms)
       ✓ should return null for non-existent nodeId (15 ms)
       ✓ should fail without authentication (216 ms)
       ✓ should fail with invalid token (200 ms)
       ✓ should handle null optional fields (90 ms)
       ✓ should fetch node with complex response platforms (110 ms)

   Test Suites: 1 passed, 1 total
   Tests:       12 passed, 12 total
   Snapshots:   0 total
   Time:        5.2 s
   ```

## Authentication

- **Bearer Token**: All queries require an `Authorization` header with `Bearer test-token`. The token is `test-token`.
- **Authentication Failure**: Queries without a valid token return a 401 Unauthorized error with the message "Response not successful: Received status code 401".

## Project Structure

```
backend_test_0001/
├── src/
│   ├── index.ts          # Main server file with Apollo Server setup
│   ├── schema/
│   │   └── typeDefs.graphql # GraphQL schema definition
│   ├── resolvers/
│   │   └── index.ts      # GraphQL resolvers for node queries
├── test/
│   └── api.test.ts       # Jest tests for the GraphQL API
├── __mocks__/
│   └── react.js          # Mock for Apollo Client's React dependency
├── data/
│   ├── node.json         # Node data
│   ├── trigger.json      # Trigger data
│   ├── action.json       # Action data
│   ├── response.json     # Response data
│   └── resourceTemplate.json # ResourceTemplate data
├── jest.config.cjs       # Jest configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tsup.config.ts        # Build configuration for tsup
└── README.md             # Project documentation
```
