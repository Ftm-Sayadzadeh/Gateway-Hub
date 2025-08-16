<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-outo">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Gateway Name</th>
            <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Address</th>
            <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Port</th>
            <th class="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
            <th class="px-6 py-4 text-sm font-semibold text-gray-700 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
          v-for="gateway in gateways"
          :key="gateway.id"
          class="hover:bg-gray-50 transition-colors duration-200"
          >
           <td class="px-6 py-5">
              <div class="flex items-center space-x-3 rtl:space-x-reverse">
                <div class="relative">
                  <div :class="[
                    'w-3 h-3 rounded-full flex-shrink-0 transition-colors duration-300',
                    gateway.isActive ? 'bg-green-500' : 'bg-red-500'
                  ]"></div>
                  <div v-if="gateway.isActive" :class="[
                    'absolute inset-0 w-3 h-3 rounded-full animate-ping',
                    'bg-green-400 opacity-75'
                  ]"></div>
                </div>
                <div class="min-w-0">
                  <div class="font-medium text-gray-900 truncate" :title="gateway.name">
                    {{ gateway.name }}
                  </div>
                </div>
              </div>
            </td>

             <td class="px-6 py-5">
              <span class="font-mono text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                {{ gateway.address }}
              </span>
            </td>

            <td class="px-6 py-5">
              <span class="font-mono font-semibold text-gray-900 bg-indigo-50 px-2 py-1 rounded text-sm">
                {{ gateway.port }}
              </span>
            </td>

            <td class="px-6 py-5">
              <div class="flex items-center space-x-3 rtl:space-x-reverse">
                <span :class="[
                  'inline-flex px-3 py-1 text-xs font-medium rounded-full transition-colors duration-300',
                  gateway.isActive
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ gateway.isActive ? 'Online' : 'Offline' }}
                </span>
              </div>
            </td>

            <td class="px-6 py-5">
              <div class="flex justify-center space-x-1 rtl:space-x-reverse">
                <button
                @click="$emit('view-details', gateway.id)"
                class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200 group"
                  title="View Details"
                >
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
                <button
                @click="$emit('delete-gateway', gateway.id)"
                class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button 
                  @click="$emit('delete-gateway', gateway.id)"
                  class="p-2 text-gray-400  hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  title="Delete"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GatewayTable',
  props: {
    gateways: {
      type: Array,
      required: true
    }
  },
  emits: ['view-details', 'edit-gateway', 'delete-gateway'],
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR') + ' ' + date.toLocaleTimeString('fa-IR');
    }
  }
}
</script>