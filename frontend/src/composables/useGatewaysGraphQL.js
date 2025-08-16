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
  const pageSize = ref(8)
  const currentPage = ref(1)
  const filters = ref({
    isActive: null,
    addressContains: '',
    portMin: null,
    portMax: null,
    search: '',
  })

  const currentQuery = computed(() => {
    if (filters.value.search) {
      return SEARCH_GATEWAYS
    }
    
    const hasAdvancedFilters =
      filters.value.addressContains ||
      filters.value.portMin ||
      filters.value.portMax ||
      filters.value.isActive !== null

    if (hasAdvancedFilters) {
      return FILTER_GATEWAYS
    }

    return GET_ALL_GATEWAYS
  })

  const variables = computed(() => {
    const baseVars = {
      first: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
    }

    if (filters.value.search) {
      return { ...baseVars, query: filters.value.search }
    }
    
    const filterVars = {
      addressContains: filters.value.addressContains || null,
      portMin: filters.value.portMin || null,
      portMax: filters.value.portMax || null,
      isActive: filters.value.isActive,
    }
    return { ...baseVars, ...filterVars }
  })

  const {
    result,
    loading: gatewaysLoading,
    error: gatewaysError,
    refetch,
  } = useQuery(currentQuery, variables, {
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: false,
    errorPolicy: 'all'
  })

  const gateways = computed(() => {
    const data = result.value
    if (!data) return []
    const gatewaysData =
      data.allGateways?.gateways ||
      data.searchGateways?.gateways ||
      data.filterGateways?.gateways
    return gatewaysData || []
  })

  const totalCount = computed(() => {
    const data = result.value
    if (!data) return 0
    const total =
      data.allGateways?.totalCount ||
      data.searchGateways?.totalCount ||
      data.filterGateways?.totalCount
    return total || 0
  })

  const hasNextPage = computed(() => {
    return currentPage.value * pageSize.value < totalCount.value
  })

  const hasPreviousPage = computed(() => {
    return currentPage.value > 1
  })

  // mutations
  const {
    mutate: createGateway,
    loading: createLoading,
    error: createError,
  } = useMutation(CREATE_GATEWAY)

  const {
    mutate: updateGateway,
    loading: updateLoading,
    error: updateError,
  } = useMutation(UPDATE_GATEWAY)

  const {
    mutate: deleteGateway,
    loading: deleteLoading,
    error: deleteError,
  } = useMutation(DELETE_GATEWAY)

  const {
    mutate: toggleGatewayStatus,
    loading: toggleLoading,
    error: toggleError,
  } = useMutation(TOGGLE_GATEWAY_STATUS)

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }

  // بجای refetch، فقط filters را تغییر می‌دهیم
  const searchGateways = (query) => {
    filters.value.search = query
    filters.value.addressContains = ''
    filters.value.portMin = null
    filters.value.portMax = null
    filters.value.isActive = null
    currentPage.value = 1
    // refetch حذف شد چون computed properties خودکار انجامش می‌دهند
  }

  const filterGateways = (options) => {
    filters.value = { ...filters.value, ...options, search: '' }
    currentPage.value = 1
    // refetch حذف شد چون computed properties خودکار انجامش می‌دهند
  }

  const resetFilters = () => {
    filters.value = {
      isActive: null,
      addressContains: '',
      portMin: null,
      portMax: null,
      search: '',
    }
    currentPage.value = 1
  }

  // helper methods
  const createNewGateway = async (gatewaysData) => {
    try {
      const { data } = await createGateway({ input: gatewaysData })
      if (data.createGateway.success) {
        await refetch() 
        return { success: true, gateway: data.createGateway.gateway, message: data.createGateway.message }
      }
      return { success: false, message: data.createGateway.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const updateExistingGateway = async (id, updateData) => {
    try {
      const { data } = await updateGateway({ id, input: updateData })
      if (data.updateGateway.success) {
        await refetch()
        return { success: true, gateway: data.updateGateway.gateway, message: data.updateGateway.message }
      }
      return { success: false, message: data.updateGateway.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const deleteGatewayById = async (id) => {
    try {
      const { data } = await deleteGateway({ id: id.toString() })
      if (data.deleteGateway.success) {
        await refetch()
        return { success: true, message: data.deleteGateway.message }
      }
      return { success: false, message: data.deleteGateway.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const toggleStatus = async (id) => {
    try {
      const { data } = await toggleGatewayStatus({ id })
      if (data.toggleGateway.success) {
        await refetch()
        return { success: true, gateway: data.toggleGateway.gateway, message: data.toggleGateway.message }
      }
      return { success: false, message: data.toggleGateway.message }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const isLoading = computed(
    () => gatewaysLoading.value || createLoading.value || updateLoading.value || deleteLoading.value || toggleLoading.value,
  )

  const hasError = computed(
    () => gatewaysError.value || createError.value || updateError.value || deleteError.value || toggleError.value,
  )

  return {
    gateways,
    totalCount,
    pageSize,
    currentPage,
    isLoading,
    createLoading, // جداگانه export کردیم
    hasError,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    searchGateways,
    filterGateways,
    resetFilters,
    createNewGateway,
    updateExistingGateway,
    deleteGatewayById,
    toggleStatus,
    refetch
  }
}