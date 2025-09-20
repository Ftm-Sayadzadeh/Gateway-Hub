<template>
  <div class="min-h-screen" style="background: var(--gradient-bg);">
    <!-- Background Pattern -->
    <div class="fixed inset-0 opacity-3">
      <div class="absolute inset-0" 
           style="background-image: radial-gradient(circle at 1px 1px, var(--color-brand-primary) 1px, transparent 0); 
                  background-size: 40px 40px; opacity: 0.02;"></div>
    </div>

    <div class="relative p-6">
      <!-- Loading State -->
      <LoadingSpinner 
        v-if="isLoading" 
        message="Loading gateway details..." 
        size="lg"
      />

      <!-- Error State -->
      <ErrorMessage
        v-else-if="hasError"
        title="Gateway Not Found"
        :message="hasError.message || 'The requested gateway could not be loaded.'"
        show-go-back
        go-back-text="Back to Gateway List"
        @go-back="$router.push('/gateway-list')"
      />

      <!-- Main Content -->
      <template v-else-if="gateway">
        <!-- Header Section -->
        <GatewayHeader
          :gateway="gateway"
          :gateway-id="gatewayId"
          :loading="{ toggle: toggleLoading }"
          @toggle-status="showToggleConfirm = true"
          @edit="editGateway"
          @delete="showDeleteConfirm = true"
        />

        <div class="max-w-8xl mx-auto space-y-8 pt-6">
          <!-- Status Cards Row -->
          <GatewayStatusCards
            :gateway="gateway"
            :metrics="metrics"
          />

          <!-- Main Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GatewayNetworkConfig :gateway="gateway" />

            <GatewayInformation :gateway="gateway" />
          </div>

          <GatewayDescription 
            :gateway="gateway" 
            show-additional-info
          />
        </div>
      </template>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal
      :visible="showDeleteConfirm"
      type="danger"
      title="Delete Gateway"
      subtitle="This action cannot be undone"
      confirm-text="Delete Gateway"
      :loading="deleteLoading"
      loading-text="Deleting..."
      @confirm="handleDeleteConfirm"
      @cancel="showDeleteConfirm = false"
    >
      <p class="text-secondary">
        Are you sure you want to delete gateway 
        <strong class="text-danger">"{{ gateway?.name }}"</strong>?
      </p>
    </ConfirmationModal>

    <!-- Toggle Status Confirmation Modal -->
    <ConfirmationModal
      :visible="showToggleConfirm"
      :type="gateway?.isActive ? 'warning' : 'info'"
      :title="gateway?.isActive ? 'Turn Off Gateway' : 'Turn On Gateway'"
      :subtitle="gateway?.isActive ? 'Gateway will stop all operations' : 'Gateway will become operational'"
      :loading="toggleLoading"
      loading-text="Updating..."
      @confirm="handleToggleConfirm"
      @cancel="showToggleConfirm = false"
    >
      <p class="text-secondary">
        Are you sure you want to {{ gateway?.isActive ? 'turn off' : 'turn on' }} gateway 
        <strong :class="gateway?.isActive ? 'text-warning' : 'text-success'">
          "{{ gateway?.name }}"
        </strong>?
      </p>
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
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'

// GraphQL Queries
import { GET_GATEWAY, TOGGLE_GATEWAY_STATUS, DELETE_GATEWAY } from '@/apollo/queries'

// UI Components
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorMessage from '@/components/ui/ErrorMessage.vue'
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue'
import ToastNotification from '@/components/ui/ToastNotification.vue'

// Gateway Components
import GatewayHeader from '@/components/gatewayDetails/GatewayHeader.vue'
import GatewayStatusCards from '@/components/gatewayDetails/GatewayStatusCards.vue'
import GatewayNetworkConfig from '@/components/gatewayDetails/GatewayNetworkConfig.vue'
import GatewayInformation from '@/components/gatewayDetails/GatewayInformation.vue'
import GatewayDescription from '@/components/gatewayDetails/GatewayDescription.vue'

// Composables
import { useGatewayMetrics } from '@/composables/useGatewayMetrics'
import { useToast } from '@/composables/useToast'

export default {
  name: 'GatewayDetails',
  components: {
    LoadingSpinner,
    ErrorMessage,
    ConfirmationModal,
    ToastNotification,
    GatewayHeader,
    GatewayStatusCards,
    GatewayNetworkConfig,
    GatewayInformation,
    GatewayDescription
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const gatewayId = route.params.id

    // GraphQL Queries & Mutations
    const { result, loading: isLoading, error: hasError } = useQuery(GET_GATEWAY, { id: gatewayId })
    const { mutate: toggleGatewayStatus, loading: toggleLoading } = useMutation(TOGGLE_GATEWAY_STATUS)
    const { mutate: deleteGatewayById, loading: deleteLoading } = useMutation(DELETE_GATEWAY)

    // Local state
    const showDeleteConfirm = ref(false)
    const showToggleConfirm = ref(false)

    // Composables
    const { metrics } = useGatewayMetrics(gatewayId)
    const { 
      toastMessage, 
      toastType, 
      isVisible: toastVisible, 
      showSuccess, 
      showError, 
      hideToast 
    } = useToast()

    // extract gateway data
    const gateway = computed(() => result.value?.gateway)

    // Methods
    const handleToggleConfirm = async () => {
      showToggleConfirm.value = false
      try {
        const { data } = await toggleGatewayStatus({ id: gatewayId })
        if (data?.toggleGateway?.success) {
          showSuccess(data.toggleGateway.message)
          if (gateway.value) {
            gateway.value.updatedAt = new Date().toISOString()
          }
        } else {
          showError(data.toggleGateway.message || 'Failed to toggle gateway status.')
        }
      } catch (error) {
        console.error('Toggle gateway error:', error)
        showError('Error toggling gateway status.')
      }
    }

    const handleDeleteConfirm = async () => {
      try {
        const { data } = await deleteGatewayById({ id: gatewayId })
        if (data?.deleteGateway?.success) {
          showSuccess(data.deleteGateway.message)
          // Navigate back
          setTimeout(() => {
            router.push('/gateway-list')
          }, 2000)
        } else {
          showError(data.deleteGateway.message || 'Failed to delete gateway.')
        }
      } catch (error) {
        console.error('Delete gateway error:', error)
        showError('Error deleting gateway')
      } finally {
        showDeleteConfirm.value = false
      }
    }

    const editGateway = () => {
      router.push(`/gateway/${gatewayId}/edit`)
    }

    return {
      // Data
      gateway,
      metrics,
      gatewayId,
      
      // Loading states
      isLoading,
      hasError,
      toggleLoading,
      deleteLoading,
      
      // Modal states
      showDeleteConfirm,
      showToggleConfirm,
      
      // Toast
      toastMessage,
      toastType,
      toastVisible,
      showSuccess,
      showError,
      hideToast,
      
      // Methods
      handleToggleConfirm,
      handleDeleteConfirm,
      editGateway
    }
  }
}
</script>

<style scoped>
.text-warning { color: var(--color-warning); }
.text-success { color: var(--color-success); }
.text-secondary { color: var(--color-text-secondary); }
</style>