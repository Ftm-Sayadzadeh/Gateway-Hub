import { gql } from '@apollo/client'

export const GET_ALL_GATEWAYS = gql`
  query GetAllGateways($isActive: Boolean, $first: Int, $offset: Int) {
    allGateways(isActive: $isActive, first: $first, offset: $offset) {
      gateways {
        id
        name
        address
        port
        isActive
      }
      totalCount
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
  query SearchGateways($query: String!, $first: Int, $offset: Int) {
    searchGateways(query: $query, first: $first, offset: $offset) {
      gateways {
        id
        name
        address
        port
        isActive
      }
      totalCount
    }
  }
`

export const FILTER_GATEWAYS = gql`
  query FilterGateways(
    $addressContains: String
    $portMin: Int
    $portMax: Int
    $isActive: Boolean
    $first: Int
    $offset: Int
  ) {
    filterGateways(
      addressContains: $addressContains
      portMin: $portMin
      portMax: $portMax
      isActive: $isActive
      first: $first
      offset: $offset
    ) {
      gateways {
        id
        name
        address
        port
        isActive
      }
      totalCount
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