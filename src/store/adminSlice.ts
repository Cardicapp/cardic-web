import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from './store'
import { OverviewData } from '@/app/(main)/(home)/(admin)/admin/dashboard/page';

export interface AdminState {
  overview: OverviewData;
  isModalOpen: boolean;
}

const initialState: AdminState = {
  overview: {
    activeTradesCount: 0,
    newTradesCount: 0,
    rejectedTradesCount: 0,
    completedTradesCount: 0,
    completedTradesAmount: 0,
    totalCryptoTransactions: 0,
    usersCount: 0,
    adminsCount: 0,
    completedCardTradesCount: 0,
    totalWalletWithdrawals: 0,
    totalCryptoSwaps: 0,
    totalNewAccountsCount: 0,
    totalInactiveAccountsCount: 0,
  },
  isModalOpen: false,
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setOverview(state, action) {
      state.overview = action.payload
    },
    setIsModalOpen(state, action){
      state.isModalOpen = action.payload
    }
  },
})

export const { setOverview, setIsModalOpen } = adminSlice.actions

export const selectAdminState = (state: AppState) => state.admin

export default adminSlice.reducer
