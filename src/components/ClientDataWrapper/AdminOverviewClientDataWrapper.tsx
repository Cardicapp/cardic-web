'use client';

import { OverviewData } from '@/app/(main)/(home)/(admin)/admin/dashboard/page';
import { setOverview } from '@/store/adminSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

interface AdminOverviewClientDataWrapperProps {
  data: OverviewData;
}
export default function AdminOverviewClientDataWrapper({ data }: AdminOverviewClientDataWrapperProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch the action to populate the Redux store on the client side
    if (data) {
      dispatch(setOverview(data));
    }
  }, [data, dispatch]);

  // Render child components that can access the Redux store
  return <></>;
}