import { create } from "zustand"
import type { DataRecord } from "./dataTypes"

interface DataModalState {
  isAddModalOpen: boolean
  isEditModalOpen: boolean
  isDeleteModalOpen: boolean
  selectedRecord: DataRecord | null
}

interface DataModalActions {
  openAddModal: () => void
  openEditModal: (record: DataRecord) => void
  openDeleteModal: (record: DataRecord) => void
  closeModals: () => void
}

type DataStore = DataModalState & DataModalActions

export const useDataStore = create<DataStore>((set) => ({
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  selectedRecord: null,

  openAddModal: () =>
    set({
      isAddModalOpen: true,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      selectedRecord: null,
    }),

  openEditModal: (record: DataRecord) =>
    set({
      isAddModalOpen: false,
      isEditModalOpen: true,
      isDeleteModalOpen: false,
      selectedRecord: record,
    }),

  openDeleteModal: (record: DataRecord) =>
    set({
      isAddModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: true,
      selectedRecord: record,
    }),

  closeModals: () =>
    set({
      isAddModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      selectedRecord: null,
    }),
}))
