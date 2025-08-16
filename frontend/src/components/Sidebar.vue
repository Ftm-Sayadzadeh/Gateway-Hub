<template>
  <aside class="sidebar fixed w-64 shadow-xl h-screen">
    <!--header-->
    <div class="p-6" style="border-bottom: 1px solid var(--color-sidebar-bg-secondary);">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
          style="background-color: var(--color-brand-secondary);">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-lg font-bold" style="color: var(--color-sidebar-text);">Gateway Hub</h1>
          <p class="text-xs" style="color: var(--color-sidebar-text-muted);">Management Panel</p>
        </div>
      </div>
    </div>

    <!--navigation-->
    <nav class="p-4">
      <ul class="space-y-2">
        <li>
         <router-link 
            to="/gateway-list"
            :class="[
              'sidebar-nav-item flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
              $route.path === '/gateway-list' || $route.path === '/' || $route.path.startsWith('/gateway')
                ? 'active' 
                : ''
            ]"
          >
            <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span class="font-medium">Gateways</span>
          </router-link>
        </li>
        <router-link
        to="/monitoring"
        :class="[
              'sidebar-nav-item flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
              $route.path === '/monitoring'
                ? 'active' 
                : ''
            ]"
          >
           <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span class="font-medium">Monitoring</span>
        </router-link>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name : 'Sidebar'
}
</script>