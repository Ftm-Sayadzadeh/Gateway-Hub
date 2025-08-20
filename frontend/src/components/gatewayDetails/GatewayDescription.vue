<template>
  <div v-if="hasDescription" class="card">
    <div class="card-header">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
               style="background: var(--color-info-light);">
            <svg class="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-primary">Description</h3>
        </div>
      </div>
    </div>
    
    <div class="card-body">
      <div class="prose prose-sm max-w-none">
        <p class="text-secondary leading-relaxed whitespace-pre-wrap">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'GatewayDescription',
  props: {
    gateway: {
      type: Object,
      required: true
    },
    showAdditionalInfo: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const description = computed(() => props.gateway.desc || '')
    
    const hasDescription = computed(() => {
      return description.value && description.value.trim().length > 0
    })
    
    const wordCount = computed(() => {
      if (!description.value) return 0
      return description.value.trim().split(/\s+/).filter(word => word.length > 0).length
    })
    
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
    
    return {
      description,
      hasDescription,
      wordCount,
      formatDate
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
.text-muted { color: var(--color-text-muted); }
.text-info { color: var(--color-info); }

.prose p {
  margin: 0;
  line-height: 1.7;
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>