'use client';

import { setIsModalOpen } from '@/store/adminSlice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CloseButton from './CloseButton';
import IconSpinner from '../Spinner';

interface LoadingModalProps {
    isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
    isOpen,
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setIsModalOpen(isOpen));
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div role="presentation" className="fixed inset-0 z-50" >
            <div className="animate-fade-in fixed inset-0 bg-[rgba(94,93,93,0.25)] backdrop-blur-sm" role="presentation"></div>
            <div className="animate-zoom-in fixed left-[50%] top-[50%] z-50  -translate-x-1/2 -translate-y-1/2 rounded-[100px] bg-white  text-center " role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
                <IconSpinner color="text-green-500" size={60} speed="animate-spin" />
            </div>
        </div>
    );
};

export default LoadingModal;
