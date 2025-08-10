<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            :value="search"
            @input="$emit('update:search', $event.target.value)"
            type="text" 
            placeholder="Search by name or address..."
            class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          >
        </div>
      </div>
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Port Range</label>
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <div class="flex-1">
            <input 
              :value="minPort"
              @input="$emit('update:minPort', $event.target.value ? parseInt($event.target.value) : '')"
              type="number" 
              placeholder="From Port (e.g., 8000)"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            >
          </div>
          <span class="text-gray-500 font-medium">to</span>
          <div class="flex-1">
            <input 
              :value="maxPort"
              @input="$emit('update:maxPort', $event.target.value ? parseInt($event.target.value) : '')"
              type="number" 
              placeholder="To Port (e.g., 9000)"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            >
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center">
      <div class="flex bg-gray-100 p-1 rounded-lg">
        <button
        @click="$emit('update:statusFilter', 'all')"
          :class="[
            'px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200',
            statusFilter === 'all' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          All Gateways
        </button>
        <button
        @click="$emit('update:statusFilter', 'online')"
          :class="[
            'px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200',
            statusFilter === 'online' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          Online
        </button>
        <button
        @click="$emit('update:statusFilter', 'offline')"
          :class="[
            'px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200',
            statusFilter === 'offline' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          Offline
        </button>
      </div>

      <div class="flex bg-gray-100 p-1 rounded-lg">
        <button
        @click="$emit('update:viewMode', 'grid')"
        :class="[
          'w-9 h-9 flex items-center justify-center rounded-md transition-all duration-200',
          viewMode === 'grid'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        ]"
        title="Grid View"
        >
         <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
        </button>
        <button
        @click="$emit('update:viewMode', 'list')"
        :class="[
          'w-9 h-9 flex items-center justify-center rounded-md transition-all duration-200',
          viewMode === 'list'
            ? 'bg-white text-indigo-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        ]"
        title="Grid View"
        >
         <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterSection',
  props: {
    search: String,
    minPort: [String, Number],
    maxPort: [String, Number],
    statusFilter: String,
    viewMode: String
  },
  emits: ['update:search', 'update:minPort', 'update:maxPort', 'update:statusFilter', 'update:viewMode']
}
</script>