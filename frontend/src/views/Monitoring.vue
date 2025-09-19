<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <ServicesSidebar mode="multi" :gateways="availableGateways"
      :service-filter="['GATEWAY_AGENT', 'CONTROLLER', 'SETTING']" @add-panel="addPanelFromSidebar"
      @toggle-collapse="handleSidebarToggle" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-4 lg:px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-gray-900">
                Multi-Gateway Monitoring
              </h1>
              <p class="text-sm text-gray-500 mt-1">
                Real-time monitoring across multiple gateways
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 ml-2">
                  {{ activePanels.length }} Active Panel{{ activePanels.length !== 1 ? 's' : '' }}
                </span>
              </p>
            </div>

            <!-- Controls -->
            <div class="flex items-center space-x-3">
              <!-- Layout Selector -->
              <div class="relative">
                <button @click="showLayoutDropdown = !showLayoutDropdown"
                  class="h-10 px-3 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 min-w-[120px] justify-center">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z">
                    </path>
                  </svg>
                  <span>{{ currentLayout.name }}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                <!-- Layout Dropdown -->
                <div v-show="showLayoutDropdown"
                  class="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div class="px-3 py-2 border-b border-gray-100">
                    <h3 class="text-sm font-semibold text-gray-900">Choose Layout</h3>
                    <p class="text-xs text-gray-500 mt-1">Select the best layout for monitoring multiple gateways</p>
                  </div>

                  <div class="py-1">
                    <button v-for="layout in layouts" :key="layout.key" @click="setLayout(layout.key)" :class="[
                      'w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group',
                      layout.key === currentLayoutKey ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                    ]">
                      <div class="flex items-start space-x-3">
                        <!-- Layout Icon -->
                        <div :class="[
                          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono transition-colors',
                          layout.key === currentLayoutKey
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                        ]">
                          {{ layout.icon }}
                        </div>

                        <!-- Layout Info -->
                        <div class="flex-1 min-w-0">
                          <div :class="[
                            'text-sm font-medium transition-colors',
                            layout.key === currentLayoutKey ? 'text-indigo-700' : 'text-gray-900'
                          ]">
                            {{ layout.name }}
                          </div>
                          <div :class="[
                            'text-xs mt-0.5 transition-colors',
                            layout.key === currentLayoutKey ? 'text-indigo-600' : 'text-gray-500'
                          ]">
                            {{ layout.description }}
                          </div>
                          <div :class="[
                            'text-xs mt-1 transition-colors',
                            layout.key === currentLayoutKey ? 'text-indigo-500' : 'text-gray-400'
                          ]">
                            {{ layout.usage }}
                          </div>
                        </div>

                        <!-- Selected Indicator -->
                        <div v-if="layout.key === currentLayoutKey" class="flex-shrink-0">
                          <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </div>

                  <!-- Quick Tips -->
                  <div class="px-4 py-3 border-t border-gray-100 bg-gray-50">
                    <div class="text-xs text-gray-600">
                      <div class="font-medium mb-2">Quick Tips:</div>
                      <div class="space-y-1">
                        <div>• Single View for detailed monitoring</div>
                        <div>• Split View to compare services</div>
                        <div>• Dashboard for overview of all gateways</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Auto Refresh Toggle -->
              <button @click="toggleAutoRefresh" :class="[
                'h-10 px-3 border rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 min-w-[80px] justify-center',
                isAutoRefresh
                  ? 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              ]" :title="isAutoRefresh ? 'Auto Refresh: ON' : 'Auto Refresh: OFF'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                  </path>
                </svg>
                <span class="text-xs font-medium hidden sm:inline">
                  {{ isAutoRefresh ? 'ON' : 'OFF' }}
                </span>
              </button>

              <!-- Gateway Management Link -->
              <router-link to="/gateways"
                class="h-10 px-3 border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 min-w-[140px] justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                  </path>
                </svg>
                <span>Manage Gateways</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1 p-4 lg:p-6 overflow-auto">
        <!-- Monitoring Panels -->
        <div v-if="activePanels.length > 0" :class="[
          'grid gap-4 transition-all duration-300',
          activePanels.some(p => p.isFullscreen)
            ? 'fixed inset-0 z-50 bg-white p-4' : currentLayout.gridClass
        ]">
          <MonitoringPanel v-for="panel in activePanels" :key="panel.id" :panel="panel" :logs="getLogsForPanel(panel)"
            :is-fullscreen="panel.isFullscreen" @remove="removePanel" @update="updatePanel" @duplicate="duplicatePanel"
            @toggle-fullscreen="toggleFullscreen" @increase-font="increaseFont" @decrease-font="decreaseFont" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 lg:py-16">
          <div class="max-w-md mx-auto">
            <div class="relative mb-8">
              <svg class="mx-auto h-20 w-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                </path>
              </svg>
              <!-- Decorative elements -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style="animation-delay: 0s;"></div>
                  <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
                  <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
                </div>
              </div>
            </div>

            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              Ready to Monitor Multiple Gateways
            </h3>
            <p class="text-gray-600 mb-8 leading-relaxed text-lg">
              Select a gateway and service from the sidebar to start monitoring live logs across your network.
            </p>

            <!-- Quick Start Actions -->
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <div class="text-sm text-gray-500">
                Available Gateways: <span class="font-medium text-green-600">{{availableGateways.filter(g =>
                  g.isActive).length}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <ToastNotification :visible="!!toastMessage" :type="toastType" :message="toastMessage" :duration="4000"
      show-progress @close="() => { toastMessage = ''; toastType = 'success' }" />
  </div>
</template>

<script>
import { ref, computed, onUnmounted } from 'vue'
import { useFakeLogs } from '@/composables/useFakeLogs'
import MonitoringPanel from '@/components/monitoring/MonitoringPanel.vue'
import ServicesSidebar from '@/components/monitoring/ServicesSidebar.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'

export default {
  name: 'Monitoring',
  components: {
    MonitoringPanel,
    ServicesSidebar,
    LoadingSpinner,
    ErrorMessage,
    ToastNotification
  },
  setup() {
    console.log(' Multi-Gateway Monitoring setup started!')

    // Sample gateways with more realistic data
    const availableGateways = ref([
      {
        id: 'gw-001',
        name: 'Main Office Gateway',
        address: '192.168.1.100',
        port: 50051,
        isActive: true,
        location: 'Main Building',
        status: 'online'
      },
      {
        id: 'gw-002',
        name: 'Warehouse Gateway',
        address: '192.168.1.101',
        port: 50051,
        isActive: false,
        location: 'Warehouse A',
        status: 'offline'
      },
      {
        id: 'gw-003',
        name: 'R&D Lab Gateway',
        address: '192.168.1.102',
        port: 50051,
        isActive: true,
        location: 'Research Lab',
        status: 'online'
      },
      {
        id: 'gw-004',
        name: 'IoT Sensor Hub',
        address: '192.168.1.103',
        port: 50051,
        isActive: true,
        location: 'Production Floor',
        status: 'online'
      }
    ])

    // Layout configurations  
    const layouts = ref([
      {
        key: 'single',
        name: 'Single View',
        gridClass: 'grid-cols-1 gap-4',
        description: 'One panel per row for focused monitoring',
        usage: 'Best for detailed analysis of single service',
        icon: '▪'
      },
      {
        key: 'split',
        name: 'Split View',
        gridClass: 'grid-cols-1 lg:grid-cols-2 gap-4',
        description: 'Two columns side by side',
        usage: 'Perfect for comparing services or gateways',
        icon: '▪▪'
      },
      {
        key: 'compact',
        name: 'Triple View',
        gridClass: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3',
        description: 'Three columns for multiple services',
        usage: 'Monitor different services simultaneously',
        icon: '▪▪▪'
      },
      {
        key: 'dashboard',
        name: 'Dashboard',
        gridClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2',
        description: 'Maximum panels on screen',
        usage: 'Overview of all services and gateways',
        icon: '▫▫▫▫'
      }
    ])

    const currentLayoutKey = ref('split')
    const currentLayout = computed(() =>
      layouts.value.find(l => l.key === currentLayoutKey.value) || layouts.value[1]
    )
    const showLayoutDropdown = ref(false)

    // Panel management
    const activePanels = ref([])
    const isAutoRefresh = ref(false)
    const toastMessage = ref('')
    const toastType = ref('success')

    const {
      panelLogs,
      startFakeLogGeneration,
      stopFakeLogGeneration,
      getPanelLogs,
      clearPanelLogs
    } = useFakeLogs()

    const serviceTypeMap = {
      'Agent': 'GATEWAY_AGENT',
      'Controller': 'CONTROLLER',
      'Setting': 'SETTING'
    }

    const startLogSubscription = (panel) => {
      const panelId = panel.id
      const serviceType = panel.serviceType || 'GATEWAY_AGENT'
      const gatewayId = panel.gatewayId

      console.log(' Starting FAKE logs for panel:', panelId, 'Service:', serviceType, 'Gateway:', gatewayId)

      // Start fake log generation
      startFakeLogGeneration(panelId, serviceType, gatewayId, 3000) // Every 3 seconds
    }

    //  Stop fake logs
    const stopLogSubscription = (panelId) => {
      console.log(' Stopping fake logs for panel:', panelId)
      stopFakeLogGeneration(panelId)
      clearPanelLogs(panelId)
    }

    // Toast notification helper
    const showToast = (message, type = 'success') => {
      toastMessage.value = message
      toastType.value = type
      setTimeout(() => {
        toastMessage.value = ''
      }, 4000)
    }

    // Methods
    const addPanelFromSidebar = (panelData) => {
      console.log('🔧 Adding panel:', JSON.stringify(panelData, null, 2))

      const serviceType = panelData?.serviceType || panelData?.service || panelData?.name
      const gatewayId = panelData?.gatewayId || panelData?.gateway?.id
      const gatewayName = panelData?.gatewayName || panelData?.gateway?.name

      if (!serviceType || !gatewayId) {
        console.error(' Missing required data:', { serviceType, gatewayId })
        showToast('Service type or gateway not found', 'error')
        return
      }

      // Check for duplicates
      const existingPanel = activePanels.value.find(p =>
        p.serviceType === serviceType && p.gatewayId === gatewayId
      )
      if (existingPanel) {
        showToast(`${serviceType} panel for ${gatewayName} already exists`, 'warning')
        return
      }

      const newPanel = {
        id: `panel-${Date.now()}-${Math.random()}`,
        serviceType: serviceType,
        gatewayId: gatewayId,
        gatewayName: gatewayName,
        logType: serviceTypeMap[serviceType] || serviceType,
        title: `${gatewayName} - ${serviceType}`,
        fontSize: 'text-xs',
        isFullscreen: false
      }

      activePanels.value.push(newPanel)

      // Start fake logs
      startLogSubscription(newPanel)

      showToast(`${serviceType} monitoring started for ${gatewayName}`, 'success')
      console.log(' Panel added:', newPanel)
    }

    const removePanel = (panelId) => {
      console.log(' Removing panel:', panelId)

      const panel = activePanels.value.find(p => p.id === panelId)
      if (panel) {
        stopLogSubscription(panelId)
        activePanels.value = activePanels.value.filter(p => p.id !== panelId)
        showToast(`${panel.serviceType} monitoring stopped`, 'info')
      }
    }

    const updatePanel = (panelId, updates) => {
      const panelIndex = activePanels.value.findIndex(p => p.id === panelId)
      if (panelIndex !== -1) {
        activePanels.value[panelIndex] = { ...activePanels.value[panelIndex], ...updates }
      }
    }

    const duplicatePanel = (panelId) => {
      const originalPanel = activePanels.value.find(p => p.id === panelId)
      if (originalPanel) {
        const newPanel = {
          ...originalPanel,
          id: `panel-${Date.now()}-${Math.random()}`,
          title: `${originalPanel.title} (Copy)`
        }

        activePanels.value.push(newPanel)
        startLogSubscription(newPanel)
        showToast('Panel duplicated', 'success')
      }
    }

    const toggleFullscreen = (panelId) => {
      updatePanel(panelId, {
        isFullscreen: !activePanels.value.find(p => p.id === panelId)?.isFullscreen
      })
    }

    const increaseFont = (panelId) => {
      const panel = activePanels.value.find(p => p.id === panelId)
      if (panel) {
        const fontSizes = ['text-xs', 'text-sm', 'text-base', 'text-lg']
        const currentIndex = fontSizes.indexOf(panel.fontSize || 'text-xs')
        const nextIndex = Math.min(currentIndex + 1, fontSizes.length - 1)
        updatePanel(panelId, { fontSize: fontSizes[nextIndex] })
      }
    }

    const decreaseFont = (panelId) => {
      const panel = activePanels.value.find(p => p.id === panelId)
      if (panel) {
        const fontSizes = ['text-xs', 'text-sm', 'text-base', 'text-lg']
        const currentIndex = fontSizes.indexOf(panel.fontSize || 'text-xs')
        const nextIndex = Math.max(currentIndex - 1, 0)
        updatePanel(panelId, { fontSize: fontSizes[nextIndex] })
      }
    }

    const getLogsForPanel = (panel) => {
      return getPanelLogs(panel.id)
    }

    const setLayout = (layoutKey) => {
      currentLayoutKey.value = layoutKey
      showLayoutDropdown.value = false
      console.log(' Layout changed to:', layoutKey)
      showToast(`Layout changed to ${layouts.value.find(l => l.key === layoutKey)?.name}`, 'info')
    }

    const toggleAutoRefresh = () => {
      isAutoRefresh.value = !isAutoRefresh.value
      console.log(' Auto refresh:', isAutoRefresh.value ? 'ON' : 'OFF')
      showToast(`Auto refresh ${isAutoRefresh.value ? 'enabled' : 'disabled'}`, 'info')
    }

    const handleSidebarToggle = (data) => {
      console.log(' Sidebar item clicked:', data)
      addPanelFromSidebar(data)
    }

    // Cleanup
    onUnmounted(() => {
      console.log(' Cleaning up multi-gateway monitoring component')
      activePanels.value.forEach(panel => {
        stopLogSubscription(panel.id)
      })
    })

    return {
      // Data
      availableGateways,
      layouts,
      currentLayout,
      currentLayoutKey,
      showLayoutDropdown,
      activePanels,
      isAutoRefresh,
      toastMessage,
      toastType,

      // Methods
      addPanelFromSidebar,
      removePanel,
      updatePanel,
      duplicatePanel,
      toggleFullscreen,
      increaseFont,
      decreaseFont,
      getLogsForPanel,
      setLayout,
      toggleAutoRefresh,
      handleSidebarToggle,

      // Fake logs data
      panelLogs,
      startLogSubscription,
      stopLogSubscription
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.grid {
  transition: grid-template-columns 0.3s ease, grid-template-rows 0.3s ease;
}
</style>