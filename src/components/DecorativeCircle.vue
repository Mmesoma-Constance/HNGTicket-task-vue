<template>
  <div
    :class="[
      'absolute',
      sizeClasses[size],
      positionClasses[position],
      'rounded-full bg-gradient-to-br from-[#e76fb6aa] to-[#E11791] blur-3xl',
      animate ? 'animate-float' : '',
      className
    ]"
  ></div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  size: {
    type: String,
    default: 'md',
  },
  position: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
  animate: {
    type: Boolean,
    default: false,
  },
})

const sizeClasses = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
}

const positionClasses = {
  'top-left': '-top-16 -left-16',
  'top-right': '-top-16 -right-16',
  'bottom-left': '-bottom-16 -left-16',
  'bottom-right': '-bottom-16 -right-16',
}
</script>
