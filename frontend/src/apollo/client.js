import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_APP_GRAPHQL_URL || 'http://localhost:8000/graphql/',
  credentials: 'omit',
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(`[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    })
  }
  if (networkError) {
    console.error(`[Network Error]: ${networkError}`)
  }
})

const cache = new InMemoryCache({
  typePolicies: {
    Gateway: {
      fields: {
        gateways: {
          merge(existing = [], incoming) {
            return [...incoming]
          }
        }
      }
    }
  }
})


const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache,
  defaultOptions: {
  },
})

export default client