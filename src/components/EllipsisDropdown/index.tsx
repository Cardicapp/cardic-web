import React, { useState } from 'react';
import { EllipsisIcon } from '../Icons';

interface EllipsisDropdownProps {
    items: Array<{ label: string; href?: string, onClick?: () => void }>;
    title?: string;
}

const EllipsisDropdown = ({ items, title }: EllipsisDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md font-medium text-gray-700 "
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    {/* Truncated Title with Ellipsis */}
                    {
                        title && (
                            <span className="truncate max-w-xs">{title}</span>
                        )
                    }


                    {/* Ellipsis Icon (e.g., three dots) - replace with an actual icon */}
                    <span className="ml-2">
                        {/* &#8230; */}
                        <EllipsisIcon />
                    </span>
                </button>
            </div>

            {/* Dropdown Menu (conditional rendering) */}
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {
                            items.map((item) => (
                                item.onClick ?

                                    <div
                                        key={item.label}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            item.onClick && item.onClick();
                                        }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 truncate" // Add truncate here as well
                                        role="menuitem"
                                    >
                                        {item.label}
                                    </div>
                                    :

                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 truncate" // Add truncate here as well
                                        role="menuitem"
                                    >
                                        {item.label}
                                    </a>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default EllipsisDropdown;