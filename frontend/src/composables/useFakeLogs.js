import { ref, onUnmounted } from 'vue'

export function useFakeLogs() {
  const panelLogs = ref(new Map()) // panelId -> logs array
  const activeIntervals = ref(new Map()) // panelId -> interval reference
  
  const logTemplates = {
    'GATEWAY_AGENT': [
      'System heartbeat check completed successfully',
      'Failed to connect to controller: {ip} with {tries}# tries.',
      'Memory usage updated: {memory}MB - Available: {available}GB',
      'Network interface eth0 status: UP',
      'Disk space check: /var/log - {disk}% used',
      'Process monitoring: All services running',
      'Temperature sensor reading: {temp}°C',
      'Battery status: {battery}% - Power source: AC',
      'Connection established to controller {ip}:{port}',
      'Security scan completed - No threats detected',
      'Backup operation started for {size}MB data',
      'Configuration sync successful with server {ip}',
      'Log rotation completed - {files} files archived',
      'Service discovery: Found {services} available services',
      'Health check passed for all modules',
      'Cache cleanup completed - {freed}MB freed',
      'Watchdog timer reset - System stable',
      'GPIO pin {pin} state changed to {state}',
      'UART communication established on port {port}',
      'File system check: {fs} - {percent}% used',
      'WiFi connection established: SSID {ssid}',
      'Bluetooth device paired: {device}',
      'Sensor calibration completed - Accuracy: {accuracy}%'
    ],
    'CONTROLLER': [
      'Gateway connection established: {ip}:{port}',
      'Route table updated - {routes} active routes', 
      'Device registration: MAC {mac} joined network',
      'Traffic analysis: {traffic}MB processed in {time}s',
      'Security policy applied to gateway {ip}',
      'Firmware update check: Version {version} available',
      'Load balancing: Redistributing traffic to {nodes} nodes',
      'Network topology scan completed - {devices} devices found',
      'Quality of Service: Latency {latency}ms on link {link}',
      'Firewall rule updated: Allow port {port} from {ip}',
      'Device authentication successful: {device}',
      'Bandwidth allocation: {bandwidth}Mbps assigned to {ip}',
      'Connection pool: {active}/{total} connections active',
      'Protocol handler: Processing {protocol} requests',
      'Session management: {sessions} active sessions',
      'Data integrity check: {packets} packets verified',
      'Routing protocol convergence completed in {time}ms',
      'VLAN configuration updated: VLAN {vlan} active',
      'Bridge forwarding table: {entries} entries learned',
      'Failed to reach gateway {ip} - Timeout after {timeout}ms',
      'Load balancer health check: {healthy}/{total} nodes healthy',
      'Certificate validation failed for {ip}',
      'Intrusion detected from {ip} - Blocked automatically'
    ],
    'SETTING': [
      'Configuration parameter updated: {param} = {value}',
      'Settings validation completed successfully',
      'User preference saved: Theme = {theme}',
      'Language setting changed to {lang}',
      'Notification preferences updated for user {user}',
      'Security settings modified: 2FA enabled',
      'Backup schedule configured: Daily at {time}',
      'Log level changed to {level} for module {module}',
      'Network timeout updated: {timeout}ms',
      'Cache size limit set to {cache}MB',
      'Auto-update preference: {auto} for component {comp}',
      'Debug mode {status} for service {service}',
      'API rate limit: {limit} requests/minute',
      'Database connection pool: {pool} connections configured',
      'Encryption key rotated successfully - Algo: {algo}',
      'Audit log archived: {entries} entries saved',
      'Certificate renewal scheduled for {date}',
      'Performance threshold: CPU alert at {threshold}%',
      'Storage quota set to {quota}GB for user {user}',
      'Failed to save configuration: Permission denied',
      'Backup verification failed - Checksum mismatch',
      'Service restart required for changes to take effect',
      'Configuration rollback completed to version {version}'
    ]
  }

  const logLevels = ['I', 'D', 'W', 'E', 'T']
  const logLevelWeights = [45, 25, 20, 8, 2] 

  const generateMacAddress = () => {
    const chars = '0123456789ABCDEF'
    let mac = ''
    for (let i = 0; i < 12; i++) {
      if (i % 2 === 0 && i > 0) mac += ':'
      mac += chars[Math.floor(Math.random() * chars.length)]
    }
    return mac
  }

  const generateIP = () => {
    return `${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`
  }

  const generateTimestamp = () => {
    const now = new Date()
    const year = String(now.getFullYear()).slice(-2) // 2025 -> 25
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0')
    
    // 2161.10.09-04:48:17.482
    return `21${year}.${month}.${day}-${hours}:${minutes}:${seconds}.${milliseconds}`
  }

  const generateFakeLog = (panelId, serviceType, gatewayId) => {
    const templates = logTemplates[serviceType] || logTemplates['GATEWAY_AGENT']
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    let message = template
      .replace('{ip}', generateIP())
      .replace('{tries}', Math.floor(Math.random() * 50) + 5)
      .replace('{memory}', Math.floor(Math.random() * 2000) + 500)
      .replace('{available}', (Math.random() * 8 + 2).toFixed(1))
      .replace('{disk}', Math.floor(Math.random() * 50) + 30)
      .replace('{temp}', Math.floor(Math.random() * 20) + 35)
      .replace('{battery}', Math.floor(Math.random() * 40) + 60)
      .replace('{port}', Math.floor(Math.random() * 9000) + 1000)
      .replace('{routes}', Math.floor(Math.random() * 20) + 5)
      .replace('{mac}', generateMacAddress())
      .replace('{traffic}', (Math.random() * 100 + 10).toFixed(1))
      .replace('{time}', Math.floor(Math.random() * 5000) + 100)
      .replace('{version}', `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`)
      .replace('{nodes}', Math.floor(Math.random() * 10) + 2)
      .replace('{devices}', Math.floor(Math.random() * 50) + 10)
      .replace('{latency}', Math.floor(Math.random() * 100) + 10)
      .replace('{link}', `Link-${Math.floor(Math.random() * 10) + 1}`)
      .replace('{device}', `DEV-${Math.floor(Math.random() * 10000)}`)
      .replace('{bandwidth}', Math.floor(Math.random() * 900) + 100)
      .replace('{active}', Math.floor(Math.random() * 50) + 10)
      .replace('{total}', Math.floor(Math.random() * 20) + 60)
      .replace('{protocol}', ['HTTP', 'MQTT', 'CoAP', 'WebSocket'][Math.floor(Math.random() * 4)])
      .replace('{sessions}', Math.floor(Math.random() * 100) + 20)
      .replace('{packets}', Math.floor(Math.random() * 10000) + 1000)
      .replace('{vlan}', Math.floor(Math.random() * 100) + 10)
      .replace('{entries}', Math.floor(Math.random() * 1000) + 100)
      .replace('{param}', ['max_connections', 'timeout_interval', 'buffer_size', 'retry_count'][Math.floor(Math.random() * 4)])
      .replace('{value}', Math.floor(Math.random() * 1000) + 100)
      .replace('{theme}', ['dark', 'light', 'auto'][Math.floor(Math.random() * 3)])
      .replace('{lang}', ['en', 'fa', 'ar'][Math.floor(Math.random() * 3)])
      .replace('{user}', `user${Math.floor(Math.random() * 100) + 1}`)
      .replace('{level}', ['ERROR', 'WARN', 'INFO', 'DEBUG'][Math.floor(Math.random() * 4)])
      .replace('{module}', ['AUTH', 'NET', 'DB', 'API'][Math.floor(Math.random() * 4)])
      .replace('{timeout}', Math.floor(Math.random() * 5000) + 1000)
      .replace('{cache}', Math.floor(Math.random() * 500) + 100)
      .replace('{auto}', ['enabled', 'disabled'][Math.floor(Math.random() * 2)])
      .replace('{comp}', ['firmware', 'config', 'security'][Math.floor(Math.random() * 3)])
      .replace('{status}', ['enabled', 'disabled'][Math.floor(Math.random() * 2)])
      .replace('{service}', serviceType)
      .replace('{limit}', Math.floor(Math.random() * 900) + 100)
      .replace('{pool}', Math.floor(Math.random() * 20) + 5)
      .replace('{algo}', ['AES256', 'RSA2048', 'SHA256'][Math.floor(Math.random() * 3)])
      .replace('{date}', `2025-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`)
      .replace('{threshold}', Math.floor(Math.random() * 30) + 70)
      .replace('{quota}', Math.floor(Math.random() * 500) + 100)
      .replace('{size}', Math.floor(Math.random() * 1000) + 50)
      .replace('{files}', Math.floor(Math.random() * 50) + 5)
      .replace('{services}', Math.floor(Math.random() * 10) + 3)
      .replace('{freed}', Math.floor(Math.random() * 200) + 20)
      .replace('{pin}', Math.floor(Math.random() * 40) + 1)
      .replace('{state}', ['HIGH', 'LOW'][Math.floor(Math.random() * 2)])
      .replace('{fs}', ['/var', '/tmp', '/home', '/opt'][Math.floor(Math.random() * 4)])
      .replace('{percent}', Math.floor(Math.random() * 60) + 20)
      .replace('{ssid}', `WiFi_${Math.floor(Math.random() * 1000)}`)
      .replace('{accuracy}', Math.floor(Math.random() * 20) + 80)
      .replace('{healthy}', Math.floor(Math.random() * 8) + 2)

    const randomNum = Math.random() * 100
    let cumulativeWeight = 0
    let selectedLevel = 'I'
    
    for (let i = 0; i < logLevels.length; i++) {
      cumulativeWeight += logLevelWeights[i]
      if (randomNum <= cumulativeWeight) {
        selectedLevel = logLevels[i]
        break
      }
    }

    const timestamp = generateTimestamp()
    const lineNumber = Math.floor(Math.random() * 10000) + 1

    //  2161.10.09-04:48:17.482|E]: message\r
    const formattedMessage = `${timestamp}|${selectedLevel}]: ${message}\\r`

    return {
      id: `${panelId}-${Date.now()}-${Math.random()}`,
      timestamp: timestamp,
      level: selectedLevel,
      service: serviceType,
      gatewayId: gatewayId,
      message: formattedMessage,
      lineNumber: lineNumber,
      originalMessage: message,
      levelFull: getLevelFullName(selectedLevel) 
    }
  }

  const getLevelFullName = (level) => {
    const mapping = {
      'I': 'INFO',
      'D': 'DEBUG', 
      'W': 'WARNING',
      'E': 'ERROR',
      'T': 'TRACE'
    }
    return mapping[level] || level
  }

  const startFakeLogGeneration = (panelId, serviceType, gatewayId, interval = 3000) => {
    console.log(`Starting fake logs for panel ${panelId} (${serviceType})`)
    
    stopFakeLogGeneration(panelId)
    
    if (!panelLogs.value.has(panelId)) {
      panelLogs.value.set(panelId, [])
    }
    
    const initialLogs = []
    for (let i = 0; i < 5; i++) {
      initialLogs.push(generateFakeLog(panelId, serviceType, gatewayId))
    }
    panelLogs.value.set(panelId, initialLogs)
    
    const logInterval = setInterval(() => {
      const currentLogs = panelLogs.value.get(panelId) || []
      const newLog = generateFakeLog(panelId, serviceType, gatewayId)
      
      currentLogs.unshift(newLog)
      
      if (currentLogs.length > 200) {
        currentLogs.splice(200)
      }
      
      panelLogs.value.set(panelId, [...currentLogs])
      
      console.log(`New log for ${serviceType}:`, newLog.originalMessage)
    }, interval + Math.random() * 1000)
    
    activeIntervals.value.set(panelId, logInterval)
  }

  const stopFakeLogGeneration = (panelId) => {
    const interval = activeIntervals.value.get(panelId)
    if (interval) {
      clearInterval(interval)
      activeIntervals.value.delete(panelId)
      console.log(`Stopped fake logs for panel ${panelId}`)
    }
  }

  const getPanelLogs = (panelId) => {
    return panelLogs.value.get(panelId) || []
  }

  const clearPanelLogs = (panelId) => {
    panelLogs.value.delete(panelId)
  }

  onUnmounted(() => {
    activeIntervals.value.forEach((interval, panelId) => {
      clearInterval(interval)
    })
    activeIntervals.value.clear()
    panelLogs.value.clear()
  })

  return {
    panelLogs,
    startFakeLogGeneration,
    stopFakeLogGeneration,
    getPanelLogs,
    clearPanelLogs
  }
}