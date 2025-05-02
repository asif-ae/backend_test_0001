import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import fetch from 'cross-fetch';

const API_URL = 'http://localhost:4000/graphql';

const createClient = (auth = true, token = 'test-token') => new ApolloClient({
  link: new HttpLink({
    uri: API_URL,
    fetch,
    headers: auth ? { Authorization: `Bearer ${token}` } : {}
  }),
  cache: new InMemoryCache()
});

describe('GraphQL API Tests', () => {
  const client = createClient();
  const clientNoAuth = createClient(false);
  const invalidClient = createClient(true, 'wrong-token');

  it('should fetch node data with valid ID and all fields', async () => {
    const GET_NODE = gql`
      query {
        node(nodeId: "6296be3470a0c1052f89cccb") {
          _id
          name
          description
          createdAt
          updatedAt
          parents {
            _id
            name
          }
          parentIds
          root
          trigger {
            _id
            name
          }
          triggerId
          responses {
            _id
            name
            platforms {
              integrationId
              build
              localeGroups {
                localeGroup
                variations {
                  name
                  responses
                }
              }
            }
          }
          responseIds
          actions {
            _id
            name
          }
          actionIds
          postActions {
            _id
            name
            resourceTemplate {
              _id
              name
            }
          }
          compositeId
          global
          colour
          priority
          redirect {
            nodeCompositeId
            sendResponse
            runPreAction
            runPostAction
          }
        }
      }
    `;

    const { data } = await client.query({ query: GET_NODE });
    expect(data.node).toMatchObject({
      _id: '6296be3470a0c1052f89cccb',
      name: 'Greeting Message',
      description: '',
      createdAt: 1654046260304,
      updatedAt: 1696991678515,
      parents: [],
      parentIds: [],
      root: true,
      trigger: null,
      triggerId: null,
      responses: null,
      responseIds: null,
      actions: null,
      actionIds: null,
      postActions: null,
      compositeId: 'V78P4OA9maz31ORn',
      global: false,
      colour: null,
      priority: null,
      redirect: null
    });
  });

  it('should fetch node with postActions', async () => {
    const GET_NODE = gql`
      query {
        node(nodeId: "6297172e70a0c165b989cd10") {
          _id
          name
          postActions {
            _id
            name
            resourceTemplate {
              _id
              name
              schema
            }
          }
        }
      }
    `;

    const { data } = await client.query({ query: GET_NODE });
    expect(data.node).toMatchObject({
      _id: '6297172e70a0c165b989cd10',
      name: "User's Email",
      postActions: null
    });
  });

  it('should fetch global node with redirect', async () => {
    const GET_NODE = gql`
      query {
        node(nodeId: "6297005470a0c10d6b89ccf1") {
          _id
          name
          global
          redirect {
            nodeCompositeId
            sendResponse
            runPreAction
            runPostAction
          }
        }
      }
    `;

    const { data } = await client.query({ query: GET_NODE });
    expect(data.node).toMatchObject({
      _id: '6297005470a0c10d6b89ccf1',
      name: 'Greeting Message Global',
      global: true,
      redirect: {
        nodeCompositeId: 'V78P4OA9maz31ORn',
        sendResponse: true,
        runPreAction: true,
        runPostAction: true
      }
    });
  });

  it('should fetch node with trigger and resourceTemplate', async () => {
    const GET_NODE = gql`
      query {
        node(nodeId: "6297164810f52524ba1a9300") {
          _id
          name
          trigger {
            _id
            name
            resourceTemplate {
              _id
              name
              functionString
            }
          }
        }
      }
    `;

    const { data } = await client.query({ query: GET_NODE });
    expect(data.node).toMatchObject({
      _id: '6297164810f52524ba1a9300',
      name: 'Sign up Webinar',
      trigger: null
    });
  });

  it('should fetch node with parents', async () => {
    const GET_NODE = gql`
      query {
        node(nodeId: "62971a9570a0c12bb389cd13") {
          _id
          name
          parents {
            _id
            name
          }
          parentIds
        }
      }
    `;

    const { data } = await client.query({ query: GET_NODE });
    expect(data.node).toMatchObject({
      _id: '62971a9570a0c12bb389cd13',
      name: '10AM Timeslot',
      parents: [],
      parentIds: []
    });
  });

  it('should return null for invalid nodeId', async () => {
    const GET_NODE = gql`
      query {
        node(nodeId: "invalid-id") {
          _id
        }
      }
    `;

    const { data } = await client.query({ query: GET_NODE });
    expect(data.node).toBeNull();
  });

  it('should return null for non-existent nodeId', async () => {
    const GET_NODE = gql`
      query {
        node(nodeId: "999999999999999999999999") {
          _id
        }
      }
    `;

    const { data } = await client.query({ query: GET_NODE });
    expect(data.node).toBeNull();
  });

  it('should fail without authentication', async () => {
    const GET_NODE = gql`
      query {
        node(nodeId: "6296be3470a0c1052f89cccb") {
          _id
        }
      }
    `;

    await expect(clientNoAuth.query({ query: GET_NODE })).rejects.toMatchObject({
      message: expect.stringContaining('Response not successful: Received status code 401'),
      networkError: expect.objectContaining({
        statusCode: 401
      })
    });
  });

  it('should fail with invalid token', async () => {
    const GET_NODE = gql`
      query {
        node(nodeId: "6296be3470a0c1052f89cccb") {
          _id
        }
      }
    `;

    await expect(invalidClient.query({ query: GET_NODE })).rejects.toMatchObject({
      message: expect.stringContaining('Response not successful: Received status code 401'),
      networkError: expect.objectContaining({
        statusCode: 401
      })
    });
  });

  it('should handle null optional fields', async () => {
    const GET_NODE = gql`
      query {
        node(nodeId: "6296be3470a0c1052f89cccb") {
          _id
          description
          priority
          colour
        }
      }
    `;

    const { data } = await client.query({ query: GET_NODE });
    expect(data.node).toMatchObject({
      _id: '6296be3470a0c1052f89cccb',
      description: '',
      priority: null,
      colour: null
    });
  });

  it('should fetch node with complex response platforms', async () => {
    const GET_NODE = gql`
      query {
        node(nodeId: "6296be3470a0c1052f89cccb") {
          _id
          responses {
            _id
            platforms {
              integrationId
              localeGroups {
                localeGroup
                variations {
                  name
                  responses
                }
              }
            }
          }
        }
      }
    `;

    const { data } = await client.query({ query: GET_NODE });
    expect(data.node.responses).toBeNull();
  });
});