<template>
  <div class="min-h-screen gradient-bg p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Gateway List</h1>
      <button 
        class="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors duration-200"
        @click="addNewGateway"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Add Gateway
      </button>
    </div>

    <FilterSection
      :search="filters.search"
      :minPort="filters.minPort"
      :maxPort="filters.maxPort"
      :statusFilter="filters.statusFilter"
      :viewMode="filters.viewMode"
      @update:search="updateFilter('search', $event)"
      @update:minPort="updateFilter('minPort', $event)"
      @update:maxPort="updateFilter('maxPort', $event)"
      @update:statusFilter="updateFilter('statusFilter', $event)"
      @update:viewMode="updateFilter('viewMode', $event)"
    />

    <div class="mt-8 bg-white rounded-xl p-8 shadow-sm">
      <h2 class="text-xl font-bold text-gray-900 mb-4">
        Filtered Gateways ({{ filteredGateways.length }})
      </h2>
      <div v-if="filteredGateways.length > 0">
        <ul class="space-y-4">
          <li v-for="gateway in filteredGateways" :key="gateway.id" class="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
            <span class="font-semibold">{{ gateway.name }}</span>
            <span :class="[
              'px-3 py-1 text-xs font-semibold rounded-full',
              gateway.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            ]">
              {{ gateway.isActive ? 'Online' : 'Offline' }}
            </span>
          </li>
        </ul>
      </div>
      <div v-else class="text-center text-gray-500 py-10">
        No gateways found matching your criteria.
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import FilterSection from '../components/FilterSection.vue';

export default {
  name: 'GatewayListPage',
  components: {
    FilterSection
  },
  setup() {
    // Dummy data for demonstration purposes
    const allGateways = ref([
      { id: 1, name: 'my Sensor Hub', address: '192.16.0.10', port: 8000, isActive: true },
      { id: 2, name: 'random2 Sensor Hub', address: '192.16.0.10', port: 9000, isActive: false },
      { id: 3, name: 'random Sensor Hub', address: '192.16.0.10', port: 8080, isActive: true },
      { id: 4, name: 'Test Gateway', address: '192.168.1.100', port: 8000, isActive: false },
      { id: 5, name: 'Warehouse Gateway', address: '10.0.0.5', port: 9000, isActive: true },
      { id: 6, name: 'IoT Sensor Hub', address: '172.16.0.10', port: 8080, isActive: true },
      { id: 7, name: 'Main Office Gateway', address: '192.168.1.1', port: 8000, isActive: false },
    ]);

    // State for filters
    const filters = ref({
      search: '',
      minPort: '',
      maxPort: '',
      statusFilter: 'all',
      viewMode: 'grid'
    });

    // Method to update filters
    const updateFilter = (key, value) => {
      filters.value[key] = value;
    };

    // Computed property for filtered gateways
    const filteredGateways = computed(() => {
      return allGateways.value.filter(gateway => {
        const searchMatch = !filters.value.search || 
                          gateway.name.toLowerCase().includes(filters.value.search.toLowerCase()) || 
                          gateway.address.toLowerCase().includes(filters.value.search.toLowerCase());

        const minPortMatch = !filters.value.minPort || gateway.port >= filters.value.minPort;
        const maxPortMatch = !filters.value.maxPort || gateway.port <= filters.value.maxPort;

        const statusMatch = filters.value.statusFilter === 'all' || 
                           (filters.value.statusFilter === 'online' && gateway.isActive) ||
                           (filters.value.statusFilter === 'offline' && !gateway.isActive);

        return searchMatch && minPortMatch && maxPortMatch && statusMatch;
      });
    });

    const addNewGateway = () => {
      alert('Adding a new gateway...');
    };

    return {
      filters,
      filteredGateways,
      updateFilter,
      addNewGateway
    };
  }
};
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}
</style>