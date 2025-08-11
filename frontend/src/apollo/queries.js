import { gql } from '@apollo/client'

export const GET_ALL_GATEWAYS = gql`
  query GetAllGateways($isActive: Boolean) {
    allGateways(isActive: $isActive) {
      id
      name
      address
      port
      desc
      isActive
      connectionString
      isLocal
      createdAt
      updatedAt
    }
  }
`

export const GET_GATEWAY = gql`
  query GetGateway($id: ID!) {
    gateway(id: $id) {
      id
      name
      address
      port
      desc
      isActive
      connectionString
      isLocal
      createdAt
      updatedAt
    }
  }
`

export const SEARCH_GATEWAYS = gql`
  query SearchGateways($query: String!) {
    searchGateways(query: $query) {
      id
      name
      address
      port
      desc
      isActive
      connectionString
      isLocal
      createdAt
      updatedAt
    }
  }
`

export const FILTER_GATEWAYS = gql`
  query FilterGateways(
    $addressContains: String
    $portMin: Int
    $portMax: Int
    $isActive: Boolean
  ) {
    filterGateways(
      addressContains: $addressContains
      portMin: $portMin
      portMax: $portMax
      isActive: $isActive
    ) {
      id
      name
      address
      port
      desc
      isActive
      connectionString
      isLocal
      createdAt
      updatedAt
    }
  }
`

export const CREATE_GATEWAY = gql`
  mutation CreateGateway($input: GatewayInput!) {
    createGateway(input: $input) {
      success
      message
      gateway {
        id
        name
        address
        port
        desc
        isActive
        connectionString
        isLocal
        createdAt
        updatedAt
      }
    }
  }
`

export const UPDATE_GATEWAY = gql`
  mutation UpdateGateway($id: ID!, $input: GatewayUpdateInput!) {
    updateGateway(id: $id, input: $input) {
      success
      message
      gateway {
        id
        name
        address
        port
        desc
        isActive
        connectionString
        isLocal
        createdAt
        updatedAt
      }
    }
  }
`

export const DELETE_GATEWAY = gql`
  mutation DeleteGateway($id: String!) {
    deleteGateway(id: $id) {
      success
      message
    }
  }
`

export const TOGGLE_GATEWAY_STATUS = gql`
  mutation ToggleGatewayStatus($id: ID!) {
    toggleGateway(id: $id) {
      success
      message
      gateway {
        id
        name
        isActive
      }
    }
  }
`