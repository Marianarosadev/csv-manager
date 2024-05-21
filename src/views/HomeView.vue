<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { v4 as uuidv4 } from 'uuid'
  import { useTableFilesStore } from '@/stores/tableFiles.js'
  import Navbar from '@/components/Navbar.vue'
  import DialogImportCSV from '@/components/dialogs/DialogIportCSV.vue';
  import DialogConfirmExport from '@/components/dialogs/DialogConfirmExport.vue'
  import TableViewFile from '@/components/TableViewFile.vue';
  import TableFiles from '@/components/TableFiles.vue';

  const route = useRoute()
  const TableFilesStore = useTableFilesStore()
  const dialogImportCSVIsActive = ref(false)
  const dialogExportIsActive = ref(false)
  const teste = ref(true)

  const selectedColum = ref(false)

  const handleSwitchChange = (item) => {
    TableFilesStore.handleSwitchColumnsChange(route.params.id, item)
  }

  const currentViewComponent = () => {
    const routeName = useRoute().name
    return routeName === 'home' ? TableFiles : TableViewFile
  }

  const toggleDialog = () => {
    dialogImportCSVIsActive.value = !dialogImportCSVIsActive.value
  }

  const toggleDialogExport = () => {
    dialogExportIsActive.value = !dialogExportIsActive.value
  }

  const exportViewTableCSV = () => {
    const table = TableFilesStore.tableView

    const csvContent = "data:text/csv;charset=utf-8," + tableToCSV(table);
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "table_data.csv");
    document.body.appendChild(link);
    link.click();
  }

  const tableToCSV = (table) => {
    let csv = "";

    if (table.length > 0) {
      const columnNames = Object.keys(table[0]);
      csv += columnNames.join(",") + "\n";
      table.forEach(row => {
        const values = Object.values(row);
        csv += values.join(",") + "\n";
      });
    }

    return csv;
  }
</script>

<template>
  <Navbar/>

  <div class="actions">
    <div>
      <div v-if="route.name === 'home'" class="home-title">
        Seus Arquivos
      </div> 
      <v-menu
        v-else
        transition="slide-y-transition"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ props }">
          <v-btn 
            v-bind="props"
            variant="outlined" 
            density="compact" 
            prepend-icon="mdi-view-column-outline" 
            rounded="xl" 
            class="text-none mr-3"
          >
            Colunas
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-btn 
              variant="text" 
              prepend-icon="mdi-content-copy" 
              class="text-none justify-content-start p-2"
              block
              @click="TableFilesStore.showAllColumns(route.params.id)"
            >
              Mostrar todas as Colunas
            </v-btn>

            <v-btn 
              variant="text" 
              prepend-icon="mdi-content-copy" 
              class="text-none justify-content-start p-2"
              block
              @click="TableFilesStore.hideAllColumns()"
            >
              Esconder todas as Colunas
            </v-btn>
          </v-list-item>

          <v-divider class="m-1"/>
          <v-list-item
            v-for="(item, i) in TableFilesStore.getTableColuns(route.params.id)"
            :key="i"
          >
            <div class="d-flex align-center justify-content-between">
              <div>
                <i class="mdi mdi-content-copy"></i>
                <span class="ml-1 mr-3">{{ item }}</span>
              </div>
              <v-switch 
                @change="handleSwitchChange(item)"
                hide-details
                :model-value="TableFilesStore.switchItem[item]"
                color="primary"
              />
            </div>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div>
      <v-btn 
        v-if="route.name === 'home'" 
        variant="outlined" 
        density="compact" 
        prepend-icon="mdi-plus" 
        rounded="xl" 
        class="text-none"
        block
        @click="toggleDialog"
      >
        Importar CSV
      </v-btn>
      <div v-else>
        <v-btn 
          variant="outlined" 
          density="compact" 
          rounded="xl" 
          prepend-icon="mdi-export-variant" 
          class="me-2 text-none mr-3"
          @click="toggleDialogExport"
        >
          <template v-slot:prepend>
            <v-icon size="small">mdi-export-variant</v-icon>
          </template>
          Exportar tabela
        </v-btn>
        <v-btn 
          variant="outlined" 
          density="compact" 
          prepend-icon="mdi-arrow-left" 
          rounded="xl" 
          class="text-none"
          @click="$router.push({name: 'home'})"
        >
          voltar
        </v-btn>
      </div>
    </div>
  </div>
 
  <div class="table-view">
    <component :is="currentViewComponent()"/>
  </div>

  <DialogImportCSV 
    @update:dialogIsActive="dialogImportCSVIsActive = $event"
    :dialogIsActive="dialogImportCSVIsActive" 
  />

  <DialogConfirmExport 
    @update:dialogIsActive="dialogExportIsActive = $event"
    @exportViewTableCSV="exportViewTableCSV"
    :dialogIsActive="dialogExportIsActive" 
  />
</template>

<style lang="scss">
  .actions {
    margin: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 5vh;

    @media (max-width: $breakpoint-sm) {
      display: block;
      height: 14vh;
    }
  }

  .table-view {
    min-height: 86vh;
    display: flex;
    justify-content: center;
    align-items: start;
    margin: .5rem 2rem;
  }

  .home-title {
    font-size: $font-size-large;
  }
</style>

