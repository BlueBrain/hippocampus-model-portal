import React, { useState } from 'react';
import Link from 'next/link';
import { ColumnsType } from 'antd/lib/table';

import NexusImage from '../NexusImage';
import NexusFileDownloadButton from '../NexusFileDownloadButton';
import { composeNexusUrl } from '../../utils';
import { hippocampus } from '../../config';
import { NexusMorphology } from '../../types';

import styles from './styles.module.scss';


const getMorphologyDistribution = (morphologyResource: any) => (
  morphologyResource.distribution.find((d: any) => d.name.match(/\.asc$/i))
);

export function entryToArray(entry) {
  if (Array.isArray(entry)) return entry;
  return [entry];
}

export const useExpMorphologyColumns = (layer, mtype, currentMorphology) => {
  const [agentMap, setAgentMap] = useState<Record<string, any>>(null);

  const morphHref = (morphologyName: string) => {
    const searchParams = new URLSearchParams({
      layer,
      mtype,
      instance: morphologyName,
    });
    return `/experimental-data/neuronal-morphology/?${searchParams.toString()}#data`;
  };

  const columns: ColumnsType<NexusMorphology> = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: function NameLink(value) {
        return (
          <Link
            href={morphHref(value)}
            prefetch={false}
            className={value === currentMorphology ? 'text-bold' : undefined}>
            {value}
          </Link>
        );
      },
      ellipsis: true,
      responsive: ['sm'],
    },
    {
      title: 'Preview',
      dataIndex: 'name',
      width: 220,
      render: function Preview(morphName, morphology) {
        const imgUrl = composeNexusUrl({ id: morphology.image['@id'] });

        return (
          <div className={styles.morphImageContainer}>
            <NexusImage
              src={imgUrl}
              key={imgUrl}
              width="640"
              height="480"
              sizes="200px"
              layout="responsive"
              alt="Slice image"
            />
          </div>
        );
      },
      responsive: ['sm'],
    },
    {
      title: 'M-Type',
      dataIndex: 'annotation',
      align: 'center',
      render: function Link(annotation, morphology: any) {
        return (
          <span className={morphology.name === currentMorphology ? 'text-bold' : undefined}>
            {annotation?.hasBody?.label}
          </span>
        );
      },
      responsive: ['sm'],
    },
    {
      title: 'Contribution',
      dataIndex: 'contribution',
      render: function Link(value) {
        return (
          agentMap && entryToArray(value)
            .map(contribution => agentMap[contribution.agent['@id']])
            .filter(Boolean)
            .sort((a1, a2) => (a1.type > a2.type ? 1 : -1))
            .map(agent => <span key={agent.label}>{agent.label} <br /></span>)
        );
      },
      responsive: ['md'],
    },
    {
      title: 'Download',
      dataIndex: 'name',
      width: 100,
      align: 'center',
      render: function Link(_value, record) {
        return (
          <NexusFileDownloadButton
            filename={getMorphologyDistribution(record).name}
            url={getMorphologyDistribution(record).contentUrl}
            org={hippocampus.org}
            project={hippocampus.project}
            animate={false}
          />
        );
      },
      responsive: ['sm'],
    },
    {
      title: 'Preview',
      dataIndex: 'name',
      render: function Preview(morphName, morphology) {
        const imgUrl = composeNexusUrl({ id: morphology.image['@id'] });

        return (
          <>
            <div className={styles.morphImageContainer}>
              <div className={styles.centeredText}>
                {morphName}
              </div>
              <NexusImage
                src={imgUrl}
                key={imgUrl}
                width="640"
                height="480"
                sizes="640px"
                layout="responsive"
                alt="Slice image"
              />
              <div className={styles.centeredText}>
                <Link href={morphHref(morphName)} prefetch={false}>More details</Link>
              </div>
            </div>
          </>
        );
      },
      responsive: ['xs'],
    },
  ];

  return ({
    columns,
    setAgentMap,
  });
};
