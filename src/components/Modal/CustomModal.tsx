'use client';

import { setIsModalOpen } from '@/store/adminSlice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CloseButton from './CloseButton';

interface CustomModalProps {
    isOpen: boolean;
    children?: React.ReactNode;
    onClose: () => void;
    showBack?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
    isOpen,
    children,
    onClose,
    showBack = true,
}) => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setIsModalOpen(isOpen));
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div role="presentation" className="fixed inset-0 z-50" >
            <div className="animate-fade-in fixed inset-0 bg-[rgba(94,93,93,0.25)] backdrop-blur-sm" role="presentation"></div>
            <div className="animate-zoom-in fixed left-[50%] top-[50%] z-50 h-full -translate-x-1/2 -translate-y-1/2 max-sm:max-w-[90vw] max-h-fit w-full max-w-[550px] rounded-[15px] bg-white px-8 py-12 text-center shadow-3 dark:bg-gray-dark dark:shadow-card md:px-15 md:py-15" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
                {
                    showBack ? <CloseButton onClick={onClose} /> : undefined
                }
                {children}
            </div>
        </div>
    );
};

export default CustomModal;

// <div role="presentation" className="fixed inset-0 z-50" style="
// "><div className="animate-fade-in fixed inset-0 bg-[rgba(94,93,93,0.25)] backdrop-blur-sm" role="presentation" style="
//     /* display: none; */
// "></div><div className="animate-zoom-in fixed left-[50%] top-[50%] z-50 h-full -translate-x-1/2 -translate-y-1/2 max-sm:max-w-[90vw] max-h-fit w-full max-w-[550px] rounded-[15px] bg-white px-8 py-12 text-center shadow-3 dark:bg-gray-dark dark:shadow-card md:px-15 md:py-15" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title"><h3 className="pb-4 text-xl font-bold text-dark dark:text-white sm:text-2xl">Your Message Sent Successfully</h3><span className="mx-auto mb-5.5 inline-block h-[3px] w-22.5 rounded-[2px] bg-primary"></span><p className="mb-10 font-medium">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since</p><div className="-mx-2.5 flex flex-wrap gap-y-4"><div className="w-full px-2.5 2xsm:w-1/2"><button className="block w-full rounded-[7px] border border-stroke bg-gray-2 p-[11px] text-center font-medium text-dark transition hover:border-gray-3 hover:bg-gray-3 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:border-dark-4 dark:hover:bg-dark-4">Cancel</button></div><div className="w-full px-3 2xsm:w-1/2"><button className="block w-full rounded-[7px] border border-primary bg-primary p-[11px] text-center font-medium text-white transition hover:bg-opacity-90">View Details</button></div></div></div></div>

