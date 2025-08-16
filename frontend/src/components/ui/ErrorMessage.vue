<template>
  <div class="max-w-2xl mx-auto animate-slide-up">
    <div class="card border-danger" style="border-left: 4px solid var(--color-danger);">
      <div class="card-body">
        <div class="flex items-start">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0"
               style="background: var(--color-danger-light);">
            <svg class="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-danger mb-2">{{ title }}</h3>
            <p class="text-secondary mb-6">{{ message }}</p>
            
            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-3">
              <button 
                v-if="showRetry" 
                @click="$emit('retry')" 
                class="btn btn-secondary"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Retry
              </button>
              
              <button 
                v-if="showGoBack" 
                @click="$emit('goBack')" 
                class="btn btn-secondary"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                {{ goBackText }}
              </button>
              
              <!-- Custom Action Slots -->
              <slot name="actions"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    title: {
      type: String,
      default: 'Error Occurred'
    },
    message: {
      type: String,
      required: true
    },
    showRetry: {
      type: Boolean,
      default: false
    },
    showGoBack: {
      type: Boolean,
      default: false
    },
    goBackText: {
      type: String,
      default: 'Go Back'
    }
  },
  emits: ['retry', 'goBack']
}
</script>

<style scoped>
@keyframes slideUp {
  0% { 
    transform: translateY(20px); 
    opacity: 0; 
  }
  100% { 
    transform: translateY(0); 
    opacity: 1; 
  }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

.card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-card-border);
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-body {
  padding: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-secondary-bg);
  transform: translateY(-1px);
}

.text-danger { color: var(--color-danger); }
.text-secondary { color: var(--color-text-secondary); }
</style>