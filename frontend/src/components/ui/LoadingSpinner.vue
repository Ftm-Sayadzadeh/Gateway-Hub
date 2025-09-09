<template>
  <div class="flex justify-center items-center py-24">
    <div class="text-center">
      <div class="relative">
        <div 
          :class="[
            'border-4 border-gray-200 rounded-full animate-spin mx-auto mb-4',
            size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'
          ]"
          :style="{ 'border-top-color': color }"
        ></div>
      </div>
      <p v-if="message" :class="[
        'font-medium',
        size === 'sm' ? 'text-sm' : 'text-lg',
        textColor
      ]">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    message: {
      type: String,
      default: 'Loading...'
    },
    size: {
      type: String,
      default: 'md', // sm, md, lg
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    color: {
      type: String,
      default: 'var(--color-brand-primary)'
    },
    textColor: {
      type: String,
      default: 'text-secondary'
    }
  }
}
</script>