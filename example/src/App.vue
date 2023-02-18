<template>
  <router-view />
</template>

<script>
import { mapState } from 'pinia';
import appStore from '@/store/app';

export default {
  name: 'App',
  computed: {
    ...mapState(appStore, ['connected']),
  },
  watch: {
    connected: {
      immediate: true,
      handler(value) {
        console.log('connected:', value);
      },
    },
  },
};
</script>
