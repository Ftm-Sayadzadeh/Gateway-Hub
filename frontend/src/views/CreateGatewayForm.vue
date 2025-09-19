<template>
  <div class="p-8">
    <!-- Loading Overlay -->
    <LoadingSpinner 
      v-if="showLoadingSpinner" 
      message="Creating gateway..." 
      size="lg"
    />

    <!-- Main Content (hidden when loading) -->
    <div v-else>
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <router-link to="/gateway-list" class="hover:text-indigo-600 transition-colors">
          Gateway Management
        </router-link>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <span class="text-gray-900 font-medium">Create New Gateway</span>
      </div>

      <!-- Main Form Container -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Left Side - Form (60%) -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

            <!-- Form Header -->
            <div class="border-b border-gray-100 pb-6 mb-8">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                  </path>
                </svg>
                Gateway Information
              </h2>
              <p class="text-gray-600 text-sm mt-1">Enter the basic details for your new gateway</p>
            </div>

            <!-- Form Fields -->
            <div class="space-y-6">

              <!-- Gateway Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Gateway Name <span class="text-red-500">*</span>
                </label>
                <input type="text" id="name" v-model="formData.name" :class="[
                  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200',
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                ]" placeholder="Enter gateway name (e.g., IoT Testbed Gateway)" @input="clearError('name')" />
                <p v-if="errors.name" class="mt-2 text-sm text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd" />
                  </svg>
                  {{ errors.name }}
                </p>
              </div>

              <!-- IP Address & Port Row -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-2">
                  <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                    IP Address <span class="text-red-500">*</span>
                  </label>
                  <input type="text" id="address" v-model="formData.address" :class="[
                    'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono',
                    errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  ]" placeholder="192.168.1.100" @input="clearError('address')" />
                  <p v-if="errors.address" class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                    </svg>
                    {{ errors.address }}
                  </p>
                </div>

                <div>
                  <label for="port" class="block text-sm font-medium text-gray-700 mb-2">
                    Port <span class="text-red-500">*</span>
                  </label>
                  <input type="number" id="port" v-model="formData.port" :class="[
                    'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 font-mono',
                    errors.port ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  ]" placeholder="8080" min="1" max="65535" @input="clearError('port')" />
                  <p v-if="errors.port" class="mt-2 text-sm text-red-600 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                    </svg>
                    {{ errors.port }}
                  </p>
                </div>
              </div>

              <!-- Description -->
              <div>
                <label for="desc" class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea id="desc" v-model="formData.desc" rows="4"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Optional description for this gateway..."></textarea>
                <p class="mt-1 text-xs text-gray-500">
                  Provide additional details about this gateway's purpose or location
                </p>
              </div>

            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-end space-x-4 mt-4 pt-6 border-t border-gray-100">
              <button type="button" @click="handleCancel"
                class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200">
                Cancel
              </button>
              <button @click="handleSubmit" :disabled="isLoading"
                class="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2">
                <div v-if="isLoading"
                  class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>{{ isLoading ? 'Creating...' : 'Create Gateway' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side - Preview & Details (30%) -->
        <div class="space-y-6">

          <!-- Connection Preview -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                </path>
              </svg>
              Preview
            </h3>

            <!-- Status Card (like detail page) -->
            <div class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 mb-4">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div>
                  <h4 class="font-medium text-gray-900">
                    {{ formData.name || 'Gateway Name' }}
                  </h4>
                  <p class="text-sm text-gray-600">Ready to configure</p>
                </div>
              </div>
            </div>

            <!-- Technical Details -->
            <div class="space-y-3">
              <div class="bg-blue-50 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <svg class="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z">
                    </path>
                  </svg>
                  <span class="text-xs font-medium text-blue-800 uppercase tracking-wide">CONNECTION</span>
                </div>
                <p class="text-sm font-mono text-blue-900 bg-blue-100 px-2 py-1 rounded">
                  {{ connectionString || 'IP:PORT' }}
                </p>
              </div>

              <div class="bg-green-50 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
                    </path>
                  </svg>
                  <span class="text-xs font-medium text-green-800 uppercase tracking-wide">GATEWAY TYPE</span>
                </div>
                <p class="text-sm text-green-900">
                  {{ gatewayType }}
                </p>
              </div>
            </div>
          </div>

          <!-- Help Card -->
          <div class="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <h3 class="text-sm font-semibold text-indigo-900 mb-3 flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Configuration Tips
            </h3>
            <ul class="text-xs text-indigo-800 space-y-2">
              <li class="flex items-start">
                <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span>Use descriptive names for easy identification</span>
              </li>
              <li class="flex items-start">
                <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span>Ensure the IP address is reachable from your network</span>
              </li>
              <li class="flex items-start">
                <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span>Port numbers should be between 1-65535</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :visible="showConfirmModal"
      type="info"
      title="Create Gateway"
      subtitle="Please confirm gateway details"
      confirm-text="Create Gateway"
      cancel-text="Review"
      :loading="isLoading"
      loading-text="Creating..."
      @confirm="confirmCreateGateway"
      @cancel="showConfirmModal = false"
    >
      <div class="space-y-3">
        <div class="bg-gray-50 p-3 rounded-lg">
          <p class="text-sm"><strong>Name:</strong> {{ formData.name }}</p>
          <p class="text-sm"><strong>Address:</strong> {{ connectionString }}</p>
          <p class="text-sm"><strong>Type:</strong> {{ gatewayType }}</p>
          <p v-if="formData.desc" class="text-sm"><strong>Description:</strong> {{ formData.desc }}</p>
        </div>
      </div>
    </ConfirmationModal>

    <!-- Cancel Confirmation Modal -->
    <ConfirmationModal
      :visible="showCancelModal"
      type="warning"
      title="Cancel Gateway Creation"
      subtitle="Unsaved changes will be lost"
      confirm-text="Yes, Cancel"
      cancel-text="Continue Editing"
      @confirm="confirmCancel"
      @cancel="showCancelModal = false"
    >
      <p>Are you sure you want to cancel? All entered information will be lost.</p>
    </ConfirmationModal>

    <!-- Toast Notification -->
    <ToastNotification
      :visible="toastVisible"
      :type="toastType"
      :message="toastMessage"
      :duration="4000"
      show-progress
      @close="hideToast"
    />

    <!-- Error Message -->
    <ErrorMessage
      v-if="showError"
      title="Failed to Create Gateway"
      :message="errorMessage"
      show-retry
      show-go-back
      go-back-text="Back to List"
      @retry="handleSubmit"
      @go-back="goBack"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { CREATE_GATEWAY } from '@/apollo/queries'

// UI Components
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'

// Composables
import { useToast } from '@/composables/useToast'

export default {
  name: 'CreateGatewayForm',
  components: {
    LoadingSpinner,
    ToastNotification,
    ConfirmationModal,
    ErrorMessage
  },
  setup() {
    const router = useRouter()
    
    // GraphQL Mutation
    const { mutate: createGateway, loading: isLoading } = useMutation(CREATE_GATEWAY)
    
    const formData = ref({
      name: '',
      address: '',
      port: '',
      desc: ''
    })
    
    const errors = ref({})
    const showConfirmModal = ref(false)
    const showCancelModal = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')
    const showLoadingSpinner = ref(false)

    // Toast composable
    const { 
      toastMessage, 
      toastType, 
      isVisible: toastVisible, 
      showSuccess, 
      showError: showToastError, 
      hideToast 
    } = useToast()

    const connectionString = computed(() => {
      if (formData.value.address && formData.value.port) {
        return `${formData.value.address}:${formData.value.port}`
      }
      return ''
    })

    const gatewayType = computed(() => {
      if (!formData.value.address) return 'Remote Gateway'
      
      const ip = formData.value.address
      if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        return 'Local Gateway'
      }
      return 'Remote Gateway'
    })

    const hasFormData = computed(() => {
      return formData.value.name.trim() || 
             formData.value.address.trim() || 
             formData.value.port || 
             formData.value.desc.trim()
    })

    const clearError = (field) => {
      if (errors.value[field]) {
        errors.value = { ...errors.value, [field]: '' }
      }
      showError.value = false
    }

    const validateForm = () => {
      const newErrors = {}
      
      if (!formData.value.name.trim()) {
        newErrors.name = 'Gateway name is required'
      }
      
      if (!formData.value.address.trim()) {
        newErrors.address = 'IP address is required'
      } else {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        if (!ipRegex.test(formData.value.address)) {
          newErrors.address = 'Please enter a valid IP address'
        }
      }
      
      if (!formData.value.port || formData.value.port === '') {
        newErrors.port = 'Port number is required'
      } else {
        const portNum = Number(formData.value.port)
        if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
          newErrors.port = 'Port must be between 1 and 65535'
        }
      }
      
      errors.value = newErrors
      return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
      if (!validateForm()) {
        return
      }
      showConfirmModal.value = true
    }

    const confirmCreateGateway = async () => {
      showConfirmModal.value = false
      showLoadingSpinner.value = true
      
      try {
        // Real GraphQL Mutation
        const { data } = await createGateway({
          input: {
            name: formData.value.name.trim(),
            address: formData.value.address.trim(),
            port: Number(formData.value.port),
            desc: formData.value.desc.trim() || ''
          }
        })
        
        if (data?.createGateway?.success) {
          showSuccess(`Gateway "${formData.value.name}" created successfully!`)
          
          setTimeout(() => {
            router.push('/gateway-list')
          }, 1500)
        } else {
          const errorMsg = data?.createGateway?.message || 'Failed to create gateway'
          errorMessage.value = errorMsg
          showError.value = true
        }
        
      } catch (error) {
        console.error('Create gateway error:', error)
        errorMessage.value = 'Network error. Please check your connection and try again.'
        showError.value = true
      } finally {
        showLoadingSpinner.value = false
      }
    }

    const handleCancel = () => {
      if (hasFormData.value) {
        showCancelModal.value = true
      } else {
        goBack()
      }
    }

    const confirmCancel = () => {
      showCancelModal.value = false
      goBack()
    }

    const goBack = () => {
      router.push('/gateway-list')
    }

    return {
      // Form data
      formData,
      errors,
      
      // Loading states
      isLoading,
      showLoadingSpinner,
      
      // Modal states
      showConfirmModal,
      showCancelModal,
      showError,
      errorMessage,
      
      // Toast
      toastMessage,
      toastType,
      toastVisible,
      hideToast,
      
      // Computed
      connectionString,
      gatewayType,
      hasFormData,
      
      // Methods
      clearError,
      handleSubmit,
      confirmCreateGateway,
      handleCancel,
      confirmCancel,
      goBack
    }
  }
}
</script>

<style scoped>
/* Custom animations and transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states */
input:focus,
textarea:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Button hover effects */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}
</style>