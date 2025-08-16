<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div 
        v-if="visible"
        :class="[
          'fixed top-6 right-6 p-4 rounded-xl shadow-lg z-50 border-l-4 min-w-80 max-w-md',
          toastClasses
        ]"
      >
        <div class="flex items-start">
          <!-- Icon -->
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0', iconBgClass]">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              <path v-else-if="type === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              <path v-else-if="type === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div v-if="title" class="font-semibold mb-1">{{ title }}</div>
            <div class="text-sm opacity-90 break-words">{{ message }}</div>
          </div>
          
          <!-- Close Button -->
          <button 
            v-if="closable"
            @click="$emit('close')"
            class="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Progress Bar (if duration is set) -->
        <div v-if="showProgress && duration > 0" class="mt-3">
          <div class="w-full bg-black bg-opacity-10 rounded-full h-1">
            <div 
              class="h-1 rounded-full transition-all linear"
              :class="progressBarClass"
              :style="{ 
                width: progressWidth + '%',
                transitionDuration: duration + 'ms'
              }"
            ></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { computed, ref, watch, onMounted } from 'vue'

export default {
  name: 'ToastNotification',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 4000 // 0 means no auto close
    },
    closable: {
      type: Boolean,
      default: true
    },
    showProgress: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const progressWidth = ref(100)
    
    const toastClasses = computed(() => {
      const classes = {
        success: 'bg-success-light text-success border-success',
        error: 'bg-danger-light text-danger border-danger',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-400',
        info: 'bg-blue-50 text-blue-800 border-blue-400'
      }
      return classes[props.type] || classes.success
    })
    
    const iconBgClass = computed(() => {
      const classes = {
        success: 'bg-success',
        error: 'bg-danger',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
      }
      return classes[props.type] || classes.success
    })
    
    const progressBarClass = computed(() => {
      const classes = {
        success: 'bg-success',
        error: 'bg-danger',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
      }
      return classes[props.type] || classes.success
    })
    
    // Auto close
    let autoCloseTimer = null
    let progressTimer = null
    
    const startAutoClose = () => {
      if (props.duration > 0) {
        if (props.showProgress) {
          progressWidth.value = 0
        }
        
        autoCloseTimer = setTimeout(() => {
          emit('close')
        }, props.duration)
      }
    }
    
    const clearTimers = () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
        autoCloseTimer = null
      }
      if (progressTimer) {
        clearTimeout(progressTimer)
        progressTimer = null
      }
    }
    
    // Watch for visibility changes
    watch(() => props.visible, (newVal) => {
      if (newVal) {
        progressWidth.value = 100
        startAutoClose()
      } else {
        clearTimers()
      }
    })
    
    onMounted(() => {
      if (props.visible) {
        startAutoClose()
      }
    })
    
    return {
      progressWidth,
      toastClasses,
      iconBgClass,
      progressBarClass
    }
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.bg-success-light { background-color: var(--color-success-light); }
.text-success { color: var(--color-success); }
.border-success { border-color: var(--color-success); }
.bg-success { background-color: var(--color-success); }

.bg-danger-light { background-color: var(--color-danger-light); }
.text-danger { color: var(--color-danger); }
.border-danger { border-color: var(--color-danger); }
.bg-danger { background-color: var(--color-danger); }
</style>