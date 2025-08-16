<template>
  <div class="p-8">
    <div v-if="isLoading && gateways.length === 0" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <span class="ml-2 text-gray-600">Loading...</span>
    </div>

    <div v-else-if="hasError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex">
        <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading data</h3>
          <p class="mt-1 text-sm text-red-700">{{ hasError.message || 'Unknown error' }}</p>
          <button @click="refetchGateways()" class="mt-2 text-sm text-red-800 underline hover:text-red-900">
            Retry
          </button>
        </div>
      </div>
    </div>

    <template v-else>
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <h2 class="text-3xl font-bold text-gray-900">Gateway List</h2>
        </div>
        
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <button 
            @click="addGateway"
            :disabled="createLoading"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center space-x-2 rtl:space-x-reverse"
          >
            <svg v-if="!createLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>{{ createLoading ? 'Adding...' : 'Add Gateway' }}</span>
          </button>
          
          <button 
            @click="exportData"
            class="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            title="Export to Excel"
          >
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
          </button>
        </div>
      </div>

      <FilterSection 
        v-model:search="searchTerm"
        v-model:minPort="minPort"
        v-model:maxPort="maxPort"
        v-model:statusFilter="statusFilter"
        v-model:viewMode="viewMode"
        :is-loading="isLoading && gateways.length > 0"
      />
      
      <div v-if="isLoading && gateways.length > 0" class="relative">
        <div class="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <span class="ml-2 text-gray-600 text-sm">Searching...</span>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <GatewayTable 
          v-if="viewMode === 'list'" 
          key="list" 
          :gateways="gateways"
          @view-details="viewDetails"
          @edit-gateway="editGateway"
          @delete-gateway="deleteGateway"
        />

        <GatewayGrid 
          v-else 
          key="grid" 
          :gateways="gateways"
          @view-details="viewDetails"
          @edit-gateway="editGateway"
          @delete-gateway="deleteGateway"
        />
      </transition>

      <div v-if="gateways.length === 0 && !isLoading" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No gateways found</h3>
        <p class="mt-1 text-sm text-gray-500">Change your filters or add a new gateway.</p>
      </div>

      <div v-if="totalCount > pageSize" class="flex justify-between items-center mt-8">
        <span class="text-sm text-gray-700">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalCount) }} of {{ totalCount }} results
        </span>
        <div class="flex space-x-2">
          <button
            @click="previousPage"
            :disabled="!hasPreviousPage || isLoading"
            class="px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200"
            :class="{
              'bg-gray-200 text-gray-600 cursor-not-allowed': !hasPreviousPage || isLoading,
              'bg-indigo-600 text-white hover:bg-indigo-700': hasPreviousPage && !isLoading
            }"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="!hasNextPage || isLoading"
            class="px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200"
            :class="{
              'bg-gray-200 text-gray-600 cursor-not-allowed': !hasNextPage || isLoading,
              'bg-indigo-600 text-white hover:bg-indigo-700': hasNextPage && !isLoading
            }"
          >
            Next
          </button>
        </div>
      </div>
    </template>

    <div v-if="toastMessage" 
      :class="[
        'fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300',
        toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      ]">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import FilterSection from '@/components/gatewaysList/FilterSection.vue'
import GatewayTable from '@/components/gatewaysList/GatewayTable.vue'
import GatewayGrid from '@/components/gatewaysList/GatewayGrid.vue'
import { useGatewaysGraphQL } from '@/composables/useGatewaysGraphQL'

export default {
  name: 'GatewayList',
  components: {
    FilterSection,
    GatewayTable,
    GatewayGrid
  },
  setup() {
    const router = useRouter()
    
    const {
      gateways,
      totalCount,
      pageSize,
      currentPage,
      isLoading,
      createLoading,
      hasError,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
      searchGateways,
      filterGateways,
      deleteGatewayById,
      refetch,
    } = useGatewaysGraphQL()
    
    const viewMode = ref('list')
    const searchTerm = ref('')
    const minPort = ref('')
    const maxPort = ref('')
    const statusFilter = ref('all')

    const toastMessage = ref('')
    const toastType = ref('success')
    let searchDebounce = null
    let filterDebounce = null
    const DEBOUNCE_TIME = 500

    const showToast = (message, type = 'success') => {
      toastMessage.value = message
      toastType.value = type
      setTimeout(() => {
        toastMessage.value = ''
      }, 3000)
    }

    watch(searchTerm, (newVal) => {
      clearTimeout(searchDebounce)
      searchDebounce = setTimeout(async () => {
        const activeElement = document.activeElement
        
        searchGateways(newVal)
        
        await nextTick()
        if (activeElement && activeElement.tagName === 'INPUT') {
          activeElement.focus()
        }
      }, DEBOUNCE_TIME)
    })

    watch([minPort, maxPort, statusFilter], (newValues) => {
      clearTimeout(filterDebounce)
      filterDebounce = setTimeout(async () => {
        const activeElement = document.activeElement
        
        const [newMinPort, newMaxPort, newStatusFilter] = newValues
        const isActive = newStatusFilter === 'all' ? null : newStatusFilter === 'online'
        filterGateways({
          portMin: newMinPort ? Number(newMinPort) : null,
          portMax: newMaxPort ? Number(newMaxPort) : null,
          isActive: isActive,
        })

        await nextTick()
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT')) {
          activeElement.focus()
        }
      }, DEBOUNCE_TIME)
    })

    onUnmounted(() => {
      clearTimeout(searchDebounce)
      clearTimeout(filterDebounce)
    })
    
    const viewDetails = (id) => {
      router.push(`/gateway/${id}`)
    }

    const editGateway = (id) => {
      router.push(`/gateway/${id}/edit`)
    }

    const deleteGateway = async (id) => {
      const gateway = gateways.value.find(g => g.id === id)
      if (confirm(`Are you sure you want to delete gateway "${gateway.name}"?`)) {
        try {
          const result = await deleteGatewayById(id)
          if (result.success) {
            showToast(result.message, 'success')
          } else {
            showToast(result.message, 'error')
          }
        } catch (error) {
          showToast('Error deleting gateway', 'error')
        }
      }
    }

    const addGateway = () => {
      router.push('/gateway/create')
    }

    const exportData = () => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Name,Address,Port,Status\n"
        + gateways.value.map(g => `${g.name},${g.address},${g.port},${g.isActive ? 'Online' : 'Offline'}`).join("\n")
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "gateways.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      showToast('CSV file exported', 'success')
    }

    return {
      viewMode,
      searchTerm,
      minPort,
      maxPort,
      statusFilter,
      gateways,
      totalCount,
      currentPage,
      pageSize,
      isLoading,
      createLoading,
      hasError,
      hasNextPage,
      hasPreviousPage,
      toastMessage,
      toastType,
      viewDetails,
      editGateway,
      deleteGateway,
      addGateway,
      exportData,
      nextPage,
      previousPage,
      refetchGateways: refetch
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>