export interface DataRecord {
  rowNumber: number
  value: string
  date: string
}

export interface DataState {
  isAddModalOpen: boolean
  openAddModal: () => void
  closeModal: () => void
}
