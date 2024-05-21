<script setup>
  import { ref, onMounted } from 'vue'
  import { VDataTable } from 'vuetify/components'
  import { useRoute } from 'vue-router'
  import { useTableFilesStore } from '@/stores/tableFiles.js'

  const TableFilesStore = useTableFilesStore()
  const selectedItem = ref([])
  
  onMounted(async () => {
    const params = useRoute().params
    await TableFilesStore.mountTableView(params.id)
  })
</script>

<template>
  <div class="w-100 p-1 table-file"> 
    <v-data-table
      v-model="selectedItem"
      :items="TableFilesStore.tableView"
      item-key="id"
      show-select
      return-object
      height="100%"
      class="custom-data-table"
    >
    </v-data-table>
  </div>
</template>

<style lang="scss">
  .table-file {
    background-color: $white-color;
    box-shadow: 0px 1px 10px 0px #00000026;
    border-radius: 10px
  }

  .custom-data-table span {
    font-weight: bold;
  }

  tr:hover {
    background-color: red;
    cursor: pointer;
  }
</style>