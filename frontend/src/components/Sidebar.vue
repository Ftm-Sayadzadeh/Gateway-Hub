<template>
  <aside 
    :class="['sidebar fixed h-screen shadow-xl transition-all duration-300', isCollapsed ? 'w-20' : 'w-64']"
  >
    <button 
      @click="$emit('toggle-collapse')" 
      class="absolute top-4 -right-3 z-50 p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
    >
      <svg 
        :class="['w-4 h-4 text-white transition-transform', isCollapsed ? 'rotate-180' : '']" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
    
    <div class="p-6" style="border-bottom: 1px solid var(--color-sidebar-bg-secondary);">
      <div 
        class="flex items-center" 
        :class="isCollapsed ? 'justify-center' : 'space-x-3'"
      >
        
        <!-- style="background-color: var(--color-brand-secondary);" -->
        <div 
          class="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div v-if="!isCollapsed">
          <h1 class="text-lg font-bold" style="color: var(--color-sidebar-text);">Gateway Hub</h1>
          <p class="text-xs" style="color: var(--color-sidebar-text-muted);">Management Panel</p>
        </div>
      </div>
    </div>

    <nav class="p-4">
      <ul class="space-y-2">
        <li>
          <router-link 
            to="/gateway-list"
            :class="[
              'sidebar-nav-item flex items-center px-4 py-3 rounded-xl transition-all duration-200 group',
              isCollapsed ? 'justify-center' : 'space-x-3',
              $route.path === '/gateway-list' || $route.path === '/' || $route.path.startsWith('/gateway')
                ? 'active' 
                : ''
            ]"
          >
            <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span v-if="!isCollapsed" class="font-medium">Gateways</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/monitoring"
            :class="[
              'sidebar-nav-item flex items-center px-4 py-3 rounded-xl transition-all duration-200 group',
              isCollapsed ? 'justify-center' : 'space-x-3',
              $route.path === '/monitoring'
                ? 'active' 
                : ''
            ]"
          >
           <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span v-if="!isCollapsed" class="font-medium">Monitoring</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isCollapsed: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggle-collapse']
};
</script>

<style scoped>
.sidebar {
  background: var(--color-sidebar-bg);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.sidebar-nav-item {
  color: var(--color-sidebar-text-muted);
}

.sidebar-nav-item:hover {
  background-color: var(--color-sidebar-bg-secondary);
  color: var(--color-sidebar-text);
}

.sidebar-nav-item.active {
  background: var(--color-brand-primary);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(103, 58, 183, 0.3);
}

.sidebar-nav-item.active:hover {
  background: var(--color-brand-primary);
  color: white;
}

.sidebar-nav-item.active svg {
  color: white;
}
</style>