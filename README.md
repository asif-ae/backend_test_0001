# GraphQL API Code Test – Node.js, Apollo Server & TypeScript

## Project Overview

This repository contains a **GraphQL API** project built as a full-stack code test for The Red IT. It is a Node.js application using **Apollo Server** with **TypeScript**. The API exposes a GraphQL schema that models a conversational workflow system, including types such as **NodeObject**, **Action**, **Response**, **Trigger**, and **ResourceTemplate**. All data is sourced from local static JSON files, and the API supports authentication via JWT (JSON Web Tokens).

Key features of the project:  
- **GraphQL Schema with Nested Relations:** A `node(nodeId: ID!): NodeObject` query allows fetching a NodeObject and **deeply nested related data** (its Trigger, Responses, Actions, and parent NodeObjects).  
- **Static Data Source:** Instead of a database, the application uses JSON files as a data source, loaded at runtime. This simulates relational data (IDs reference objects in other JSON files) and the resolvers properly join these relations.  
- **JWT Authentication:** A custom `login` GraphQL mutation is provided. Clients must authenticate by obtaining a JWT token and sending it with requests as a Bearer token in the HTTP Authorization header.  
- **Fully Functional:** Despite using static data, all query and relation resolvers are implemented. The API can be run locally and will return the expected nested data for queries.  

This README outlines the technologies used, how to set up and run the project, configuration via `.env`, example usage of the API (including authentication and query examples), and some notes on limitations. 

## Technologies Used

- **Node.js & TypeScript:** Backend runtime (Node v16+ recommended) with type safety provided by TypeScript.
- **Apollo Server 4 (Standalone):** Serves the GraphQL endpoint and handles schema/resolvers, including built-in support for context (used for auth).
- **GraphQL**: Schema and query language to fetch and combine data. Custom scalar types are used (e.g., `Long` for timestamps, `JSON` for arbitrary JSON objects).
- **JSON Data Loader:** Static JSON files serve as the data store. A custom loader module reads `node.json`, `action.json`, `response.json`, `trigger.json`, and `resourceTemplate.json` into memory on startup.
- **JWT Authentication:** Uses the `jsonwebtoken` library. Authentication tokens (JWTs) are signed with a secret from the environment and verified on each request (except the login mutation and introspection queries).
- **dotenv:** Loads environment variables from a `.env` file for configuration (e.g., server port, JWT secret).
- **Tsup:** A lightweight TypeScript bundler is used for development (watch mode) and building the project for distribution. This allows running the TypeScript source directly in dev mode.

## Setup and Installation

Follow these steps to set up the project locally:

1. **Clone the repository:** Download or clone the project source code to your local machine.  
2. **Install dependencies:** In the project directory, run `npm install` to install all required npm packages as listed in `package.json`.  
3. **Provide a `.env` file:** Create a `.env` file in the project root (or modify the provided sample) with the necessary configuration (see [Sample .env Configuration](#sample-env-configuration) below). At minimum, you should set a `SECRET_KEY` for JWT signing.  
4. **Verify Node version:** Ensure you have Node.js (version 16 or above) installed, as this project uses ES Module imports and may not run on much older versions.  

After these steps, the project is ready to run.

## Sample .env Configuration

Below is an example of a `.env` configuration for this project:

```bash
# .env file example
PORT=4000
SECRET_KEY=shhh_super_secret_key
```

- **PORT:** The port on which the Apollo Server will listen. If not provided, it defaults to 4000.  
- **SECRET_KEY:** A secret key used to sign JWT tokens. **Ensure this is set to a secure value in a real environment.** This same key is used to verify tokens on incoming requests.  

> **Note:** The application will load this `.env` file automatically on startup (using `dotenv.config()`), so make sure it’s present before running the server. Keep the `SECRET_KEY` secret; do not expose it publicly. 


## Project Structure

```text
src/
├── data/                         # Static data source (JSON files for each entity)
│   ├── action.json
│   ├── node.json
│   ├── resourceTemplate.json
│   ├── response.json
│   ├── trigger.json
│   └── loaders.ts                # Loads all JSON into an in-memory data store
│
├── schema/
│   ├── resolvers/                # GraphQL resolvers per entity and scalar support
│   │   ├── action.ts
│   │   ├── nodeObject.ts
│   │   ├── resourceTemplate.ts
│   │   ├── response.ts
│   │   ├── trigger.ts
│   │   ├── user.ts               # login, auth, etc.
│   │   └── index.ts              # Combines all resolvers
│   ├── scalars/                  # Custom scalars like JSON, Long
│   │   ├── json.ts
│   │   └── long.ts
│   └── types/                    # GraphQL type definitions (SDL as gql-tag templates)
│       ├── action.ts
│       ├── nodeObject.ts
│       ├── resourceTemplate.ts
│       ├── response.ts
│       ├── trigger.ts
│       ├── user.ts
│       └── index.ts              # Combines all typedefs
│
├── utils/
│   └── auth.ts                   # JWT token generation and verification logic

├── index.ts                      # Apollo server entry point
```

---

## Running the Server (Development Mode)

During development, you can start the GraphQL API server in watch mode. This will auto-reload on code changes for a smooth developer experience. Use the following command:

```bash
npm run dev
```

This uses **tsup** to watch and compile the TypeScript source, then starts the Apollo Server. You should see console output confirming the server is running, for example: 

```
🚀 Server ready at http://localhost:4000/
```

By default, the server will run at **http://localhost:4000/** (or another port if you specified a different `PORT` in `.env`). 

You can now interact with the GraphQL endpoint (for example, by using Apollo Sandbox, GraphQL Playground, Postman, or `curl`). The server supports introspection and the Apollo UI in development mode, so you can explore the schema.

For a production or compiled run (not typically needed for the code test, but for completeness):
- Build the project with `npm run build`. This compiles TypeScript to JavaScript in the `dist/` folder.
- Start the compiled server with `npm start`.

---

## 🚀 Running the Server (Production Mode)

To run the server in production:

### 1. **Build the Project**

```bash
npm run build
```

This compiles the TypeScript code to JavaScript in the `dist/` folder using `tsup`.

---

### 2. **Start the Server**

```bash
npm start
```

This runs the compiled app from `dist/index.js`. You’ll see:

```
🚀 Server ready at http://localhost:4000/
```

---

## Example `curl` Commands

```bash
# Login to receive token
curl -X POST http://localhost:4000/ \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { login(username: \"admin\", password: \"admin\") { token } }"}'

# Fetch a node (replace <your_token> with the actual token)
curl -X POST http://localhost:4000/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"query":"{ node(nodeId: \"6296be3470a0c1052f89cccb\") { _id name } }"}'
```

---

## Authentication and Login

This API is protected by **Bearer token authentication**. Unauthenticated requests (except for a few exceptions like the login itself or schema introspection) will be rejected. The authentication flow is as follows:

**Login Mutation:** Use the `login` GraphQL mutation to authenticate and retrieve a token. This mutation requires a username and password (strings) and returns a JWT token if the credentials are valid. For the purpose of this code test, the credentials can be simple (e.g., `"admin"` / `"admin"` or any preset value as documented in the code). For example: 

    ```graphql
    mutation {
      login(username: "admin", password: "admin") {
        token
      }
    }
    ```

   On success, this will return a JWT token string. The token is signed using the `SECRET_KEY` from the environment. (In a real application, credentials would be verified against a user datastore. In this test project, the login may accept a hardcoded credential or any non-empty values – refer to the implementation details in the code.) 

## 📌 Apollo Sandbox Authorization Header Setup

In Apollo Sandbox:

1. Click on **"Headers"** tab (top right)
2. Add this header:
   ```json
   {
     "Authorization": "Bearer <your_token_here>"
   }
   ```
3. You can now run authenticated queries

---

3. **Token Validity:** Tokens issued by the `login` mutation are JWTs valid for 1 hour by default. If a token expires or is invalid, you should call the `login` mutation again to get a new token. The token’s validity is verified using the same `SECRET_KEY`. (Do not share this key or your token publicly.)

**Important:** Always keep your token secure. In tools like Apollo Sandbox or Postman, set the header properly. In Apollo Sandbox, you can add headers under "Headers" – e.g., add a new header `Authorization` with value `Bearer eyJhbGciOi...` (your token). 

## GraphQL Query Example – Fetching a NodeObject

One of the main queries supported is fetching a **NodeObject** by ID. This query will resolve all related data (trigger, responses, actions, parents) nested within the NodeObject. Here’s a full example of using the `node` query with a deeply nested selection set:

Suppose we want to fetch a Node that represents a step in a conversation flow. For this example, we will query a NodeObject with ID `6297172e70a0c165b989cd10` (which in our dataset corresponds to a node named "User's Email"). We will request its related Trigger, Response, Action, and parent Node information.

**GraphQL Query:**

```graphql
query Node {
  node(nodeId: "6296be3470a0c1052f89cccb") {
    _id
    name
    description
    createdAt
    updatedAt
    root
    compositeId
    global
    colour
    priority

    parentIds
    parents {
      _id
      name
      createdAt
      updatedAt
      description
      root
      compositeId
      global
      colour
      priority
    }

    triggerId
    trigger {
      _id
      name
      description
      createdAt
      updatedAt
      functionString
      resourceTemplateId
      resourceTemplate {
        _id
        name
        description
        createdAt
        updatedAt
        schema
        integrationId
        functionString
        key
      }
    }

    responseIds
    responses {
      _id
      name
      description
      createdAt
      updatedAt
      platforms {
        integrationId
        build
        localeGroups {
          variations {
            name
            responses
          }
        }
      }
    }

    actionIds
    actions {
      _id
      name
      description
      createdAt
      updatedAt
      functionString
      resourceTemplateId
      resourceTemplate {
        _id
        name
        description
        createdAt
        updatedAt
        schema
        integrationId
        functionString
        key
      }
    }
  }
}
```

In this query: 
- We ask for the NodeObject’s basic fields (`_id`, `name`, `description`). 
- We include nested sub-fields:
  - **trigger:** The Trigger object linked to this node (with its own id, name, description).
  - **responses:** A list of Response objects. For each Response, we fetch its id, name, and then drill into platforms → localeGroups → variations to finally get the actual response text. (This structure is designed to handle multi-platform messaging content; in our data source, for example, a Response might have different variations for different platforms.)
  - **actions:** A list of Action objects associated with this node. (In the data model, a node could have pre-actions or post-actions; in the GraphQL schema they are exposed collectively as `actions` for simplicity.) We retrieve each Action’s id, name, description, and also fetch its linked ResourceTemplate (which might describe what the action does, e.g., a "Send Email" template).
  - **parents:** An array of parent NodeObjects (if any). This allows us to see the hierarchy – which node(s) lead to this current node. We fetch each parent’s id and name.

Make sure to include an `Authorization` header with your Bearer token when running this query (as described in the authentication section), otherwise the request will be denied.

---

## What Was Tested

| ✅ Test Case | Result |
|-------------|--------|
| Login mutation returns valid JWT | ✔️ |
| `Authorization` header enforced for all queries | ✔️ |
| `node(nodeId)` resolves correctly | ✔️ |
| Deep nested relations (`trigger`, `responses`, `actions`, `parents`) | ✔️ |
| Apollo server runs with `npm run dev` | ✔️ |
| `.env` loaded and used correctly | ✔️ |
| Unauthorized access returns error | ✔️ |
| Apollo Sandbox integration with Bearer token | ✔️ |
| Data from `*.json` files is correctly resolved and mapped | ✔️ |

---
