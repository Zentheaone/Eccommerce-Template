import React from 'react';

interface TableProps {
    children: React.ReactNode;
    className?: string;
}

interface TableHeaderProps {
    children: React.ReactNode;
}

interface TableBodyProps {
    children: React.ReactNode;
}

interface TableRowProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

interface TableHeadProps {
    children: React.ReactNode;
    className?: string;
}

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
}

export function Table({ children, className = '' }: TableProps) {
    return (
        <div className="overflow-x-auto">
            <table className={`w-full ${className}`}>
                {children}
            </table>
        </div>
    );
}

export function TableHeader({ children }: TableHeaderProps) {
    return (
        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            {children}
        </thead>
    );
}

export function TableBody({ children }: TableBodyProps) {
    return <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>;
}

export function TableRow({ children, className = '', onClick }: TableRowProps) {
    return (
        <tr
            className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${onClick ? 'cursor-pointer' : ''
                } ${className}`}
            onClick={onClick}
        >
            {children}
        </tr>
    );
}

export function TableHead({ children, className = '' }: TableHeadProps) {
    return (
        <th
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}
        >
            {children}
        </th>
    );
}

export function TableCell({ children, className = '' }: TableCellProps) {
    return (
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${className}`}>
            {children}
        </td>
    );
}
