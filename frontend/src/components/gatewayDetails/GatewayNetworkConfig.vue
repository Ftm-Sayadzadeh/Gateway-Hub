<template>
  <div class="card">
    <div class="card-header">
      <div class="flex items-center">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
             style="background: var(--color-brand-light);">
          <svg class="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-primary">Network Configuration</h3>
          <p class="text-sm text-secondary">Connection details and network info</p>
        </div>
      </div>
    </div>
    
    <div class="card-body space-y-6">
      <div class="p-6 rounded-xl border-2 border-brand/20" style="background: var(--color-brand-light);">
        <div class="flex items-center justify-between mb-3">
          <label class="text-sm font-bold text-brand uppercase tracking-wide">Connection Endpoint</label>
          <button 
            @click="handleCopy(`${gateway.address}:${gateway.port}`)" 
            class="p-2 hover:bg-brand/10 rounded-lg transition-colors"
            :class="{'text-success': isRecentlyCopied('address')}"
            :title="isRecentlyCopied('address') ? 'Copied!' : 'Copy to clipboard'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="isRecentlyCopied('address')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M5 13l4 4L19 7"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </button>
        </div>
        <div class="text-primary font-mono text-2xl font-bold mb-2">{{ gateway.address }}:{{ gateway.port }}</div>
        <div class="flex items-center space-x-2">
          <span :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                        gateway.isLocal ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800']">
            <div :class="['w-2 h-2 rounded-full mr-2',
                         gateway.isLocal ? 'bg-blue-400' : 'bg-purple-400']"></div>
            {{ gateway.isLocal ? 'Private Network' : 'Public Network' }}
          </span>
        </div>
      </div>

      <!-- Network Details -->
      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-gray-600">IP Address</div>
            <button 
              @click="handleCopy(gateway.address)" 
              class="p-1 hover:bg-gray-200 rounded transition-colors"
              :class="{'text-success': isRecentlyCopied('ip')}"
              :title="isRecentlyCopied('ip') ? 'Copied!' : 'Copy IP'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="isRecentlyCopied('ip')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M5 13l4 4L19 7"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
          <div class="font-mono text-lg font-bold text-gray-900">{{ gateway.address }}</div>
        </div>
        <div class="p-4 rounded-lg bg-gray-50 border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <div class="text-sm font-medium text-gray-600">Port</div>
            <button 
              @click="handleCopy(gateway.port.toString())" 
              class="p-1 hover:bg-gray-200 rounded transition-colors"
              :class="{'text-success': isRecentlyCopied('port')}"
              :title="isRecentlyCopied('port') ? 'Copied!' : 'Copy Port'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="isRecentlyCopied('port')" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M5 13l4 4L19 7"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
            </button>
          </div>
          <div class="font-mono text-lg font-bold text-gray-900">{{ gateway.port }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { useClipboard } from '@/composables/useClipboard'
import { useToast } from '@/composables/useToast'

export default {
  name: 'GatewayNetworkConfig',
  props: {
    gateway: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { copyToClipboard, isCopied } = useClipboard()
    const { showSuccess, showError } = useToast()

    const handleCopy = async (text) => {
      try {
        let identifier = 'default'
        
        // Determine identifier based on content
        if (text.includes(':')) {
          identifier = 'address'
        } else if (text === 'ip') {
          identifier = 'ip'  
        } else if (!isNaN(text)) {
          identifier = 'port'
        } else {
          identifier = 'connection'
        }

        await copyToClipboard(text, identifier)
        showSuccess('Copied to clipboard!')
      } catch (error) {
        showError('Failed to copy to clipboard')
      }
    }

    const isRecentlyCopied = (identifier) => {
      return isCopied(identifier)
    }

    return {
      handleCopy,
      isRecentlyCopied
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

.card-header {
  padding: 1.5rem 1.5rem 0rem;
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-surface);
}

.card-body {
  padding: 1.5rem;
}

.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-brand { color: var(--color-brand-primary); }
.text-success { color: var(--color-success); }
</style>