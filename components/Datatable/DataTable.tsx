'use client'
import React, { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-dt';
import 'datatables.net';

interface DataTableProps {
    columns: {
        label: string;
        key: string;
        render?: (rowData: any) => JSX.Element | string;
    }[];
    data: any[];
    options?: any;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, options }) => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Initialize DataTable with options
            $('#myDataTable').DataTable(options || {});
        }

        // Cleanup DataTable instance on unmount
        return () => {
            $('#myDataTable').DataTable().destroy(true);
        };
    }, [options]);

    return (
        <table id="myDataTable" className="display">
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index}>{column.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((column, colIndex) => (
                            <td key={colIndex}>
                                {column.render ? column.render(row) : row[column.key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;
