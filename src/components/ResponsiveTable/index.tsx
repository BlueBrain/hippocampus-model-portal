import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { ColumnType as AntColumnType, ColumnGroupType as AntColumnGroupType, TableProps } from 'antd/lib/table';
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';

import classes from './styles.module.scss';

interface ColumnType<Type extends object & { isHighlight?: boolean }> extends Omit<AntColumnType<Type>, 'dataIndex'> {
  dataIndex?: keyof Type;
}
interface GroupColumnType<Type extends object & { isHighlight?: boolean }> extends AntColumnGroupType<Type> { }

interface ResponsiveTableProps<Type extends object & { isHighlight?: boolean }> extends Omit<TableProps<Type>, 'columns'> {
  data: Type[];
  columns: (ColumnType<Type> | GroupColumnType<Type>)[]; // Updated type
}

const renderHighlightValue = (record) => (nestedValue, _value) =>
  highlightValue(nestedValue, record.isHighlight);

const highlightValue = (nestedValue, isHighlight) =>
  isHighlight ? <div className="text-bold">{nestedValue}</div> : nestedValue;

// Utility function to calculate the width of text
function calculateTextWidth(text: string, font: string = '16px Arial'): number {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = font;
    return context.measureText(text).width;
  }
  return 0;
}

function ResponsiveTable<Type extends object & { isHighlight?: boolean }>({
  columns,
  data,
  ...restProps
}: ResponsiveTableProps<Type>) {
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const font = '14px Arial'; // Set the font to match your table

  useEffect(() => {
    const newColumnWidths = columns.map((column) => {
      const maxTextWidth = data.reduce((max, record) => {
        const text = String(record[(column as ColumnType<Type>).dataIndex]);
        const textWidth = calculateTextWidth(text, font);
        return Math.max(max, textWidth);
      }, 0);
      return Math.min(maxTextWidth + 20, 200); // Add some padding and a max limit
    });

    setColumnWidths(newColumnWidths);
  }, [columns, data]);

  const expandableColumn = {
    title: null,
    dataIndex: null,
    render: (_value, record, index) => {
      const nestedTableData = columns
        .map((column) => {
          if ((column as ColumnType<Type>).dataIndex) {
            return {
              key: column.title,
              value: record[(column as ColumnType<Type>).dataIndex],
            };
          }

          const children = (column as GroupColumnType<Type>).children;
          if (children) {
            const childrenValue = children.map((child) => (
              <div key={child.key}>
                {child.title}: {record[(child as ColumnType<Type>).dataIndex]}
              </div>
            ));
            return {
              key: column.title,
              value: childrenValue,
            };
          }

          return null;
        })
        .filter((item) => item !== null); // Filter out null values

      const nestedColumns: ColumnType<{ key: any; value: any }>[] = [
        {
          dataIndex: 'key',
          title: 'Field',
          render: renderHighlightValue(record),
        },
        {
          dataIndex: 'value',
          title: 'Value',
          render: renderHighlightValue(record),
        },
      ];

      return (
        <Table
          className="responsiveTable no-left-margin nested-table xs-column"
          rowClassName={index % 2 ? classes.responsiveTablEven : classes.responsiveTablOdd}
          rowKey={(record: any, index) => `${record.key}__${index}`}
          showHeader={false}
          columns={nestedColumns}
          tableLayout="auto" // Use auto layout for nested table as well
          dataSource={nestedTableData as object[]} // Ensure dataSource does not contain null values
          pagination={false}
        />
      );
    },
    responsive: ['xs' as Breakpoint],
  };

  const tableColumns = columns
    .map((column, index) => ({
      ...column,
      title: column.title,
      dataIndex: (column as ColumnType<Type>).dataIndex,
      responsive: ['sm' as Breakpoint],
      render: (value: any, record: Type, index: number) =>
        highlightValue(column.render ? column.render(value, record, index) : value, record.isHighlight),
      children: (column as GroupColumnType<Type>).children?.map((child) => ({
        render: (value: any, record: Type) => highlightValue(value, record.isHighlight),
        ...child,
      })),
      width: column.key === 'yourSpecificKey' ? columnWidths[index] : undefined, // Set width dynamically for a specific column
    }))
    .concat(expandableColumn as any);

  const { className = '' } = restProps;

  return (
    <Table<Type>
      bordered
      size="small"
      scroll={{ x: true }}
      rowKey={(record: any) => record.key || `${record.dataIndex}__`}
      pagination={false}
      columns={tableColumns}
      dataSource={data}
      rowClassName={(record: Type, index: number) => (index % 2 ? classes.responsiveTablEven : classes.responsiveTablOdd)}
      {...restProps}
      className={`responsiveTable no-left-margin nested-table xs-column text-nowrap ${className}`}
      tableLayout="auto" // Ensure layout is auto for dynamic column sizing
    />
  );
}

export default ResponsiveTable;