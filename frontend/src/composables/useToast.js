import { ref } from 'vue'

export function useToast() {
  const toastMessage = ref('')
  const toastType = ref('success')
  const isVisible = ref(false)

  const showToast = (message, type = 'success', duration = 4000) => {
    toastMessage.value = message
    toastType.value = type
    isVisible.value = true
    
    setTimeout(() => {
      hideToast()
    }, duration)
  }

  const hideToast = () => {
    isVisible.value = false
    setTimeout(() => {
      toastMessage.value = ''
      toastType.value = 'success'
    }, 300)
  }

  const showSuccess = (message, duration) => showToast(message, 'success', duration)
  const showError = (message, duration) => showToast(message, 'error', duration)
  const showWarning = (message, duration) => showToast(message, 'warning', duration)
  const showInfo = (message, duration) => showToast(message, 'info', duration)

  return {
    toastMessage,
    toastType,
    isVisible,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}