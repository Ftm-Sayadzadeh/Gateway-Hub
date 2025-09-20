// import { ref, onMounted, onUnmounted } from 'vue'

// export function useGatewayMetrics() {
//   const metrics = ref({
//     cpuUsage: 45,
//     memoryUsage: 68,
//     uptime: '15 days 8h'
//   })
  
//   const isLoading = ref(false)
//   const error = ref(null)
//   let autoRefreshInterval = null

//   const generateFakeMetrics = () => {
//     return {
//       cpuUsage: Math.floor(Math.random() * 40) + 20, // 20-60%
//       memoryUsage: Math.floor(Math.random() * 35) + 45, // 45-80%
//       uptime: `${Math.floor(Math.random() * 30) + 1} days ${Math.floor(Math.random() * 24)}h`
//     }
//   }

//   // Refresh metrics manually
//   const refreshMetrics = async () => {
//     isLoading.value = true
//     error.value = null
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 1500))
      
//       // TODO: Replace with actual gRPC calls
//       // const cpuData = await grpcClient.getCpuUsage()
//       // const memoryData = await grpcClient.getMemoryUsage()
//       // const uptimeData = await grpcClient.getUptime()
      
//       metrics.value = generateFakeMetrics()
//     } catch (err) {
//       error.value = err.message || 'Failed to refresh metrics'
//       console.error('Error refreshing metrics:', err)
//     } finally {
//       isLoading.value = false
//     }
//   }

//   // Start auto-refresh every 30 seconds
//   const startAutoRefresh = (interval = 30000) => {
//     stopAutoRefresh() // Clear any existing interval
    
//     autoRefreshInterval = setInterval(() => {
//       // Silently update metrics without loading state
//       metrics.value = generateFakeMetrics()
//     }, interval)
//   }

//   // Stop auto-refresh
//   const stopAutoRefresh = () => {
//     if (autoRefreshInterval) {
//       clearInterval(autoRefreshInterval)
//       autoRefreshInterval = null
//     }
//   }

//   // Get color for CPU/Memory usage based on percentage
//   const getUsageColor = (percentage, type = 'cpu') => {
//     const thresholds = type === 'cpu' 
//       ? { warning: 60, danger: 80 }
//       : { warning: 70, danger: 85 } // Memory thresholds are typically higher
    
//     if (percentage > thresholds.danger) return '#ef4444' // Red
//     if (percentage > thresholds.warning) return '#f59e0b' // Yellow
//     return '#10b981' // Green
//   }

//   // Get usage status text
//   const getUsageStatus = (percentage, type = 'cpu') => {
//     const thresholds = type === 'cpu' 
//       ? { warning: 60, danger: 80 }
//       : { warning: 70, danger: 85 }
    
//     if (percentage > thresholds.danger) return 'High'
//     if (percentage > thresholds.warning) return 'Medium'
//     return 'Normal'
//   }

//   // Initialize auto-refresh on mount
//   onMounted(() => {
//     startAutoRefresh()
//   })

//   // Cleanup on unmount
//   onUnmounted(() => {
//     stopAutoRefresh()
//   })

//   return {
//     metrics,
//     isLoading,
//     error,
//     refreshMetrics,
//     startAutoRefresh,
//     stopAutoRefresh,
//     getUsageColor,
//     getUsageStatus
//   }
// }

// 

// TODO: add color change func

import { ref, watch } from 'vue'
import { useSubscription } from '@vue/apollo-composable'
import { GATEWAY_SYSTEM_INFO_SUB } from '@/apollo/queries'

export function useGatewayMetrics(gatewayId) {
  const metrics = ref({
    cpuUsage: null,
    memoryUsage: null,
    uptime: null,
    status: null,
    timestamp: null
  })

  const { result, error } = useSubscription(GATEWAY_SYSTEM_INFO_SUB, {
    gatewayId
  })

  watch(result, (val) => {
    if (val?.gatewaySystemInfo) {
      metrics.value = {
        cpuUsage: val.gatewaySystemInfo.cpuUsage,
        memoryUsage: val.gatewaySystemInfo.memoryUsage,
        uptime: val.gatewaySystemInfo.uptime,
        status: val.gatewaySystemInfo.status,
        timestamp: val.gatewaySystemInfo.timestamp
      }
    }
  })

  return {
    metrics,
    error
  }
}