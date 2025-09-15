<template>
  <div class="flex">
    <Sidebar :is-collapsed="isSidebarCollapsed" @toggle-collapse="isSidebarCollapsed = !isSidebarCollapsed" />

    <main 
      :class="['flex-1 transition-all duration-300', isSidebarCollapsed ? 'ml-20' : 'ml-64']"
    >
      <router-view />
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    Sidebar
  },
  setup() {
    const isSidebarCollapsed = ref(false);
    
    return {
      isSidebarCollapsed
    };
  }
};
</script>

<style src="./colors.css"></style>