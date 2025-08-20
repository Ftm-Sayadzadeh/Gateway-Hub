<template>
  <div class="card">
    <div class="card-header">
      <div class="flex items-center">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
             style="background: var(--color-success-light);">
          <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-primary">Gateway Information</h3>
          <p class="text-sm text-secondary">System details and metadata</p>
        </div>
      </div>
    </div>
    
    <div class="card-body space-y-4">
      <div class="grid grid-cols-1 gap-4">
        <!-- Gateway Type -->
        <div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
          <span class="text-gray-600 font-medium flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Gateway Type
          </span>
          <span class="text-gray-900 font-bold">
            {{ gateway.isLocal ? 'Local Gateway' : 'Remote Gateway' }}
          </span>
        </div>

        <!-- Created Date -->
        <div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
          <span class="text-gray-600 font-medium flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9l2 2 4-4"></path>
            </svg>
            Created Date
          </span>
          <span class="text-gray-900 font-bold">{{ formatDate(gateway.createdAt) }}</span>
        </div>

        <!-- Last Updated -->
        <div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
          <span class="text-gray-600 font-medium flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Last Updated
          </span>
          <span class="text-gray-900 font-bold">{{ formatDate(gateway.updatedAt) }}</span>
        </div>

        <!-- Current Status -->
        <div class="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
          <span class="text-gray-600 font-medium flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Current Status
          </span>
          <span :class="['font-bold px-3 py-1 rounded-full text-sm inline-flex items-center',
                        gateway.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800']">
            <div :class="['w-2 h-2 rounded-full mr-2',
                         gateway.isActive ? 'bg-green-500' : 'bg-red-500']"></div>
            {{ gateway.isActive ? 'Active & Running' : 'Inactive' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GatewayInformation',
  props: {
    gateway: {
      type: Object,
      required: true
    },
    showMetadata: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getPortClassification = (port) => {
      if (port < 1024) return 'System Port'
      if (port < 49152) return 'Registered Port'
      return 'Dynamic Port'
    }

    return {
      formatDate,
      getPortClassification
    }
  }
}
</script>

<style scoped>
.card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-surface);
}

.card-body {
  padding: 1.5rem;
}

.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-success { color: var(--color-success); }
</style>