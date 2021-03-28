import React from 'react';
import get from 'lodash/get';
import { Table, Collapse, Popover } from 'antd';

import NumberFormat from '../NumberFormat';
import ChannelParamPlot from '../ChannelParamPlot';
import styles from './index.module.scss';


const { Panel } = Collapse;

export type EtypeFactsheetProps = {
  data?: any;
};

const featureUnit = {
  voltage_deflection: 'mV',
  voltage_base: 'mV',
  steady_state_voltage: 'mV',
  spikecount: '',
  time_to_last_spike: 'ms',
  inv_time_to_first_spike: 'Hz',
  inv_first_isi: 'Hz',
  inv_second_isi: 'Hz',
  inv_third_isi: 'Hz',
  inv_fourth_isi: 'Hz',
  inv_fifth_isi: 'Hz',
  inv_last_isi: 'Hz',
  mean_frequency: 'ms',
  ahp_depth: 'mV',
};


const EtypeFactsheet: React.FC<EtypeFactsheetProps> = ({
  data,
}) => {
  // Experimental features table data preparation
  const expFeatures = data.features;

  const tableData = {};
  const protocols = [];
  Object.entries(expFeatures).forEach(([protocol, protocolVal]) => {
    protocols.push(protocol);
    Object.entries(protocolVal).forEach(([measurement, measurementVal]) => {
      Object.entries(measurementVal).sort((f1, f2) => (f1[0] > f2[0] ? 1 : -1)).forEach(([featureName, featureValue]) => {
        if (!tableData[protocol]) {
          tableData[protocol] = [];
        }

        tableData[protocol].push({
          key: featureName,
          protocol,
          measurement,
          feature: featureName,
          unit: featureUnit[featureName.toLowerCase()],
          mean: featureValue[0],
          std: featureValue[1],
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
    // {
    //   title: 'Model fitness',
    //   dataIndex: 'modelFitness',
    //   render: modelFitness => <NumberFormat value={modelFitness} />
    // },
  ];

  // Channel mechanisms data preparation
  const channelMechanisms = data.distributions
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
              {channelMechanisms[section].map(channelParams => (
                <Popover
                  key={channelParams[0].channel}
                  title={channelParams[0].channel}
                  content={(
                    <>
                      {channelParams.map(channelParam => (
                        <ChannelParamPlot
                          key={channelParam.parameter}
                          channelParam={channelParam}
                        />
                      ))}
                    </>
                  )}
                >
                  <span
                    className={styles.channelLabel}
                  >
                    {channelParams[0].channel}
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
