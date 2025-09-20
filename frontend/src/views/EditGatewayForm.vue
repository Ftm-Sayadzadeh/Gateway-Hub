<template>
  <div class="p-8">
    <!-- Loading State -->
    <LoadingSpinner 
      v-if="isInitialLoading" 
      message="Loading gateway details..." 
      size="lg"
    />

    <!-- Error State -->
    <ErrorMessage
      v-else-if="hasLoadingError"
      title="Gateway Not Found"
      :message="loadingErrorMessage"
      show-go-back
      go-back-text="Back to Gateway List"
      @go-back="goBack"
    />

    <!-- Save Loading Overlay -->
    <LoadingSpinner 
      v-else-if="showSaveSpinner" 
      message="Saving changes..." 
      size="lg"
    />

    <!-- Main Content -->
    <div v-else>
      <!-- Breadcrumb Navigation -->
      <div class="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <router-link to="/gateway-list" class="hover:text-indigo-600 transition-colors">
          Gateway Management
        </router-link>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <router-link :to="`/gateway/${gatewayId}`" class="hover:text-indigo-600 transition-colors">
          {{ originalGateway?.name || 'Gateway Details' }}
        </router-link>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <span class="text-gray-900 font-medium">Edit Gateway</span>
      </div>

      <!-- Main Form Container -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Left Side - Form (60%) -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

            <!-- Form Header -->
            <div class="border-b border-gray-100 pb-6 mb-8">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-xl font-semibold text-gray-900 flex items-center">
                    <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                      </path>
                    </svg>
                    Edit Gateway Information
                  </h2>
                  <p class="text-gray-600 text-sm mt-1">Update the details for this gateway</p>
                </div>
                
                <!-- Status Badge -->
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  originalGateway?.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  <div :class="[
                    'w-2 h-2 rounded-full mr-2',
                    originalGateway?.isActive ? 'bg-green-400' : 'bg-red-400'
                  ]"></div>
                  {{ originalGateway?.isActive ? 'Online' : 'Offline' }}
                </span>
              </div>
            </div>

            <!-- Changes Alert -->
            <div v-if="hasChanges" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex">
                <svg class="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z">
                  </path>
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-yellow-800">Unsaved Changes</h4>
                  <p class="text-sm text-yellow-700 mt-1">You have made changes that haven't been saved yet.</p>
                </div>
              </div>
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
                ]" placeholder="Enter gateway name" @input="clearError('name')" />
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

              <!-- Status Toggle -->
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900">Gateway Status</h4>
                  <p class="text-sm text-gray-600">Enable or disable this gateway</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="formData.isActive"
                    class="sr-only peer"
                  >
                  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span class="ml-3 text-sm font-medium text-gray-900">
                    {{ formData.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                @click="resetForm"
                :disabled="!hasChanges"
                class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Reset Changes
              </button>
              
              <div class="flex items-center space-x-3">
                <button
                  type="button"
                  @click="handleCancel"
                  class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  @click="handleSubmit"
                  :disabled="isLoading || !hasChanges"
                  class="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  <div v-if="isLoading"
                    class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  <span>{{ isLoading ? 'Saving...' : 'Save Changes' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Preview & Changes (40%) -->
        <div class="space-y-6">

          <!-- Current vs New Preview -->
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

            <!-- Updated Gateway Card -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 mb-4">
              <div class="flex items-center space-x-3">
                <div :class="[
                  'w-3 h-3 rounded-full',
                  formData.isActive ? 'bg-green-500' : 'bg-gray-400'
                ]"></div>
                <div>
                  <h4 class="font-medium text-gray-900">
                    {{ formData.name || 'Gateway Name' }}
                  </h4>
                  <p class="text-sm text-gray-600">
                    {{ hasChanges ? 'Ready to save changes' : 'No changes' }}
                  </p>
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
                  {{ connectionString }}
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
              
              <div :class="[
                'rounded-lg p-4',
                formData.isActive ? 'bg-green-50' : 'bg-gray-50'
              ]">
                <div class="flex items-center mb-2">
                  <svg :class="[
                    'w-4 h-4 mr-2',
                    formData.isActive ? 'text-green-600' : 'text-gray-600'
                  ]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  <span :class="[
                    'text-xs font-medium uppercase tracking-wide',
                    formData.isActive ? 'text-green-800' : 'text-gray-800'
                  ]">STATUS</span>
                </div>
                <p :class="[
                  'text-sm',
                  formData.isActive ? 'text-green-900' : 'text-gray-900'
                ]">
                  {{ formData.isActive ? 'Active & Running' : 'Inactive' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Changes Summary -->
          <div v-if="hasChanges" class="bg-white rounded-2xl shadow-sm border border-orange-200 p-6">
            <h3 class="text-lg font-semibold text-orange-900 mb-4 flex items-center">
              <svg class="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z">
                </path>
              </svg>
              Changes Summary
            </h3>
            
            <div class="space-y-3">
              <div v-for="change in changesList" :key="change.field" class="flex justify-between items-start p-3 bg-orange-50 rounded-lg">
                <div class="flex-1">
                  <p class="text-sm font-medium text-orange-900">{{ change.label }}</p>
                  <p class="text-xs text-orange-700 mt-1">
                    <span class="font-mono bg-red-100 px-2 py-1 rounded text-red-800">{{ change.oldValue }}</span>
                    →
                    <span class="font-mono bg-green-100 px-2 py-1 rounded text-green-800">{{ change.newValue }}</span>
                  </p>
                </div>
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
              Edit Tips
            </h3>
            <ul class="text-xs text-indigo-800 space-y-2">
              <li class="flex items-start">
                <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span>Changes are saved immediately after confirmation</span>
              </li>
              <li class="flex items-start">
                <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span>Changing IP or port may affect connectivity</span>
              </li>
              <li class="flex items-start">
                <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span>Status changes take effect immediately</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Confirmation Modal -->
    <ConfirmationModal
      :visible="showConfirmModal"
      type="info"
      title="Save Gateway Changes"
      subtitle="Please confirm your changes"
      confirm-text="Save Changes"
      cancel-text="Review"
      :loading="isLoading"
      loading-text="Saving..."
      @confirm="confirmSaveGateway"
      @cancel="showConfirmModal = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-600">The following changes will be applied:</p>
        <div class="bg-gray-50 p-4 rounded-lg space-y-2">
          <div v-for="change in changesList" :key="change.field" class="text-sm">
            <strong>{{ change.label }}:</strong>
            <span class="ml-2 font-mono bg-red-100 px-2 py-1 rounded text-red-800 text-xs">{{ change.oldValue }}</span>
            →
            <span class="ml-1 font-mono bg-green-100 px-2 py-1 rounded text-green-800 text-xs">{{ change.newValue }}</span>
          </div>
        </div>
      </div>
    </ConfirmationModal>

    <!-- Cancel Confirmation Modal -->
    <ConfirmationModal
      :visible="showCancelModal"
      type="warning"
      title="Discard Changes"
      subtitle="Unsaved changes will be lost"
      confirm-text="Yes, Discard"
      cancel-text="Continue Editing"
      @confirm="confirmCancel"
      @cancel="showCancelModal = false"
    >
      <p>Are you sure you want to discard your changes? All modifications will be lost.</p>
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

    <!-- Save Error -->
    <ErrorMessage
      v-if="showSaveError"
      title="Failed to Save Changes"
      :message="saveErrorMessage"
      show-retry
      show-go-back
      go-back-text="Back to Details"
      @retry="handleSubmit"
      @go-back="goToDetails"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { GET_GATEWAY, UPDATE_GATEWAY } from '@/apollo/queries'

// UI Components
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'

// Composables
import { useToast } from '@/composables/useToast'

export default {
  name: 'EditGatewayForm',
  components: {
    LoadingSpinner,
    ToastNotification,
    ConfirmationModal,
    ErrorMessage
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const gatewayId = route.params.id
    
    // GraphQL Query & Mutation
    const { result, loading: isInitialLoading, error: loadingError } = useQuery(GET_GATEWAY, { id: gatewayId })
    const { mutate: updateGateway, loading: isLoading } = useMutation(UPDATE_GATEWAY)
    
    const originalGateway = computed(() => result.value?.gateway)
    const hasLoadingError = computed(() => !!loadingError.value)
    const loadingErrorMessage = computed(() => loadingError.value?.message || 'Gateway not found or could not be loaded.')
    
    const formData = ref({
      name: '',
      address: '',
      port: '',
      desc: '',
      isActive: true
    })
    
    const errors = ref({})
    const showConfirmModal = ref(false)
    const showCancelModal = ref(false)
    const showSaveError = ref(false)
    const saveErrorMessage = ref('')
    const showSaveSpinner = ref(false)

    // Toast composable
    const { 
      toastMessage, 
      toastType, 
      isVisible: toastVisible, 
      showSuccess, 
      showError: showToastError, 
      hideToast 
    } = useToast()

    // Load gateway data into form
    watch(originalGateway, (gateway) => {
      if (gateway) {
        formData.value = {
          name: gateway.name || '',
          address: gateway.address || '',
          port: gateway.port || '',
          desc: gateway.desc || '',
          isActive: gateway.isActive ?? true
        }
      }
    }, { immediate: true })

    const connectionString = computed(() => {
      if (formData.value.address && formData.value.port) {
        return `${formData.value.address}:${formData.value.port}`
      }
      return 'IP:PORT'
    })

    const gatewayType = computed(() => {
      if (!formData.value.address) return 'Remote Gateway'
      
      const ip = formData.value.address
      if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        return 'Local Gateway'
      }
      return 'Remote Gateway'
    })

    const hasChanges = computed(() => {
      if (!originalGateway.value) return false
      
      return (
        formData.value.name !== originalGateway.value.name ||
        formData.value.address !== originalGateway.value.address ||
        String(formData.value.port) !== String(originalGateway.value.port) ||
        formData.value.desc !== (originalGateway.value.desc || '') ||
        formData.value.isActive !== originalGateway.value.isActive
      )
    })

    const changesList = computed(() => {
      if (!originalGateway.value || !hasChanges.value) return []
      
      const changes = []
      
      if (formData.value.name !== originalGateway.value.name) {
        changes.push({
          field: 'name',
          label: 'Gateway Name',
          oldValue: originalGateway.value.name || '(empty)',
          newValue: formData.value.name || '(empty)'
        })
      }
      
      if (formData.value.address !== originalGateway.value.address) {
        changes.push({
          field: 'address',
          label: 'IP Address',
          oldValue: originalGateway.value.address || '(empty)',
          newValue: formData.value.address || '(empty)'
        })
      }
      
      if (String(formData.value.port) !== String(originalGateway.value.port)) {
        changes.push({
          field: 'port',
          label: 'Port',
          oldValue: String(originalGateway.value.port) || '(empty)',
          newValue: String(formData.value.port) || '(empty)'
        })
      }
      
      if (formData.value.desc !== (originalGateway.value.desc || '')) {
        changes.push({
          field: 'desc',
          label: 'Description',
          oldValue: originalGateway.value.desc || '(empty)',
          newValue: formData.value.desc || '(empty)'
        })
      }
      
      if (formData.value.isActive !== originalGateway.value.isActive) {
        changes.push({
          field: 'isActive',
          label: 'Status',
          oldValue: originalGateway.value.isActive ? 'Active' : 'Inactive',
          newValue: formData.value.isActive ? 'Active' : 'Inactive'
        })
      }
      
      return changes
    })

    const clearError = (field) => {
      if (errors.value[field]) {
        errors.value = { ...errors.value, [field]: '' }
      }
      showSaveError.value = false
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

    const resetForm = () => {
      if (originalGateway.value) {
        formData.value = {
          name: originalGateway.value.name || '',
          address: originalGateway.value.address || '',
          port: originalGateway.value.port || '',
          desc: originalGateway.value.desc || '',
          isActive: originalGateway.value.isActive ?? true
        }
        errors.value = {}
        showToastError('Changes reset to original values', 'info')
      }
    }

    const handleSubmit = () => {
      if (!validateForm() || !hasChanges.value) {
        return
      }
      showConfirmModal.value = true
    }

    const confirmSaveGateway = async () => {
      showConfirmModal.value = false
      showSaveSpinner.value = true
      
      try {
        const updateData = {
          name: formData.value.name.trim(),
          address: formData.value.address.trim(),
          port: Number(formData.value.port),
          desc: formData.value.desc.trim(),
          isActive: formData.value.isActive
        }
        
        const { data } = await updateGateway({
          id: gatewayId,
          input: updateData
        })
        
        if (data?.updateGateway?.success) {
          showSuccess('Gateway updated successfully!')
          
          setTimeout(() => {
            router.push(`/gateway/${gatewayId}`)
          }, 1500)
        } else {
          const errorMsg = data?.updateGateway?.message || 'Failed to update gateway'
          saveErrorMessage.value = errorMsg
          showSaveError.value = true
        }
        
      } catch (error) {
        console.error('Update gateway error:', error)
        saveErrorMessage.value = 'Network error. Please check your connection and try again.'
        showSaveError.value = true
      } finally {
        showSaveSpinner.value = false
      }
    }

    const handleCancel = () => {
      if (hasChanges.value) {
        showCancelModal.value = true
      } else {
        goToDetails()
      }
    }

    const confirmCancel = () => {
      showCancelModal.value = false
      goToDetails()
    }

    const goBack = () => {
      router.push('/gateway-list')
    }

    const goToDetails = () => {
      router.push(`/gateway/${gatewayId}`)
    }

    return {
      // Data
      gatewayId,
      originalGateway,
      formData,
      errors,
      
      // Loading states
      isInitialLoading,
      hasLoadingError,
      loadingErrorMessage,
      isLoading,
      showSaveSpinner,
      
      // Modal states
      showConfirmModal,
      showCancelModal,
      showSaveError,
      saveErrorMessage,
      
      // Toast
      toastMessage,
      toastType,
      toastVisible,
      hideToast,
      
      // Computed
      connectionString,
      gatewayType,
      hasChanges,
      changesList,
      
      // Methods
      clearError,
      resetForm,
      handleSubmit,
      confirmSaveGateway,
      handleCancel,
      confirmCancel,
      goBack,
      goToDetails
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

/* Toggle switch custom styling */
input[type="checkbox"]:checked + div {
  background-color: #4f46e5;
}

input[type="checkbox"]:focus + div {
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}
</style>