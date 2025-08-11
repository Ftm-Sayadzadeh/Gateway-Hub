import { ref, computed } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import {
  GET_ALL_GATEWAYS,
  GET_GATEWAY,
  SEARCH_GATEWAYS,
  FILTER_GATEWAYS,
  CREATE_GATEWAY,
  UPDATE_GATEWAY,
  DELETE_GATEWAY,
  TOGGLE_GATEWAY_STATUS,
} from '@/apollo/queries'

export function useGatewaysGraphQL() {
  const filters = ref({
    isActive: null,
    addressContains: '',
    portMin: null,
    portMax: null,
    search: '',
  })

  const {
    result: gatewaysResult,
    loading: gatewaysLoading,
    error: gatewaysError,
    refetch: refetchGateways,
  } = useQuery(
    GET_ALL_GATEWAYS,
    () => ({
      isActive: filters.value.isActive,
    }),
    {
      pollInterval: 60000, // 1 min
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-first',
    },
  )

  const gateways = computed(() => {
    return gatewaysResult.value?.allGateways || []
  })

  const {
    result: searchResult,
    loading: searchLoading,
    error: searchError,
    refetch: searchGateways,
  } = useQuery(
    SEARCH_GATEWAYS,
    () => ({
      query: filters.value.search,
    }),
    {
      enabled: computed(() => !!filters.value.search),
    },
  )

  const {
    result: filterResult,
    loading: filterLoading,
    error: filterError,
    refetch: filterGateways,
  } = useQuery(
    FILTER_GATEWAYS,
    () => ({
      addressContains: filters.value.addressContains,
      portMin: filters.value.portMin,
      portMax: filters.value.portMax,
      isActive: filters.value.isActive,
    }),
    {
      enabled: computed(
        () =>
          filters.value.addressContains ||
          filters.value.portMin ||
          filters.value.portMax ||
          filters.value.isActive !== null,
      ),
    },
  )

  // mutations
  const {
    mutate: createGateway,
    loading: createLoading,
    error: createError,
  } = useMutation(CREATE_GATEWAY, {
    update(cache, { data: { createGateway } }) {
      if (createGateway.success) {
        const existingGateways = cache.readQuery({ query: GET_ALL_GATEWAYS })
        if (existingGateways) {
          cache.writeQuery({
            query: GET_ALL_GATEWAYS,
            data: {
              allGateways: [...existingGateways.allGateways, createGateway.gateway],
            },
          })
        }
      }
    },
  })

  const {
    mutate: updateGateway,
    loading: updateLoading,
    error: updateError,
  } = useMutation(UPDATE_GATEWAY, {
    update(cache, { data: { updateGateway } }, { variables }) {
      if (updateGateway.success) {
        const existingGateways = cache.readQuery({ query: GET_ALL_GATEWAYS })
        if (existingGateways) {
          const updatedGateways = existingGateways.allGateways.map((gateway) =>
            gateway.id === variables.id ? { ...gateway, ...updateGateway.gateway } : gateway,
          )
          cache.writeQuery({
            query: GET_ALL_GATEWAYS,
            data: {
              allGateways: updatedGateways,
            },
          })
        }
      }
    },
  })

  const {
    mutate: deleteGateway,
    loading: deleteLoading,
    error: deleteError,
  } = useMutation(DELETE_GATEWAY, {
    update(cache, { data: { deleteGateway } }, { variables }) {
      if (deleteGateway.success) {
        cache.evict({ id: `Gateway:${variables.id}` })
        cache.gc()
      }
    },
  })

  const {
    mutate: toggleGatewayStatus,
    loading: toggleLoading,
    error: toggleError,
  } = useMutation(TOGGLE_GATEWAY_STATUS, {
    update(cache, { data: { toggleGateway } }, { variables }) {
      if (toggleGateway.success) {
        const existingGateways = cache.readQuery({ query: GET_ALL_GATEWAYS })
        if (existingGateways) {
          const updatedGateways = existingGateways.allGateways.map((gateway) =>
            gateway.id === variables.id
              ? {
                  ...gateway,
                  isActive: toggleGateway.gateway.isActive,
                  updatedAt: toggleGateway.gateway.updatedAt,
                }
              : gateway,
          )
          cache.writeQuery({
            query: GET_ALL_GATEWAYS,
            data: {
              allGateways: updatedGateways,
            },
          })
        }
      }
    },
  })

  // helper
  const getAllGateways = () => {
    return gateways.value
  }

  const getGatewayById = (id) => {
    return gateways.value.find((gateway) => gateway.id === id)
  }

  const createNewGateway = async (gatewaysData) => {
    try {
      const { data } = await createGateway({
        input: gatewaysData,
      })

      if (data.createGateway.success) {
        return {
          success: true,
          gateway: data.createGateway.gateway,
          message: data.createGateway.message,
        }
      } else {
        return {
          success: false,
          message: data.createGateway.message,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  const updateExistingGateway = async (id, updateData) => {
    try {
      const { data } = await updateGateway({
        id,
        input: updateData,
      })

      if (data.updateGateway.success) {
        return {
          success: true,
          gateway: data.updateGateway.gateway,
          message: data.updateGateway.message,
        }
      } else {
        return {
          success: false,
          message: data.updateGateway.message,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  const deleteGatewayById = async (id) => {
    try {
      const { data } = await deleteGateway({
        id: id.toString(),
      })

      if (data.deleteGateway.success) {
        return {
          success: true,
          gateway: data.deleteGateway.gateway,
          message: data.deleteGateway.message,
        }
      } else {
        return {
          success: false,
          message: data.deleteGateway.message,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  const toggleStatus = async (id) => {
    try {
      const { data } = await toggleGatewayStatus({
        id,
      })

      if (data.toggleGateway.success) {
        return {
          success: true,
          gateway: data.toggleGateway.gateway,
          message: data.toggleGateway.message,
        }
      } else {
        return {
          success: false,
          message: data.toggleGateway.message,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message,
      }
    }
  }

  const searchGatewaysByQuery = (query) => {
    filters.value.search = query
    return searchGateways()
  }

  const filterGatewaysByOptions = (filterOptions) => {
    filters.value = { ...filters.value, ...filterOptions }
    return filterGateways()
  }

  // const getGatewayStats = computed(() => {
  //   const total = gateways.value.length
  //   const online = gateways.value.filter(g => g.isActive).length
  //   const offline = total - online

  //   return {
  //     total,
  //     online,
  //     offline,
  //     onlinePercentage: total > 0 ? Math.round((online / total) * 100) : 0
  //   }
  // })

  // loading states
  const isLoading = computed(
    () =>
      gatewaysLoading.value ||
      createLoading.value ||
      updateLoading.value ||
      deleteLoading.value ||
      toggleLoading.value,
  )

  // error states
  const hasError = computed(
    () =>
      gatewaysError.value ||
      createError.value ||
      updateError.value ||
      deleteError.value ||
      toggleError.value,
  )

  return {
    // data
    gateways,
    filters,

    // loading states
    isLoading,
    gatewaysLoading,
    createLoading,
    updateLoading,
    deleteLoading,
    toggleLoading,

    // error states
    hasError,
    gatewaysError,
    createError,
    updateError,
    deleteError,
    toggleError,

    // stats
    //getGatewayStats,

    // methods
    getAllGateways,
    getGatewayById,
    createNewGateway,
    updateExistingGateway,
    deleteGatewayById,
    toggleStatus,
    searchGatewaysByQuery,
    filterGatewaysByOptions,
    refetchGateways,
  }
}
