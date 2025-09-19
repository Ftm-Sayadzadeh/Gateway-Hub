<template>
  <div 
    :class="[
      'bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col transition-all duration-200',
      isFullscreen 
        ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' 
        : 'h-96'
    ]"
  >
    <!-- Panel Header -->
    <div class="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50 rounded-t-xl flex-shrink-0">
      <!-- Service Icon & Title -->
      <div class="flex items-center space-x-3 min-w-0 flex-1">
        <!-- Service Icon -->
        <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        
        <!-- Panel Info -->
        <div class="min-w-0 flex-1">
          <h3 class="text-sm font-semibold text-gray-900 truncate">
            {{ panel.serviceType }} Logs
          </h3>
          <p class="text-xs text-gray-500 truncate">
            {{ panel.gatewayName || 'Gateway' }} - Live Stream
          </p>
        </div>
        
        <!-- Live Status -->
        <div class="flex items-center space-x-1 flex-shrink-0">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-xs font-medium text-green-600">LIVE</span>
        </div>
      </div>
      
      <!-- Panel Controls -->
      <div class="flex items-center space-x-1 ml-3 flex-shrink-0">
        <!-- Font Size Decrease -->
        <button
          @click="$emit('decrease-font', panel.id)"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Decrease Font Size"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
          </svg>
        </button>
        
        <!-- Font Size Increase -->
        <button
          @click="$emit('increase-font', panel.id)"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Increase Font Size"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
        
        <!-- Duplicate -->
        <button
          @click="$emit('duplicate', panel.id)"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Duplicate Panel"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
        </button>
        
        <!-- Fullscreen Toggle -->
        <button
          @click="$emit('toggle-fullscreen', panel.id)"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          :title="isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'"
        >
          <svg v-if="!isFullscreen" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9V4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5m0 0h4.5m-4.5 0l5.5 5.5"></path>
          </svg>
        </button>
        
        <!-- Close -->
        <button
          @click="$emit('remove', panel.id)"
          class="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Close Panel"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Logs Container -->
    <div class="flex-1 overflow-hidden bg-white border-t relative">
      <!-- Empty State -->
      <div v-if="!logs || logs.length === 0" class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h4 class="text-sm font-medium text-gray-600 mb-2">Waiting for logs...</h4>
          <p class="text-xs text-gray-400">{{ panel.serviceType }} service logs will appear here</p>
        </div>
      </div>

      <!-- Logs List -->
      <div 
        v-else 
        ref="logsContainer"
        class="h-full overflow-y-auto p-3 space-y-0.5 logs-container"
        @scroll="handleScroll"
      >
        <div 
          v-for="(log, index) in logs" 
          :key="`${log.id}-${index}`" 
          class="font-mono leading-relaxed hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors group border-l-2"
          :class="[getLogBorderClass(log.level), panel.fontSize || 'text-xs']"
        >
          <!-- Log Message -->
          <span class="text-gray-800 block break-all">
            {{ log.message }}
          </span>
        </div>
      </div>

      <!-- Scroll to Bottom Button -->
      <div 
        v-if="!isAtBottom && logs && logs.length > 0"
        class="absolute bottom-4 right-4"
      >
        <button
          @click="scrollToBottom"
          class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-full shadow-lg flex items-center space-x-2 transition-all"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          <span>New logs</span>
        </button>
      </div>

      <!-- Log Count & Font Size Indicator -->
      <div class="absolute top-2 right-2 flex items-center space-x-2">
        <span class="px-2 py-1 bg-blue-100 bg-opacity-90 text-blue-700 text-xs rounded-full border font-medium">
          {{ getFontSizeLabel(panel.fontSize) }}
        </span>
        <span class="px-2 py-1 bg-gray-100 bg-opacity-90 text-gray-600 text-xs rounded-full border">
          {{ logs ? logs.length : 0 }} entries
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, watch } from 'vue'

export default {
  name: 'MonitoringPanel',
  props: {
    panel: {
      type: Object,
      required: true
    },
    logs: {
      type: Array,
      default: () => []
    },
    isFullscreen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['remove', 'update', 'duplicate', 'toggle-fullscreen', 'increase-font', 'decrease-font'],
  setup(props) {
    const logsContainer = ref(null)
    const isAtBottom = ref(true)

    const formatTime = (timestamp) => {
      try {
        if (typeof timestamp === 'string' && timestamp.includes('-')) {
          return timestamp.split('|')[0] 
        }
        
        const date = new Date(timestamp)
        return date.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      } catch (e) {
        return '00:00:00'
      }
    }

    const getLogBorderClass = (level) => {
      const classes = {
        'E': 'border-red-500', // Error
        'W': 'border-yellow-500', // Warning
        'I': 'border-blue-500', // Info
        'D': 'border-gray-500', // Debug
        'T': 'border-purple-500' // Trace
      }
      return classes[level] || 'border-gray-300'
    }

    const getFontSizeLabel = (fontSize) => {
      const labels = {
        'text-xs': 'XS',
        'text-sm': 'SM', 
        'text-base': 'MD',
        'text-lg': 'LG'
      }
      return labels[fontSize] || 'XS'
    }

    const getLogLevelClass = (level) => {
      const classes = {
        'E': 'bg-red-600 text-white',
        'W': 'bg-yellow-600 text-white', 
        'I': 'bg-blue-600 text-white',
        'D': 'bg-gray-600 text-white',
        'T': 'bg-purple-600 text-white'
      }
      return classes[level] || 'bg-gray-600 text-white'
    }

    const checkIfAtBottom = () => {
      if (!logsContainer.value) return

      const { scrollTop, scrollHeight, clientHeight } = logsContainer.value
      isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 5
    }

    const scrollToBottom = () => {
      if (!logsContainer.value) return
      
      logsContainer.value.scrollTop = logsContainer.value.scrollHeight
      isAtBottom.value = true
    }

    // handle scroll event
    const handleScroll = () => {
      checkIfAtBottom()
    }

    watch(() => props.logs, async () => {
      if (isAtBottom.value) {
        await nextTick()
        scrollToBottom()
      }
    }, { deep: true })

    return {
      logsContainer,
      isAtBottom,
      formatTime,
      getLogLevelClass,
      getLogBorderClass,
      getFontSizeLabel,
      scrollToBottom,
      handleScroll
    }
  }
}
</script>

<style scoped>
.logs-container::-webkit-scrollbar {
  width: 8px;
}

.logs-container::-webkit-scrollbar-track {
  background: #f3f4f6; /* gray-100 */
  border-radius: 4px;
}

.logs-container::-webkit-scrollbar-thumb {
  background: #d1d5db; /* gray-300 */
  border-radius: 4px;
}

.logs-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af; /* gray-400 */
}

.logs-container {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

@keyframes newLog {
  0% {
    background-color: rgba(59, 130, 246, 0.1);
    transform: translateX(-5px);
  }
  100% {
    background-color: transparent;
    transform: translateX(0);
  }
}

.logs-container > div:first-child {
  animation: newLog 0.8s ease-out;
}

.logs-container div {
  line-height: 1.4;
}

.logs-container div:hover {
  background-color: #f8fafc !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>