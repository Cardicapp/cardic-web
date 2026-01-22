'use client';
import { setIsModalOpen } from '@/store/adminSlice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
interface InfoModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Proceed',
    onConfirm,
}) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setIsModalOpen(isOpen));
    }, [isOpen]);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
                <h2 className="mb-4 text-center text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h2>
                <p className="mb-6 text-center text-gray-600 dark:text-gray-300">{message}</p>
                <div className="flex justify-center">

                    <button
                        onClick={onConfirm}
                        className={`rounded-md px-4 py-2 text-white ${'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};