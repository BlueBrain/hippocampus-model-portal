import React from 'react';
import Link from 'next/link';

import ESData from '../ESData';
import { entriesByIdsQuery } from '../../queries/es';
import { entryToArray, getCompareByFn } from '../../utils';
import { NexusMorphology, NexusTrace } from '../../types';


type MorphologyRelatedTracesProps = {
  morphology: NexusMorphology;
};

const compareByName = getCompareByFn('name');

const TraceLink: React.FC<{trace: NexusTrace}> = ({ trace }) => {
  const etype = trace.annotation.hasBody.label;
  const instance = trace.name;

  const searchParams = new URLSearchParams({
    etype,
    etype_instance: instance,
  });
  const href = `/experimental-data/neuronal-electrophysiology/?${searchParams.toString()}#data`;

  return <Link href={href} prefetch={false} legacyBehavior>{trace.name}</Link>;
};

const MorphologyRelatedTraces: React.FC<MorphologyRelatedTracesProps> = ({ morphology }) => {
  if (!morphology.isRelatedTo) {
    return (
      <span>No electrophysiological recordings found for this cell.</span>
    );
  }

  const traceIds = entryToArray(morphology.isRelatedTo).map(trace => trace['@id']);

  return (
    <ESData query={entriesByIdsQuery(traceIds)}>
      {esDocuments => (
        <>
          <span>Electrophysiology recordings from the same cell: </span>
          {esDocuments
            ? esDocuments
                .map(esDocument => esDocument._source as NexusTrace)
                .sort(compareByName)
                .map((trace, idx) => (
                  <>
                    {idx > 0 && ', '}<TraceLink key={trace.name} trace={trace} />
                  </>
                ))
            : '...'
          }.
        </>
      )}
    </ESData>
  );
};


export default MorphologyRelatedTraces;
