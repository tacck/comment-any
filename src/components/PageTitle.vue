<template>
  <span class="text-h4 text-md-h2">{{ title }}</span>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>
