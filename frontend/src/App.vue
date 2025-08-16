<template>
  <div class="flex">
    <Sidebar />

    <main class="flex-1 ml-64">
      <router-view />
    </main>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Sidebar
  }
}
</script>

<style src="./colors.css"></style>