<script lang="ts">
//https://markus.oberlehner.net/blog/skeleton-loading-animation-with-vue/

export default {
  name: 'LoadingSkeleton',
  props: {
    maxWidth: {
      // The default maxiumum width is 100%.
      default: 100,
      type: Number,
    },
    minWidth: {
      // Lines have a minimum width of 80%.
      default: 80,
      type: Number,
    },
    width: {
      // Make it possible to define a fixed
      // width instead of using a random one.
      default: null,
      type: String,
    },
  },
  computed: {
    computedWidth() {
      // Either use the given fixed width or
      // a random width between the given min
      // and max values.
      return this.width || `${Math.floor((Math.random() * (this.maxWidth - this.minWidth)) + this.minWidth)}%`;
    },
  },
};
</script>

<template>
    <span
        :style="{ width: computedWidth }"
        class="SkeletonBox"
    />
</template>

<style scoped lang="scss">
.SkeletonBox {
    display: inline-block;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    background-color: #DDDBDD;
 
   &::after {
     position: absolute;
     top: 0;
     right: 0;
     bottom: 0;
     left: 0;
     transform: translateX(-100%);
     background-image: linear-gradient(
       90deg,
       rgba(#fff, 0) 0,
       rgba(#fff, 0.2) 20%,
       rgba(#fff, 0.5) 60%,
       rgba(#fff, 0)
     );
     animation: shimmer 5s infinite;
     content: '';
   }
 
   @keyframes shimmer {
     100% {
       transform: translateX(100%);
     }
   }
  }
</style>