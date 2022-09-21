import React from 'react';
import { Table } from 'antd';
import { ColumnType as AntColumnType, ColumnGroupType as AntColumnGroupType, TableProps } from 'antd/lib/table';
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';

import classes from './styles.module.scss';

interface ColumnType<Type extends object & {isHighlight?: boolean}> extends Omit<AntColumnType<Type>, 'dataIndex'> {
    dataIndex?: keyof Type;
}
interface GroupColumnType<Type extends object & {isHighlight?: boolean}> extends AntColumnGroupType<Type>{
}

interface ResponsiveTableProps<Type extends object & {isHighlight?: boolean}> extends Omit<TableProps<Type>, 'columns'> {
    data: Type[];
    columns: (ColumnType<Type> | GroupColumnType<Type>)[];
}


const renderHighlightValue = (record) => (nestedValue, _value) => (
  highlightValue(nestedValue, record.isHighlight)
);

const highlightValue = (nestedValue, isHighlight) => (isHighlight ? (
  <div className="text-bold">
    {nestedValue}
  </div>
)
  : nestedValue);

function ResponsiveTable<Type extends object & {isHighlight?: boolean}>({ columns, data, ...restProps }: ResponsiveTableProps<Type>) {
  const expandableColumn = {
    title: null,
    dataIndex: null,
    render: (_value, record, index) => {
      const nestedTableData = columns.map((column) => {
        if ((column as ColumnType<Type>).dataIndex) {
          return ({
            key: column.title,
            value: record[(column as ColumnType<Type>).dataIndex],
          });
        }

        const children = (column as GroupColumnType<Type>).children;
        if (children) {
          const childrenValue = children.map((child) => (
            <div key={child.key}>
              {child.title}: {record[(child as ColumnType<Type>).dataIndex]}
            </div>
          ));
          return ({
            key: column.title,
            value: childrenValue,
          });
        }

        return null;
      });

      const nestedColumns: ColumnType<{key: any; value: any}>[] = [
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
          rowKey={(record: any, index) => `${record.dataIndex}__${index}`}
          showHeader={false}
          columns={nestedColumns}
          tableLayout="fixed"
          dataSource={nestedTableData}
          pagination={false}
        />
      );
    },
    responsive: ['xs' as Breakpoint],
  };

  const tableColumns = columns.map((column) => (
    {
      ...column,
      title: column.title,
      dataIndex: (column as ColumnType<Type>).dataIndex,
      responsive: ['sm' as Breakpoint],
      render: (value: any, record: Type, index: number) => highlightValue(column.render ? column.render(value, record, index) : value, record.isHighlight),
      children: (column as GroupColumnType<Type>).children?.map(child => ({ render: (value: any, record: Type) => highlightValue(value, record.isHighlight), ...child })),
    }
  ))
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
      rowClassName={(record: Type, index: number) => {
        // TODO: find better solution to support striped sub-rows on mobile
        // if (record.isHighlight) {
        //   return classes.highlightBackground;
        // }
        return (index % 2 ? classes.responsiveTablEven : classes.responsiveTablOdd);
      }}
      {...restProps}
      className={`responsiveTable no-left-margin nested-table xs-column text-nowrap ${className}`}
    />
  );
}

export default ResponsiveTable;
