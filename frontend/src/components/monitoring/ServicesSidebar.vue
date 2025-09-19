<template>
  <div 
    :class="[
      'transition-all duration-300 shadow-lg border-r flex flex-col',
      collapsed ? 'w-16' : 'w-64 sm:w-80'
    ]"
    style="
      background-color: var(--color-primary-bg); 
      border-color: var(--color-border);
      min-height: 100vh;
    "
  >
    <!-- Sidebar Header -->
    <div 
      class="p-3 sm:p-4 border-b flex-shrink-0" 
      style="border-color: var(--color-border-light)"
    >
      <div class="flex items-center justify-between">
        <!-- Header Content -->
        <div v-if="!collapsed" class="flex items-center space-x-3 min-w-0 flex-1">
          <!-- <div 
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md" 
            style="background: var(--gradient-brand)"
          >
            <svg class="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div> -->
          <div class="min-w-0">
            <h3 
              class="text-sm sm:text-lg font-bold truncate" 
              style="color: var(--color-text-primary)"
            >
              Services
            </h3>
            <span 
              class="text-xs px-2 py-1 rounded-full" 
              style="
                background-color: var(--color-brand-light); 
                color: var(--color-brand-primary);
              "
            >
              {{ mode === 'single' ? 'Single Gateway' : 'Multi Gateway' }}
            </span>
          </div>
        </div>
        
        <!-- Collapse Toggle -->
        <button 
          @click="toggleCollapse"
          class="p-2 rounded-lg transition-colors hover:bg-gray-100"
          style="color: var(--color-text-muted)"
          :title="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        >
          <svg 
            :class="['w-4 h-4 transition-transform', collapsed ? 'rotate-180' : '']" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Sidebar Content -->
    <div v-if="!collapsed" class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
      <!-- Services Section -->
      <div class="space-y-3">
        <!-- Services Header -->
        <div class="flex items-center justify-between p-2">
          <h5 
            class="text-sm font-semibold" 
            style="color: var(--color-text-primary)"
          >
            Available Services
          </h5>
          <span 
            class="text-xs px-2 py-1 rounded-full font-medium"
            style="background-color: var(--color-secondary-bg); color: var(--color-text-secondary)"
          >
            {{ availableServices.length }}
          </span>
        </div>
        
        <!-- Services List -->
        <div class="space-y-2">
          <!-- Single Gateway Mode -->
          <template v-if="mode === 'single'">
            <div
              v-for="service in availableServices"
              :key="service.value"
              @click="() => { 
                console.log('🖱️ Service clicked:', service.name); 
                console.log('🔍 About to call addServicePanel with service:', service);
                addServicePanel(service); 
              }"
              :class="[
                'w-full flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 text-left border-2 hover:shadow-md',
                isServiceActive(service.name) 
                  ? 'border-2 border-indigo-500 bg-indigo-50 shadow-md' 
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              ]"
            >
              <!-- Service Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <span 
                    class="text-sm font-semibold truncate"
                    :style="{ color: isServiceActive(service.name) ? 'var(--color-brand-primary)' : 'var(--color-text-primary)' }"
                  >
                    {{ service.name }}
                  </span>
                  <div 
                    v-if="isServiceActive(service.name)"
                    class="w-2 h-2 rounded-full animate-pulse flex-shrink-0 ml-2"
                    style="background-color: var(--color-success)"
                  ></div>
                </div>
                <span 
                  class="text-xs block truncate" 
                  style="color: var(--color-text-muted)"
                >
                  {{ service.description }}
                </span>
              </div>
            </div>
          </template>
          
          <!-- Multi Gateway Mode -->
          <template v-else>
            <div v-for="gateway in gateways" :key="gateway.id" class="space-y-1 mb-3">
              <!-- Gateway Header (Clickable to expand/collapse) -->
              <div 
                @click="toggleGatewayExpansion(gateway.id)"
                class="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 border-2 hover:shadow-sm hover:border-indigo-300 hover:bg-indigo-50"
                :class="{
                  'border-indigo-500 bg-indigo-50': isGatewayExpanded(gateway.id),
                  'border-gray-200': !isGatewayExpanded(gateway.id)
                }"
              >
                <div class="flex items-center space-x-2">
                  <h6 
                    class="text-sm font-semibold truncate" 
                    :style="{ 
                      color: isGatewayExpanded(gateway.id) ? 'var(--color-brand-primary)' : 'var(--color-text-primary)'
                    }"
                  >
                    {{ gateway.name }}
                  </h6>
                  <div 
                    class="w-2 h-2 rounded-full flex-shrink-0"
                    :style="{ 
                      backgroundColor: gateway.isActive ? 'var(--color-success)' : 'var(--color-danger)' 
                    }"
                  ></div>
                </div>
                
                <!-- Expand/Collapse Arrow -->
                <svg 
                  :class="['w-4 h-4 transition-transform duration-200', isGatewayExpanded(gateway.id) ? 'rotate-90' : '']"
                  style="color: var(--color-text-muted)"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <!-- Gateway Services (Collapsible) -->
              <transition name="slide-down">
                <div 
                  v-if="isGatewayExpanded(gateway.id)"
                  class="space-y-1 pl-4" 
                >
                  <div
                    v-for="service in availableServices"
                    :key="`${gateway.id}-${service.value}`"
                    @click.stop="addMultiServicePanel(gateway, service)"
                    :class="[
                      'w-full flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-200 text-left border hover:shadow-sm hover:border-indigo-300 hover:bg-indigo-50',
                      isServiceActive(service.name, gateway.id) 
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                        : 'border-gray-200'
                    ]"
                  >
                    <!-- Service Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <span 
                          class="text-sm font-medium truncate"
                          :style="{ 
                            color: isServiceActive(service.name, gateway.id) ? 'var(--color-brand-primary)' : 'var(--color-text-primary)'
                          }"
                        >
                          {{ service.name }}
                        </span>
                        <div 
                          v-if="isServiceActive(service.name, gateway.id)"
                          class="w-2 h-2 rounded-full animate-pulse flex-shrink-0 ml-2"
                          style="background-color: var(--color-success)"
                        ></div>
                      </div>
                      <span 
                        class="text-xs block truncate" 
                        style="color: var(--color-text-muted)"
                      >
                        {{ service.description }}
                      </span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Collapsed State Icons -->
    <div v-else class="flex-1 flex flex-col items-center py-4 space-y-3">
      <!-- Gateway Status Icon -->
      <div 
        v-if="mode === 'single' && currentGateway"
        class="relative"
        :title="`${currentGateway.name} - ${currentGateway.isActive ? 'Online' : 'Offline'}`"
      >
        <div 
          class="w-8 h-8 rounded-lg flex items-center justify-center" 
          style="background: var(--gradient-brand)"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div 
          class="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white"
          :style="{ 
            backgroundColor: currentGateway.isActive ? 'var(--color-success)' : 'var(--color-danger)' 
          }"
        ></div>
      </div>

      <!-- Simple Service Names -->
      <div 
        v-for="service in availableServices" 
        :key="service.value"
        class="text-xs text-center cursor-pointer hover:text-indigo-600 transition-colors"
        :style="{ 
          color: isServiceActive(service.name) ? 'var(--color-brand-primary)' : 'var(--color-text-muted)'
        }"
        :title="service.name"
        @click="addServicePanel(service)"
      >
        {{ service.name.charAt(0) }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ServicesSidebar',
  props: {
    mode: {
      type: String,
      default: 'single', // 'single' or 'multi'
      validator: (value) => ['single', 'multi'].includes(value)
    },
    currentGateway: {
      type: Object,
      default: null
    },
    gateways: {
      type: Array,
      default: () => []
    },
    availableServices: {
      type: Array,
      default: () => [
        { name: 'Agent', value: 'GATEWAY_AGENT', description: 'Gateway Agent Service' },
        { name: 'Controller', value: 'CONTROLLER', description: 'Gateway Controller Service' },
        { name: 'Setting', value: 'SETTING', description: 'Gateway Setting Service' }
      ]
    },
    activePanelCount: {
      type: Number,
      default: 0
    },
    activeServices: {
      type: Array,
      default: () => []
    }
  },
  emits: ['add-panel', 'toggle-collapse'],
  setup(props, { emit }) {
    const collapsed = ref(false)
    const expandedGateways = ref(new Set())

    const toggleCollapse = () => {
      collapsed.value = !collapsed.value
      emit('toggle-collapse', collapsed.value)
    }

    const toggleGatewayExpansion = (gatewayId) => {
      if (expandedGateways.value.has(gatewayId)) {
        expandedGateways.value.delete(gatewayId)
      } else {
        expandedGateways.value.add(gatewayId)
      }
    }

    const isGatewayExpanded = (gatewayId) => {
      return expandedGateways.value.has(gatewayId)
    }

    const isServiceActive = (serviceName, gatewayId = null) => {
      if (props.mode === 'single') {
        return props.activeServices.includes(serviceName)
      } else {
        return props.activeServices.some(service => 
          service.name === serviceName && 
          (gatewayId ? service.gatewayId === gatewayId : true)
        )
      }
    }

    const addServicePanel = (service) => {
      if (props.mode === 'single' && props.currentGateway) {
        emit('add-panel', {
          gatewayId: props.currentGateway.id,
          gatewayName: props.currentGateway.name,
          serviceType: service.name,
          logType: service.value,
          mode: 'single'
        })
      }
    }

    const addMultiServicePanel = (gateway, service) => {
      emit('add-panel', {
        gatewayId: gateway.id,
        gatewayName: gateway.name,
        serviceType: service.name,
        logType: service.value,
        mode: 'multi'
      })
    }

    return {
      collapsed,
      expandedGateways,
      toggleCollapse,
      toggleGatewayExpansion,
      isGatewayExpanded,
      isServiceActive,
      addServicePanel,
      addMultiServicePanel
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: var(--color-border-light);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 640px) {
  .w-64 {
    width: 16rem;
  }
  .w-80 {
    width: 18rem;
  }
}
</style>