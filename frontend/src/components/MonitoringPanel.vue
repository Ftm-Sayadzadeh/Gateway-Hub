<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden transition-all duration-300',
      isFullscreen ? 'fixed inset-0 z-50 rounded-none shadow-2xl' : 'h-full'
    ]"
    style="border-color: var(--color-border)"
  >
    <!-- Panel Header -->
    <div 
      class="p-3 sm:p-4 border-b flex items-center justify-between flex-shrink-0" 
      style="background-color: var(--color-secondary-bg); border-color: var(--color-border-light)"
    >
      <div class="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
        <!-- Service Icon -->
        <div 
          class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" 
          style="background-color: var(--color-brand-light)"
        >
          <svg 
            class="w-4 h-4 sm:w-5 sm:h-5" 
            style="color: var(--color-brand-primary)" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path v-if="panel.serviceType === 'Agent'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            <path v-else-if="panel.serviceType === 'Controller'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h6a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2v-4a2 2 0 00-2-2m8 0V9a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2v-3" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        </div>
        
        <!-- Panel Info -->
        <div class="min-w-0 flex-1">
          <h3 
            class="text-sm sm:text-base font-semibold truncate" 
            style="color: var(--color-text-primary)"
          >
            {{ panel.title }}
          </h3>
          <p 
            class="text-xs truncate mt-0.5" 
            style="color: var(--color-text-muted)"
          >
            {{ panel.gatewayName }} - Live Logs
          </p>
        </div>
        
        <!-- Status Indicator -->
        <div v-if="!isFullscreen" class="flex items-center space-x-2 hidden sm:flex">
          <div 
            class="w-2 h-2 rounded-full animate-pulse"
            style="background-color: var(--color-success)"
          ></div>
          <span 
            class="text-xs font-medium"
            style="color: var(--color-success-dark)"
          >
            Live
          </span>
        </div>
      </div>
      
      <!-- Panel Controls -->
      <div class="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4">
        <!-- Font Size Control -->
        <button
          @click="$emit('increase-font', panel.id)"
          class="p-1.5 sm:p-2 rounded-md transition-colors duration-200 hover:bg-gray-100"
          :title="`Font Size: ${panel.fontSize || 14}px`"
          style="color: var(--color-text-muted)"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
        <!-- Duplicate Panel -->
        <button
          @click="$emit('duplicate', panel.id)"
          class="p-1.5 sm:p-2 rounded-md transition-colors duration-200 hover:bg-gray-100 hidden sm:block"
          title="Duplicate Panel"
          style="color: var(--color-text-muted)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v4m0 0v4m0-4h4m-4 0H4m8 8v-4m0 0v-4m0 4h4m-4 0h-4M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" />
          </svg>
        </button>
        
        <!-- Fullscreen Toggle -->
        <button
          @click="$emit('toggle-fullscreen', panel.id)"
          class="p-1.5 sm:p-2 rounded-md transition-colors duration-200 hover:bg-gray-100"
          :title="isFullscreen ? 'Exit Fullscreen (ESC)' : 'Enter Fullscreen'"
          style="color: var(--color-text-muted)"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!isFullscreen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5" />
          </svg>
        </button>
        
        <!-- Remove Panel -->
        <button
          @click="$emit('remove', panel.id)"
          class="p-1.5 sm:p-2 rounded-md transition-colors duration-200"
          style="color: var(--color-text-muted)"
          @mouseenter="$event.target.style.color = 'var(--color-danger)'; $event.target.style.backgroundColor = 'var(--color-danger-light)'"
          @mouseleave="$event.target.style.color = 'var(--color-text-muted)'; $event.target.style.backgroundColor = 'transparent'"
          title="Remove Panel"
        >
          <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Panel Content - Scrollable Log Area -->
    <div 
      class="flex-1 overflow-hidden"
      style="background-color: var(--color-primary-bg)"
    >
      <!-- Empty State -->
      <div 
        v-if="logs.length === 0" 
        class="flex items-center justify-center h-full p-4 sm:p-6"
        style="color: var(--color-text-muted)"
      >
        <div class="text-center max-w-sm">
          <!-- Loading Animation -->
          <div class="relative mb-4">
            <svg 
              class="w-12 h-12 sm:w-16 sm:h-16 mx-auto opacity-30" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <!-- Pulse dots -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="flex space-x-1">
                <div 
                  class="w-1 h-1 rounded-full animate-pulse" 
                  style="background-color: var(--color-brand-primary); animation-delay: 0s"
                ></div>
                <div 
                  class="w-1 h-1 rounded-full animate-pulse" 
                  style="background-color: var(--color-brand-primary); animation-delay: 0.2s"
                ></div>
                <div 
                  class="w-1 h-1 rounded-full animate-pulse" 
                  style="background-color: var(--color-brand-primary); animation-delay: 0.4s"
                ></div>
              </div>
            </div>
          </div>
          
          <h4 class="text-sm sm:text-base font-medium mb-2">Waiting for logs...</h4>
          <p class="text-xs sm:text-sm opacity-75">
            {{ panel.serviceType }} service logs will appear here
          </p>
          
          <!-- Connection Status -->
          <div class="mt-4 flex items-center justify-center space-x-2 text-xs">
            <div 
              class="w-2 h-2 rounded-full animate-pulse"
              style="background-color: var(--color-success)"
            ></div>
            <span style="color: var(--color-success-dark)">Connected</span>
          </div>
        </div>
      </div>

      <!-- Log Content - Scrollable -->
      <div 
        v-else 
        class="h-full overflow-y-auto p-3 sm:p-4 font-mono text-xs sm:text-sm"
        :style="{ 
          fontSize: `${panel.fontSize || 14}px`,
          color: 'var(--color-text-primary)'
        }"
      >
        <div class="space-y-1">
          <div 
            v-for="(log, index) in logs" 
            :key="`${log.id}-${index}`" 
            class="flex items-start hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded transition-colors duration-150"
          >
            <!-- Timestamp -->
            <span 
              class="flex-shrink-0 mr-2 sm:mr-3 whitespace-nowrap text-xs font-medium min-w-0"
              style="color: var(--color-text-muted)"
            >
              {{ formatTime(log.timestamp) }}
            </span>
            
            <!-- Log Level Badge -->
            <span 
              class="flex-shrink-0 mr-2 sm:mr-3 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
              :class="getLogLevelClass(log.level)"
            >
              {{ log.level }}
            </span>
            
            <!-- Log Message -->
            <span 
              class="break-words leading-relaxed flex-1 min-w-0"
              style="color: var(--color-text-primary)"
            >
              {{ log.message }}
            </span>
          </div>
        </div>
        
        <!-- Scroll to Bottom Indicator -->
        <div class="mt-4 text-center">
          <div 
            class="inline-flex items-center space-x-2 text-xs px-3 py-1 rounded-full"
            style="background-color: var(--color-brand-light); color: var(--color-brand-primary)"
          >
            <div class="w-1.5 h-1.5 rounded-full animate-pulse" style="background-color: var(--color-brand-primary)"></div>
            <span>{{ logs.length }} entries</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

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
  emits: ['remove', 'update', 'duplicate', 'toggle-fullscreen', 'increase-font'],
  setup(props) {
    const getLogLevelClass = (level) => {
      const classes = {
        ERROR: 'text-white',
        WARNING: 'text-white', 
        INFO: 'text-white',
        DEBUG: 'text-white'
      }
      return classes[level] || 'text-white'
    }

    const getLogLevelBadgeClass = (level) => {
      return ''
    }

    const formatTime = (timestamp) => {
      try {
        if (typeof timestamp === 'string') {
          if (timestamp.includes(':')) {
            return timestamp
          }
        }
        
        const date = new Date(timestamp)
        return date.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      } catch (e) {
        return timestamp
      }
    }

    const getLogLevelStyle = (level) => {
      const styles = {
        ERROR: { backgroundColor: 'var(--color-danger)' },
        WARNING: { backgroundColor: 'var(--color-warning)' },
        INFO: { backgroundColor: 'var(--color-success)' },
        DEBUG: { backgroundColor: 'var(--color-info)' }
      }
      return styles[level] || { backgroundColor: 'var(--color-info)' }
    }

    return {
      getLogLevelClass,
      getLogLevelBadgeClass,
      formatTime,
      getLogLevelStyle
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--color-border-light);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

@media (max-width: 640px) {
  .font-mono {
    font-size: 11px !important;
  }
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>