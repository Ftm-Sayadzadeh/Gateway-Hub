<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div 
        v-if="visible"
        class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="handleBackdropClick"
      >
        <div 
          class="bg-primary rounded-2xl max-w-md w-full shadow-2xl border transform transition-all"
          style="border-color: var(--color-border);"
          @click.stop
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-center mb-4">
              <div 
                :class="['w-12 h-12 rounded-xl flex items-center justify-center mr-4', iconBgClass]"
              >
                <svg class="w-6 h-6" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="type === 'danger'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  <path v-else-if="type === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  <path v-else-if="type === 'info'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-primary">{{ title }}</h3>
                <p v-if="subtitle" class="text-secondary text-sm">{{ subtitle }}</p>
              </div>
            </div>
            
            <!-- Content -->
            <div class="text-secondary mb-6">
              <p v-if="message">{{ message }}</p>
              <slot v-else></slot>
            </div>
            
            <!-- Actions -->
            <div class="flex justify-end space-x-3">
              <button 
                @click="handleCancel"
                :disabled="loading"
                class="btn btn-secondary"
              >
                {{ cancelText }}
              </button>
              <button 
                @click="handleConfirm"
                :disabled="loading"
                :class="['btn', confirmButtonClass]"
              >
                <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                {{ loading ? loadingText : confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'ConfirmationModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'question',
      validator: (value) => ['danger', 'warning', 'info', 'question'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    loadingText: {
      type: String,
      default: 'Processing...'
    },
    loading: {
      type: Boolean,
      default: false
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  emits: ['confirm', 'cancel', 'close'],
  setup(props, { emit }) {
    const iconBgClass = computed(() => {
      const classes = {
        danger: 'bg-danger-light',
        warning: 'bg-yellow-100',
        info: 'bg-blue-100',
        question: 'bg-gray-100'
      }
      return classes[props.type] || classes.question
    })
    
    const iconColorClass = computed(() => {
      const classes = {
        danger: 'text-danger',
        warning: 'text-yellow-600',
        info: 'text-blue-600',
        question: 'text-gray-600'
      }
      return classes[props.type] || classes.question
    })
    
    const confirmButtonClass = computed(() => {
      const classes = {
        danger: 'btn-danger',
        warning: 'btn-warning',
        info: 'btn-primary',
        question: 'btn-primary'
      }
      return classes[props.type] || classes.question
    })
    
    const handleConfirm = () => {
      emit('confirm')
    }
    
    const handleCancel = () => {
      emit('cancel')
      emit('close')
    }
    
    const handleBackdropClick = () => {
      if (props.closeOnBackdrop && !props.loading) {
        handleCancel()
      }
    }
    
    return {
      iconBgClass,
      iconColorClass,
      confirmButtonClass,
      handleConfirm,
      handleCancel,
      handleBackdropClick
    }
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-primary,
.modal-leave-to .bg-primary {
  transform: scale(0.9);
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--gradient-brand);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(67, 56, 202, 0.4);
}

.btn-danger {
  background: var(--gradient-danger);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.btn-warning:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--color-secondary-bg);
  transform: translateY(-1px);
}

.bg-primary { background-color: var(--color-primary-bg); }
.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.text-danger { color: var(--color-danger); }
.bg-danger-light { background-color: var(--color-danger-light); }
</style>