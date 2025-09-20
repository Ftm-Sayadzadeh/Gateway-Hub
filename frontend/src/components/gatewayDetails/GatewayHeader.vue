<template>
  <div>
    <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-6 max-w-8xl mx-auto">
      <router-link to="/gateway-list" class="hover:text-indigo-600 transition-colors font-medium flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
          </path>
        </svg>
        Gateway Management
      </router-link>
      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
      <span class="text-gray-900 font-semibold">{{ gateway.name }}</span>
    </nav>

    <!-- Header Section -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-8xl mx-auto">
      <div class="relative bg-gradient-to-br from-gray-50 to-white">
        <!-- Subtle decorative background -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100/30 to-purple-100/20 rounded-full transform translate-x-48 -translate-y-48"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-100/20 to-cyan-100/20 rounded-full transform -translate-x-32 translate-y-32"></div>
        </div>

        <div class="relative z-10 px-6 lg:px-8 py-8">
          <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-6 lg:space-y-0">
            <!-- Gateway Info -->
            <div class="flex items-start space-x-4">
              <div class="relative">
                <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                    </path>
                  </svg>
                </div>
                <!-- Status Indicator -->
                <div :class="[
                  'absolute -top-1 -right-1 w-6 h-6 rounded-full border-3 border-white shadow-sm',
                  gateway.isActive ? 'bg-green-500' : 'bg-gray-400',
                ]">
                  <div v-if="gateway.isActive" class="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </div>

              <div>
                <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{{ gateway.name }}</h1>
                <div class="flex flex-wrap items-center gap-3">
                  <span :class="[
                    'inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border',
                    gateway.isActive
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-gray-50 text-gray-600 border-gray-200',
                  ]">
                    <div :class="[
                      'w-2 h-2 rounded-full mr-2',
                      gateway.isActive ? 'bg-green-500' : 'bg-gray-400',
                    ]"></div>
                    {{ gateway.isActive ? 'Online' : 'Offline' }}
                  </span>
                  <span class="text-gray-600 text-sm bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                    {{ gateway.isLocal ? 'Local Gateway' : 'Remote Gateway' }}
                  </span>
                  <span class="text-gray-600 text-sm bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg font-mono">
                    {{ gateway.address }}:{{ gateway.port }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3">
              <!-- Monitoring Button -->
              <router-link :to="`/gateway/${gatewayId}/monitoring`"
                class="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:-translate-y-0.5 min-w-[140px] justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                  </path>
                </svg>
                <span>Monitor Logs</span>
              </router-link>

              <!-- Status Toggle (Hidden) -->
              <button @click="showToggleConfirm = true" :disabled="loading.toggle" :class="[
                'hidden h-10 px-4 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 min-w-[100px] justify-center',
                gateway.isActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white',
                loading.toggle ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5',
              ]">
                <div v-if="loading.toggle" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="gateway.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"></path>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span>{{ loading.toggle ? 'Updating...' : gateway.isActive ? 'Turn Off' : 'Turn On' }}</span>
              </button>

              <!-- Edit Button -->
              <button @click="editGateway" class="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-sm hover:-translate-y-0.5 min-w-[80px] justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                  </path>
                </svg>
                <span>Edit</span>
              </button>

              <!-- Delete Button -->
              <button @click="showDeleteConfirm = true" class="h-10 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:-translate-y-0.5 min-w-[90px] justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                  </path>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toggle Status Confirmation Modal -->
    <div v-if="showToggleConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity" @click="showToggleConfirm = false"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center mb-4">
            <div :class="[
              'w-12 h-12 rounded-full flex items-center justify-center mr-4',
              gateway.isActive ? 'bg-red-100' : 'bg-green-100'
            ]">
              <svg class="w-6 h-6" :class="gateway.isActive ? 'text-red-600' : 'text-green-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="gateway.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ gateway.isActive ? 'Turn Off Gateway' : 'Turn On Gateway' }}
              </h3>
              <p class="text-sm text-gray-500">Confirm status change</p>
            </div>
          </div>

          <!-- Content -->
          <div class="mb-6">
            <p class="text-gray-700">
              Are you sure you want to 
              <strong class="text-gray-900">{{ gateway.isActive ? 'turn off' : 'turn on' }}</strong>
              the gateway <strong class="text-gray-900">"{{ gateway.name }}"</strong>?
            </p>
            <p class="text-sm text-gray-500 mt-2">
              {{ gateway.isActive 
                ? 'This will stop all gateway services and connections.' 
                : 'This will start the gateway services and establish connections.' 
              }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3">
            <button 
              @click="showToggleConfirm = false"
              class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="confirmToggle"
              :disabled="loading.toggle"
              :class="[
                'flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center',
                gateway.isActive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              ]"
            >
              <div v-if="loading.toggle" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ loading.toggle ? 'Updating...' : gateway.isActive ? 'Turn Off' : 'Turn On' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity" @click="showDeleteConfirm = false"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z">
                </path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Delete Gateway</h3>
              <p class="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>

          <!-- Content -->
          <div class="mb-6">
            <p class="text-gray-700">
              Are you sure you want to delete the gateway 
              <strong class="text-gray-900">"{{ gateway.name }}"</strong>?
            </p>
            <p class="text-sm text-gray-500 mt-2">
              All associated data and configurations will be permanently removed.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex space-x-3">
            <button 
              @click="showDeleteConfirm = false"
              class="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="confirmDelete"
              :disabled="loading.delete"
              class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <div v-if="loading.delete" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ loading.delete ? 'Deleting...' : 'Delete Gateway' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GatewayHeader',
  props: {
    gateway: {
      type: Object,
      required: true,
    },
    gatewayId: {
      type: String,
      required: true,
    },
    loading: {
      type: Object,
      default: () => ({
        toggle: false,
        edit: false,
        delete: false,
      }),
    },
  },
  emits: ['toggle-status', 'edit', 'delete'],
  data() {
    return {
      showDeleteConfirm: false,
      showToggleConfirm: false
    }
  },
  methods: {
    editGateway() {
      this.$emit('edit', this.gatewayId)
    },
    confirmDelete() {
      this.$emit('delete', this.gatewayId)
      this.showDeleteConfirm = false
    },
    confirmToggle() {
      this.$emit('toggle-status', this.gatewayId)
      this.showToggleConfirm = false
    }
  }
}
</script>