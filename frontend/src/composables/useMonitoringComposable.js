import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useSubscription } from '@vue/apollo-composable'
import { GATEWAY_LIVE_LOGS_SUB } from '@/apollo/queries'

export function useMonitoringComposable(options = {}) {
  const {
    mode = 'multi', // 'single' or 'multi'
    gatewayId = null,
    autoRefreshInterval = 5000
  } = options

  const layouts = ref([
    {
      key: 'single',
      name: 'Single View',
      gridClass: 'grid-cols-1'
    },
    {
      key: 'horizontal',
      name: 'Horizontal Split',
      gridClass: 'grid-cols-1 grid-rows-2'
    },
    {
      key: 'vertical',
      name: 'Vertical Split',
      gridClass: 'grid-cols-2'
    },
    {
      key: 'quad',
      name: 'Quad View',
      gridClass: 'grid-cols-2 grid-rows-2'
    }
  ])

  const currentLayoutKey = ref('single')
  const currentLayout = computed(() => 
    layouts.value.find(l => l.key === currentLayoutKey.value) || layouts.value[0]
  )
  const showLayoutDropdown = ref(false)

  // Auto refresh
  const isAutoRefresh = ref(false)
  const refreshInterval = ref(null)

  // Panel management
  const activePanels = ref([])

  // UI state
  const toastMessage = ref('')
  const toastType = ref('success')

  const liveLogs = ref(new Map()) // Key: panelId, Value: logs array
  const activeSubscriptions = ref(new Map()) // Key: panelId, Value: subscription data

  const serviceTypeMap = {
    'Agent': 1,
    'Controller': 2, 
    'Setting': 3
  }

  const startPanelSubscription = (panel) => {
    const panelId = panel.id
    
    console.log(' Starting subscription for panel:', panelId, 'Service:', panel.serviceType)
    
    liveLogs.value.set(panelId, [])
    
    const { result, error, loading, stop } = useSubscription(
      GATEWAY_LIVE_LOGS_SUB,
      {
        gatewayId: panel.gatewayId,
        logType: panel.logType,
        lineCount: 100
      },
      {
        enabled: true
      }
    )

    // Store subscription reference
    activeSubscriptions.value.set(panelId, { 
      result, error, loading, stop,
      gatewayId: panel.gatewayId,
      serviceType: panel.serviceType
    })

    // Watch for new logs from subscription
    const unwatchResult = watch(result, (newResult) => {
      if (newResult?.gatewayLiveLogs) {
        addLogToPanel(panelId, newResult.gatewayLiveLogs)
      }
    })

    // Watch for subscription errors
    const unwatchError = watch(error, (err) => {
      if (err) {
        console.error(' Subscription error for panel', panelId, ':', err)
        showToast(`Connection lost for ${panel.serviceType} service`, 'error')
      }
    })

    // Store unwatch functions for cleanup
    const subscription = activeSubscriptions.value.get(panelId)
    if (subscription) {
      subscription.unwatchResult = unwatchResult
      subscription.unwatchError = unwatchError
    }
  }

  const stopPanelSubscription = (panelId) => {
    const subscription = activeSubscriptions.value.get(panelId)
    
    if (subscription) {
      console.log('⏹️ Stopping subscription for panel:', panelId)
      
      // Stop GraphQL subscription
      if (subscription.stop) {
        subscription.stop()
      }
      
      // Cleanup watchers
      if (subscription.unwatchResult) subscription.unwatchResult()
      if (subscription.unwatchError) subscription.unwatchError()
      
      activeSubscriptions.value.delete(panelId)
    }
    
    liveLogs.value.delete(panelId)
  }

  // Methods
  const toggleLayoutDropdown = () => {
    showLayoutDropdown.value = !showLayoutDropdown.value
  }

  const setLayout = (layoutKey) => {
    currentLayoutKey.value = layoutKey
    showLayoutDropdown.value = false
    showToast(`Layout changed to ${layouts.value.find(l => l.key === layoutKey).name}`)
  }

  const addPanelFromSidebar = ({ gatewayId: panelGatewayId, gatewayName, serviceType, logType, mode: panelMode }) => {
    const panel = {
      id: Date.now(),
      title: mode === 'single' 
        ? `${serviceType} Service` 
        : `${gatewayName} - ${serviceType}`,
      gatewayId: panelGatewayId,
      gatewayName: gatewayName,
      serviceType: serviceType,
      logType: serviceTypeMap[serviceType] || 1, // Map to GraphQL enum
      logLevel: '',
      createdAt: new Date(),
      isFullscreen: false,
      fontSize: 12
    }
    
    if (mode === 'single') {
      const existingIndex = activePanels.value.findIndex(p => 
        p.serviceType === serviceType && p.gatewayId === panelGatewayId
      )
      if (existingIndex !== -1) {
        const existingPanel = activePanels.value[existingIndex]
        
        stopPanelSubscription(existingPanel.id)
        
        activePanels.value.splice(existingIndex, 1)
        showToast(`${serviceType} panel updated`, 'success')
      } else {
        showToast(`${serviceType} panel added`, 'success')
      }
    } else {
      showToast('Panel added successfully', 'success')
    }
    
    activePanels.value.push(panel)
    
    startPanelSubscription(panel)
    
    return panel
  }

  const removePanel = (panelId) => {
    const index = activePanels.value.findIndex(p => p.id === panelId)
    if (index !== -1) {
      const panel = activePanels.value[index]
      
      stopPanelSubscription(panelId)
      
      // Remove panel
      activePanels.value.splice(index, 1)
      showToast(`Panel "${panel.serviceType}" removed`, 'success')
      
      return panel
    }
  }

  const updatePanel = (panelId, updates) => {
    const panel = activePanels.value.find(p => p.id === panelId)
    if (panel) {
      Object.assign(panel, updates)
      showToast('Panel updated successfully', 'success')
    }
  }

  const duplicatePanel = (panelId) => {
    const panel = activePanels.value.find(p => p.id === panelId)
    if (panel) {
      const newPanel = {
        ...panel,
        id: Date.now(),
        title: `${panel.title} (Copy)`,
        createdAt: new Date()
      }
      
      activePanels.value.push(newPanel)
      
      startPanelSubscription(newPanel)
      
      showToast('Panel duplicated successfully', 'success')
      
      return newPanel
    }
  }

  const toggleFullscreen = (panelId) => {
    activePanels.value.forEach(p => {
      if (p.id === panelId) {
        p.isFullscreen = !p.isFullscreen
      } else {
        p.isFullscreen = false
      }
    })
  }

  const increaseFont = (panelId) => {
    const panel = activePanels.value.find(p => p.id === panelId)
    if (panel && panel.fontSize < 18) {
      panel.fontSize += 2
      showToast('Font size increased', 'success')
    }
  }

  const addLogToPanel = (panelId, logEntry) => {
    const panelLogs = liveLogs.value.get(panelId) || []
    
    const formattedLog = {
      id: `${panelId}-${logEntry.lineNumber}-${Date.now()}`,
      timestamp: logEntry.timestamp || new Date().toISOString().slice(0, 19).replace('T', ' '),
      level: logEntry.logLevel || 'INFO',
      service: logEntry.serviceType || 'Unknown',
      gatewayId: logEntry.gatewayId,
      message: logEntry.message || '',
      details: `Line: ${logEntry.lineNumber}`,
      lineNumber: logEntry.lineNumber
    }

    panelLogs.unshift(formattedLog)
    
    if (panelLogs.length > 200) {
      panelLogs.splice(200)
    }
    
    liveLogs.value.set(panelId, panelLogs)
    
    console.log(' New log added to panel', panelId, ':', formattedLog.message.slice(0, 50))
  }

  const getLogsForPanel = (panel) => {
    const panelLogs = liveLogs.value.get(panel.id) || []
    
    return panelLogs.filter(log => {
      if (panel.logLevel && log.level !== panel.logLevel) return false
      return true
    }).slice(0, 100) // Limit to 100 most recent logs
  }

  const toggleAutoRefresh = () => {
    isAutoRefresh.value = !isAutoRefresh.value
    
    if (isAutoRefresh.value) {
      showToast('Live logs are real-time via subscription', 'info')
    } else {
      showToast('Real-time updates continue via subscription', 'info')
    }
  }

  const showToast = (message, type = 'success') => {
    toastMessage.value = message
    toastType.value = type
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  }

  const getSubscriptionStatus = (panelId) => {
    const subscription = activeSubscriptions.value.get(panelId)
    if (!subscription) return { connected: false, loading: false, error: null }
    
    return {
      connected: !!subscription.result.value,
      loading: subscription.loading.value,
      error: subscription.error.value
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    console.log('Cleaning up all subscriptions...')
    
    activePanels.value.forEach(panel => {
      stopPanelSubscription(panel.id)
    })
    
    liveLogs.value.clear()
    activeSubscriptions.value.clear()
    
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
    }
  })

  return {
    // Layout
    layouts,
    currentLayout,
    currentLayoutKey,
    showLayoutDropdown,
    toggleLayoutDropdown,
    setLayout,

    // Auto refresh
    isAutoRefresh,
    toggleAutoRefresh,

    // Panels
    activePanels,
    addPanelFromSidebar,
    removePanel,
    updatePanel,
    duplicatePanel,
    toggleFullscreen,
    increaseFont,
    getLogsForPanel,

    liveLogs,
    activeSubscriptions,
    startPanelSubscription,
    stopPanelSubscription,
    addLogToPanel,
    getSubscriptionStatus,
    serviceTypeMap,

    // UI
    toastMessage,
    toastType,
    showToast
  }
}