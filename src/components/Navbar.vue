<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useTableFilesStore } from '@/stores/tableFiles.js'

  const route = useRoute()
</script>

<template>
  <div class="navbar-view">
    <span :class="route.name === 'home'? 'active' : ''">Início</span>
    <span v-if="route.name === 'viewFile'" class="ml-1 mr-1">></span>
    <span v-if="route.name === 'viewFile'" class="active"> Detalhe do CSV</span>
  </div>
</template>

<style lang="scss">
.navbar-view {
  display: flex;
  align-items: center;
  height: 6vh;
  padding: .5rem;
  color: $info;
}

.active {
  font-weight: bold
}
</style>

