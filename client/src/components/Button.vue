<script lang="ts">
import type { ButtonHTMLAttributes,PropType } from 'vue';

export default {
  name: 'Button',
  props: {
    textButton: {
        default: "",
        type: String,
        required: true,
    },
    type: {
        default: "button",
        type: String as PropType<ButtonHTMLAttributes['type']>,
        required: false,
    }
  },
}
</script>

<template>
    <button :type="type" :class="$attrs.class" class="cursor-pointer font-noto-sans font-bold" style="font-size: 16px;">
        {{ textButton }}
    </button>
</template>