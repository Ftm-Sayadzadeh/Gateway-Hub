<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    <div
      v-for="gateway in gateways"
      :key="gateway.id"
      class="group relative bg-white rounded-2xl border border-default shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-6"
    >
      <!-- Header-->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3 min-w-0 flex-1">
          <div class="relative">
            <div 
              :class="[
                'w-4 h-4 rounded-full transition-all duration-300',
                gateway.isActive ? 'bg-success' : 'bg-danger'
              ]"
            ></div>
            <div 
              v-if="gateway.isActive"
              class="absolute inset-0 w-4 h-4 rounded-full animate-ping bg-success opacity-75"
            ></div>
          </div>
          
          <!-- Gateway Name -->
          <h3 class="text-lg font-bold text-primary truncate" :title="gateway.name">
            {{ gateway.name }}
          </h3>
        </div>
        
        <!-- Status -->
        <span 
          :class="[
            'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium',
            gateway.isActive 
              ? 'bg-success-light text-success' 
              : 'bg-danger-light text-danger'
          ]"
        >
          {{ gateway.isActive ? 'Online' : 'Offline' }}
        </span>
      </div>

      <!-- Connection Info -->
      <div class="bg-secondary rounded-xl p-4 mb-6 border border-light">
        <div class="grid grid-cols-2 gap-16">
        
          <div>
            <div class="text-xs font-medium text-muted mb-1">IP Address</div>
            <div class="font-mono text-sm font-semibold text-primary">
              {{ gateway.address }}
            </div>
          </div>
          
          <div>
            <div class="text-xs font-medium text-muted mb-1">Port</div>
            <div class="font-mono text-sm font-bold text-primary">
              {{ gateway.port }}
            </div>
          </div>
        </div>
      </div>

      <!-- Action -->
      <div class="flex space-x-2">
        <button 
          @click="$emit('view-details', gateway.id)"
          class="btn btn-secondary flex-1 text-sm group"
          title="View Details"
        >
          <svg class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          View
        </button>
        
        <button 
          @click="$emit('edit-gateway', gateway.id)"
          class="btn btn-secondary flex-1 text-sm group hover:bg-brand-light hover:text-brand"
          title="Edit Gateway"
        >
          <svg class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit
        </button>
        
        <button 
          @click="$emit('delete-gateway', gateway.id)"
          class="btn btn-secondary px-3 group hover:bg-danger-light hover:text-danger"
          title="Delete Gateway"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GatewayGrid',
  props: {
    gateways: {
      type: Array,
      required: true
    }
  },
  emits: ['view-details', 'edit-gateway', 'delete-gateway']
}
</script>