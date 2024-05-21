import { defineStore } from 'pinia'

export const useTableFilesStore = defineStore('tableFileStore', {
  state: () => ({
    _tableData: [],
    _tableView: [],
    _switchItem: []
  }),

  getters: {
    tableData: state => state._tableData,
    tableView: state => state._tableView,
    switchItem: state => state._switchItem
  },

  actions: {
    addItemToTableData(item) {
      this._tableData.push(item);
    },

    mountTableView(fileId){
      const filteredData = this.getFilteredTable(fileId);

      if (filteredData) {
        this._tableView = filteredData.map(item => ({ ...item }));
      }
    },

    getFilteredTable(fileId){
      const filteredData = this._tableData
        .filter(_tableData => _tableData.id === fileId)
        .map(_tableData => _tableData.data);
        
      return filteredData[0]
    },

    getTableColuns(fileId){
      const filteredData = { ...this.getFilteredTable(fileId)}

      return Object.keys(filteredData[0]);
    },

    handleSwitchColumnsChange(fileId, columnName){
      const hasColumn = this._tableView.some(item => item[columnName])

      if(hasColumn){
        this._tableView.map(item => {
          delete item[columnName];
        });
      } else {
        const filteredData = this.getFilteredTable(fileId)

        Object.entries(filteredData).forEach(([key, value]) => {
          if(this._tableView.length < 1){
            filteredData.forEach(data => {
              const newObj = {};
              newObj[columnName] = data[columnName];
              this._tableView.push(newObj);
            });
          } else {
            this._tableView[key][columnName] = value[columnName]
          }
        })
      }

      this.updateSwitchModelValue()
    },

    showAllColumns(fileId){
      const filteredData = this.getFilteredTable(fileId)

      if(this._tableView.length < 1)
        return this.mountTableView(fileId)

      this._tableView.forEach((obj, index) => {
        Object.keys(filteredData[index]).forEach(key => {
          if (!obj.hasOwnProperty(key)) {
            obj[key] = filteredData[index][key];
          }
        });
      });

      this.updateSwitchModelValue()
    },

    hideAllColumns(){
      this._tableView = []
      this.updateSwitchModelValue()
    },

    mountSwitchModelValue(switchItems){
      switchItems.forEach(nome => {
        this._switchItem[nome] = true;
      });
    }, 

    updateSwitchModelValue(){
      if(this._tableView.length < 1){
        for (const key in this._switchItem) {
          this._switchItem[key] = false;
        }
        return 
      }

      for (const key in this._switchItem) {
        if (!this._tableView[0].hasOwnProperty(key))
          this._switchItem[key] = false;
        else
          this._switchItem[key] = true;
      }
    } 
  },
})
