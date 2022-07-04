<template>
  <div class="spinner" :style="cssVars">
    <svg :viewBox="`0 0 ${size} ${size}`">
      <circle :cx="size/2" :cy="size/2" r="20" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'solid-spinner',
  props: {
    color: {
      type: String,
      default: undefined
    },
    size: {
      type: Number,
      default: 64
    }
  },
  computed: {
    cssVars () {
      const result: any = {}
      if (this.color) {
        result['--color'] = this.color
      }
      if (this.size) {
        result['--size'] = `${this.size}px`
      }
      return result
    }
  }
})
</script>

<style lang="scss">
.spinner {
  width: var(--size);
  height: var(--size);
}

.spinner svg {
  animation: rotate 1.5s linear infinite;
  height: 100%;
  width: 100%;
}

.spinner circle {
  stroke-dasharray: 1,200;
  stroke-dashoffset: 0;
  animation:
    dash 1.5s ease-in-out infinite 0s,
    color 6s ease-in-out infinite -0.75s;
  stroke-linecap: round;
  fill: none;
  stroke-width:3;
}

@keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
  }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1,200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -124;
  }
}
@keyframes color {
  100%, 0% {
    stroke: var(--color);
  }
}
</style>
