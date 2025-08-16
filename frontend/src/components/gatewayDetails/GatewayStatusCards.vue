<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <!-- Status Card -->
    <div class="card">
      <div class="card-body text-center p-6">
        <div :class="['w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4',
                     gateway?.isActive 
                       ? 'bg-green-100 border-2 border-green-200' 
                       : 'bg-red-100 border-2 border-red-200']">
          <svg :class="['w-8 h-8', gateway?.isActive ? 'text-green-600' : 'text-red-600']" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="gateway?.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-primary mb-1">
          {{ gateway?.isActive ? 'Online' : 'Offline' }}
        </h3>
        <p class="text-secondary text-sm">Gateway Status</p>
      </div>
    </div>

    <!-- CPU Usage -->
    <div class="card">
      <div class="card-body text-center p-6">
        <div class="relative inline-flex mb-4">
          <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="m18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="3"
            />
            <path
              d="m18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              :stroke="getUsageColor(metrics.cpuUsage, 'cpu')"
              stroke-width="3"
              :stroke-dasharray="`${metrics.cpuUsage}, 100`"
              stroke-linecap="round"
              class="transition-all duration-1000"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xl font-bold" :class="getUsageTextColor(metrics.cpuUsage, 'cpu')">
              {{ metrics.cpuUsage }}%
            </span>
          </div>
        </div>
        <h3 class="text-lg font-bold text-primary mb-1">CPU Usage</h3>
        <p class="text-secondary text-sm">Current load</p>
      </div>
    </div>

    <!-- Memory Usage -->
    <div class="card">
      <div class="card-body text-center p-6">
        <div class="relative inline-flex mb-4">
          <svg class="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="m18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="3"
            />
            <path
              d="m18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              :stroke="getUsageColor(metrics.memoryUsage, 'memory')"
              stroke-width="3"
              :stroke-dasharray="`${metrics.memoryUsage}, 100`"
              stroke-linecap="round"
              class="transition-all duration-1000"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xl font-bold" :class="getUsageTextColor(metrics.memoryUsage, 'memory')">
              {{ metrics.memoryUsage }}%
            </span>
          </div>
        </div>
        <h3 class="text-lg font-bold text-primary mb-1">Memory</h3>
        <p class="text-secondary text-sm">RAM usage</p>
      </div>
    </div>

    <!-- Uptime Card -->
    <div class="card">
      <div class="card-body text-center p-6">
        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-primary mb-1">{{ metrics.uptime }}</h3>
        <p class="text-secondary text-sm">System uptime</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GatewayStatusCards',
  props: {
    gateway: {
      type: Object,
      required: true
    },
    metrics: {
      type: Object,
      required: true
    }
  },
  setup() {
    const getUsageColor = (percentage, type = 'cpu') => {
      const thresholds = type === 'cpu' 
        ? { warning: 60, danger: 80 }
        : { warning: 70, danger: 85 } // Memory thresholds are typically higher
      
      if (percentage > thresholds.danger) return '#ef4444' // Red
      if (percentage > thresholds.warning) return '#f59e0b' // Yellow
      return '#10b981'
    }

    const getUsageTextColor = (percentage, type = 'cpu') => {
      const thresholds = type === 'cpu' 
        ? { danger: 80 }
        : { danger: 85 }
      
      return percentage > thresholds.danger ? 'text-red-600' : 'text-gray-800'
    }

    return {
      getUsageColor,
      getUsageTextColor
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

.card-body {
  padding: 1.5rem;
}

.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
</style>