import { ref } from 'vue'

export function useClipboard() {
  const recentlyCopied = ref('')
  const isSupported = ref(!!navigator?.clipboard?.writeText)

  const copyToClipboard = async (text, identifier = 'default') => {
    if (!isSupported.value) {
      throw new Error('Clipboard API not supported')
    }

    try {
      await navigator.clipboard.writeText(text)
      recentlyCopied.value = identifier
      
      // Clear the copied status after 2 seconds
      setTimeout(() => {
        recentlyCopied.value = ''
      }, 2000)
      
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      throw error
    }
  }

  const isCopied = (identifier = 'default') => {
    return recentlyCopied.value === identifier
  }

  const clearCopiedStatus = () => {
    recentlyCopied.value = ''
  }

  return {
    recentlyCopied,
    isSupported,
    copyToClipboard,
    isCopied,
    clearCopiedStatus
  }
}