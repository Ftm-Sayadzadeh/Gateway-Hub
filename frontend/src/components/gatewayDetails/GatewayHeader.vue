<template>
  <div>
    <nav class="flex items-center space-x-2 text-sm text-muted mb-8 max-w-8xl mx-auto">
      <router-link to="/gateway-list" class="hover:text-brand transition-colors font-medium flex items-center">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
          </path>
        </svg>
        Gateway Management
      </router-link>
      <svg class="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
      <span class="text-primary font-bold">{{ gateway.name }}</span>
    </nav>

    <!-- Header Section -->
    <div class="card overflow-hidden max-w-8xl mx-auto">
      <div class="relative" style="background: var(--color-sidebar-bg)">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 right-0 w-96 h-96 rounded-full"
            style="background: var(--gradient-brand); transform: translate(50%, -50%)"></div>
        </div>

        <div class="relative z-10 px-8 py-8">
          <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-6 lg:space-y-0">
            <!-- Gateway Info -->
            <div class="flex items-start space-x-6">
              <div class="relative">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style="background: var(--color-brand-primary)">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                    </path>
                  </svg>
                </div>
                <!-- Status Indicator -->
                <div :class="[
                  'absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-white',
                  gateway.isActive ? 'bg-success animate-pulse' : 'bg-gray-400',
                ]"></div>
              </div>

              <div>
                <h1 class="text-3xl font-bold text-white mb-3">{{ gateway.name }}</h1>
                <div class="flex flex-wrap items-center gap-3">
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold',
                    gateway.isActive
                      ? 'bg-success/20 text-green-200 border border-green-400/30'
                      : 'bg-gray-500/20 text-gray-200 border border-gray-400/30',
                  ]">
                    <div :class="[
                      'w-2 h-2 rounded-full mr-2',
                      gateway.isActive ? 'bg-green-300' : 'bg-gray-300',
                    ]"></div>
                    {{ gateway.isActive ? 'Online' : 'Offline' }}
                  </span>
                  <span class="text-gray-300 text-sm bg-white/10 px-3 py-1 rounded-lg">
                    {{ gateway.isLocal ? 'Local Gateway' : 'Remote Gateway' }}
                  </span>
                  <span class="text-gray-300 text-sm bg-white/10 px-3 py-1 rounded-lg font-mono">
                    {{ gateway.address }}:{{ gateway.port }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3">
              <!--  Monitoring Button -->
              <router-link :to="`/gateway/${gatewayId}/monitoring`"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center hover:scale-105 shadow-lg">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                  </path>
                </svg>
                Monitor Logs
              </router-link>

              <!-- Status Toggle -->
              <!--add hidden into this button :))))-->
              <button @click="showToggleConfirm = true" :disabled="toggleLoading" :class="[
                'hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center',
                gateway.isActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-success hover:bg-success-dark text-white',
                toggleLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105',
              ]">
                <div v-if="toggleLoading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="gateway.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"></path>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                {{ toggleLoading ? 'Updating...' : gateway.isActive ? 'Turn Off' : 'Turn On' }}
              </button>

              <button @click="editGateway" class="btn btn-secondary text-white border-white/30 hover:bg-white/20">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                  </path>
                </svg>
                Edit
              </button>

              <button @click="showDeleteConfirm = true" class="btn btn-danger">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                  </path>
                </svg>
                Delete
              </button>
            </div>
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
}
</script>

<style scoped>
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-secondary-bg);
  transform: translateY(-1px);
}

.btn-danger {
  background: var(--gradient-danger);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.text-primary {
  color: var(--color-text-primary);
}

.text-muted {
  color: var(--color-text-muted);
}

.text-brand {
  color: var(--color-brand-primary);
}

.bg-success {
  background-color: var(--color-success);
}
</style>
