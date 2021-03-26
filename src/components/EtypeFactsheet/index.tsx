import React from 'react';
import get from 'lodash/get';
import { Table, Collapse, Popover } from 'antd';

import NumberFormat from '../NumberFormat';
import IonChannelPlot, { Equation } from '../IonChannelPlot';
import styles from './index.module.scss';


const { Panel } = Collapse;

export type EtypeFactsheetProps = {
  data?: any;
};


const EtypeFactsheet: React.FC<EtypeFactsheetProps> = ({
  data,
}) => {
  // Experimental features and model fitness table data preparation
  const expFeatures = get(data, '[0].values[0]');

  const tableData = {};
  const protocols = [];
  Object.entries(expFeatures).forEach(([protocol, protocolVal]) => {
    protocols.push(protocol);
    Object.entries(protocolVal).forEach(([measurement, measurementVal]) => {
      measurementVal.features.sort((f1, f2) => (f1.name > f2.name) ? 1 : -1).forEach(feature => {
        if (!tableData[protocol]) {
          tableData[protocol] = [];
        }

        tableData[protocol].push({
          key: feature.name,
          protocol,
          measurement,
          feature: feature.name,
          unit: feature.unit,
          mean: feature.values[0].mean,
          std: feature.values[0].std,
          modelFitness: feature['model fitness'],
        })
      });
    });
  });

  protocols.sort();

  const tableColumns = [
    {
      title: 'Feature',
      dataIndex: 'feature',
      render: feature => feature.replace(/\_/g, ' '),
    },
    {
      title: 'Mean',
      dataIndex: 'mean',
      render: (mean, row) => <span><NumberFormat value={mean} /> {row.unit}</span>
    },
    {
      title: 'Std',
      dataIndex: 'std',
      render: (std, row) => <span><NumberFormat value={std} /> {row.unit}</span>
    },
    {
      title: 'Model fitness',
      dataIndex: 'modelFitness',
      render: modelFitness => <NumberFormat value={modelFitness} />
    },
  ];

  // Channel mechanisms data preparation
  const channelMechanisms = get(data, '[1].values[0].location_map');
  const sections = Object.keys(channelMechanisms);

  return (
    <div className={styles.container}>
      <h3>Factsheet</h3>
      <Collapse
        className="mb-3"
        bordered={false}
        defaultActiveKey={protocols[0]}
      >
        {protocols.map(protocol => (
          <Panel key={protocol} header={<strong>{protocol}</strong>}>
            <Table
              dataSource={tableData[protocol]}
              columns={tableColumns}
              pagination={false}
              size="small"
              tableLayout="fixed"
              bordered
            />
          </Panel>
        ))}
      </Collapse>

      <h3>Channel Mechanisms</h3>
      <div className={styles.mechanisms}>
        <div className="row mb-1">
          <div className="col-xs-6 col-md-4"><strong>Sections</strong></div>
          <div className="col-xs-6 col-md-8"><strong>Mechanisms</strong></div>
        </div>
        {sections.map(section => (
          <div className={`row ${styles.mechanismsRow}`} key={section}>
            <div className="col-xs-6 col-md-4">{section}</div>
            <div className="col-xs-6 col-md-8">
              {Object.entries(channelMechanisms[section].channels).map(([channelName, channelData]: [string, any]) => (
                <Popover
                  key={channelName}
                  title={channelName}
                  content={(
                    <>
                      {Object.entries(channelData.equations).map(([equationLabel, equation]: [string, Equation]) => (
                        <IonChannelPlot
                          key={equationLabel}
                          name={equationLabel}
                          equation={equation}
                        />
                      ))}
                    </>
                  )}
                >
                  <span
                    className={styles.channelLabel}
                  >
                    {channelName}
                  </span>
                </Popover>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default EtypeFactsheet;
