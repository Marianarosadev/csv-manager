<script setup>
  import { ref } from 'vue'
  import { VDataTable } from 'vuetify/components'
  import { useRouter } from 'vue-router'
  import { useTableFilesStore } from '@/stores/tableFiles.js'

  const TableFilesStore = useTableFilesStore()
  const router = useRouter()

  const headers = ref([
    { title: 'Nome', key: 'name' },
    { title: 'Numero de Colunas', key: 'numberColumns' },
    { title: 'Número de Linhas', key: 'numberLines' },
    { title: 'Exportado', key: 'exported' },
    { title: 'Criado em', key: 'createdIn' },
    { title: 'Download', key: 'actions' },
  ])

  const rowClicked = (item) => {
    TableFilesStore.mountTableView(item.id)
    router.push({ name: 'viewFile', params: { id: item.id } });
  }

  const downloadItem = (item) => {
    const table = TableFilesStore.getFilteredTable(item.id)

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
  <div v-if="TableFilesStore.tableData.length > 0" class="w-100 p-1 table-file"> 
    <v-data-table
      :headers="headers"
      :items="TableFilesStore.tableData"
      item-key="id"
      fixed-header
      height="100%"
      class="custom-data-table"
    >
      <template v-slot:item="{ item, props }">
        <tr @click="rowClicked(item)">
          <td>{{ item.name }}</td>
          <td>{{ item.numberColumns }}</td>
          <td>{{ item.numberLines }}</td>
          <td>{{ item.exported }}</td>
          <td>{{ item.createdIn }}</td>
          <td>
            <v-btn density="compact" icon="mdi-download" @click.stop="downloadItem(item)">
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
  <div v-else class="empty-table w-100 h-100 d-flex align-center justify-content-center flex-column h-100">
    <img src="@/assets/images/table.svg" alt="My Icon">
    <div class="fw-bold mt-4">Sem tabelas importadas</div>
    <div>Importe clicando no botão acima “importar csv” para começar</div>
  </div>
</template>

<style lang="scss">
  .table-file {
    background-color: $white-color;
    box-shadow: 0px 1px 10px 0px #00000026;
    border-radius: 10px
  }

  .empty-table {
    background-color: $white-color;
    padding: 5rem;
    min-height: 86vh;
    
    @media (max-width: $breakpoint-sm) {
      padding: 1rem;
    }
  }

  .custom-data-table span {
    font-weight: bold;
  }

  tr:hover {
    background-color: $secondary-color;
    cursor: pointer;
  }
</style>