<script setup>
  import { ref } from 'vue'
  import { useTableFilesStore } from '@/stores/tableFiles.js'
  import { useRouter } from 'vue-router'
  import { v4 as uuidv4 } from 'uuid'

  const props = defineProps({
    dialogIsActive: {
      type: Boolean,
    },
  })

  const router = useRouter()
  const TableFilesStore = useTableFilesStore()
  const fileInput = ref(null)
  const importedFile = ref()

  const emit = defineEmits(['update:dialogIsActive'])

  const toggleDialog = () => {
    emit('update:dialogIsActive', !props.dialogIsActive)
  }

  const triggerFileInput = () => {
    fileInput.value.click()
  }

  const handleFileInput = (event) => {
    const files = event.target.files

    if (files.length > 0) {
      importedFile.value = files[0]
      onFileImport(files[0])
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.target.classList.add('drag-over');
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.target.classList.remove('drag-over');
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      importedFile.value = files[0]
      onFileImport(files[0])
    }
  }

  const onFileImport = (file) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        const data = parseCSV(text);
        const firstLine = text.split('\n')[0];
        const numberOfColumns = firstLine.split(',').length;
        const fileId = uuidv4();

        const parsedFilesTable = {
          id: fileId,
          name: file.name,
          numberColumns: `${numberOfColumns} colunas`,
          numberLines: `${text.split('\n').length - 1} linhas`,
          exported: `Sim - ${text.split('\n').length - 1} linhas e ${numberOfColumns} colunas`,
          createdIn: new Date().toLocaleDateString(),
          actions: '',
          data
        };

        TableFilesStore.addItemToTableData(parsedFilesTable);
        router.push({ name: 'viewFile', params: { id: fileId } });
        toggleDialog();
      };

      reader.readAsText(file);
    } catch (e) {
      console.error('Error importing file:', e);
    }
  };

  const parseCSV = (text) => {
    try {
      const rows = text.trim().split('\n');
      if (rows.length === 0) throw new Error('CSV is empty');

      const headers = rows[0].split(',').map(header => header.trim());
      if (headers.length === 0) throw new Error('No headers found in CSV');

      return rows.slice(1).map((row, rowIndex) => {
        const values = row.split(',').map(value => value.trim());
        if (values.length !== headers.length) {
          console.warn(`Row ${rowIndex + 2} has a different number of columns than the headers`);
        }
        return headers.reduce((obj, header, index) => {
          obj[header] = values[index] || '';
          return obj;
        }, {});
      });
    } catch (e) {
      console.error('Error parsing CSV:', e);
      throw e;
    }
  };
</script>

<template>
  <v-dialog v-model="props.dialogIsActive" max-width="500">
    <v-card>
      <v-card-title>
        Escolha um arquivo a ser importado
      </v-card-title>
      <v-card-text>
        <div 
          class="drop-box d-flex justify-center align-center flex-column p-3"
          @dragover.prevent="handleDragOver"
          @dragleave="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <div class="mb-3 text-center">Arraste um arquivo CSV, XLSX até aqui</div>
          <div>Ou se preferir</div>
          <v-btn 
            variant="outlined" 
            density="comfortable" 
            rounded="xl" 
            class="text-none m-3 btn-upload-file"
            color="primary"
            @click="triggerFileInput"
          >
            selecione um arquivo do seu dispositivo
          </v-btn>
          <input 
            ref="fileInput" 
            type="file" 
            style="display: none;" 
            @change="handleFileInput"
          />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn 
          @click="toggleDialog"
          variant="outlined" 
          density="compact" 
          rounded="xl" 
          class="text-none mr-3"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss">
.drop-box {
  border: 2px dashed $text-color;
  border-radius: 10px;
  transition: .8s;

  &.drag-over {
    background-color: $secondary-color;
  }
}

.btn-upload-file {
  @media (max-width: $breakpoint-sm) {
    height: 66px !important;
  }
}

.v-btn__content {
  @media (max-width: $breakpoint-sm) {
    text-wrap: wrap !important;
  }
}
</style>
