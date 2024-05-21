<script setup>
  import { ref, defineProps, defineEmits } from 'vue'

  const props = defineProps({
    dialogIsActive: {
      type: Boolean,
    },
  })

  const emit = defineEmits(['update:dialogIsActive'])

  const toggleDialog = () => {
    emit('update:dialogIsActive', !props.dialogIsActive)
  }

  const confirmExportAndCloseDialog = () => {
    emit('exportViewTableCSV')
    toggleDialog()
  }
</script>
<template>

  <v-dialog v-model="props.dialogIsActive" max-width="500">
    <v-card>
      <v-card-title>
        Deseja exportar e baixar a tabela?
      </v-card-title>
      <v-card-actions>
        <v-btn 
          @click="toggleDialog"
          variant="outlined" 
          density="comfortable" 
          rounded="xl" 
          class="text-none"
        >
          Cancelar
        </v-btn>
        <v-btn
          @click="confirmExportAndCloseDialog"
          class="text-none text-subtitle-1"
          color="black"
          variant="flat"
          density="comfortable" 
          rounded="xl" 
        >
          Sim
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>