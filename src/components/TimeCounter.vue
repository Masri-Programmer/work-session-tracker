<script setup lang="ts">
import { useDateFormat, useNow } from '@vueuse/core'
import { ref } from 'vue'

const formatter = ref('dddd YYYY-MM-DD HH:mm:ss')
const lang = ref('en-US')
const formatted = useDateFormat(useNow(), formatter, { locales: lang })
</script>

<template>
  <p class="">
    {{ formatted }}
  </p>
</template>
