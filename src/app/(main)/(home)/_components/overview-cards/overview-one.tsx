import React from 'react';

interface OverviewCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    containerClassName?: string;
    onClick?: () => void;
}

export const OverviewOne: React.FC<OverviewCardProps> = ({
    title,
    value,
    icon,
    containerClassName,
    onClick,
}) => {
    return (
        <div 
        onClick={onClick}
        className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${containerClassName}`} >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-dark-6">{title}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
                </div>
                {
                    icon && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            {icon}
                        </div>
                    )
                }

            </div>
        </div>
    );
};