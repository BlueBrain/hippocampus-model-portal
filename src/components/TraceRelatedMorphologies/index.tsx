import React from 'react';
import Link from 'next/link';

import ESData from '../ESData';
import { entriesByIdsQuery } from '../../queries/es';
import { entryToArray, getCompareByFn } from '../../utils';
import { NexusMorphology, NexusTrace } from '../../types';


type TraceRelatedMorphologiesProps = {
  trace: NexusTrace;
};

const compareByName = getCompareByFn('name');
const annotationMtypeRe = /(\w+)_(.+)/;

const MorphologyLink: React.FC<{morphology: NexusMorphology}> = ({ morphology }) => {
  const [, layer, mtype] = annotationMtypeRe.exec(morphology.annotation.hasBody.label);
  const instance = morphology.name;

  const searchParams = new URLSearchParams({
    layer,
    mtype,
    instance,
  });
  const href = `/experimental-data/neuronal-morphology/?${searchParams.toString()}#data`;

  return (
    <Link href={href} prefetch={false}>{morphology.name}</Link>
  );
};

const TraceRelatedMorphologies: React.FC<TraceRelatedMorphologiesProps> = ({ trace }) => {
  if (!trace.isRelatedTo) {
    return (
      <span>No morphology reconstruction found for this cell.</span>
    );
  }

  const morphologyIds = entryToArray(trace.isRelatedTo).map(trace => trace['@id']);

  return (
    <ESData query={entriesByIdsQuery(morphologyIds)}>
      {esDocuments => (
        <>
          <span>Cell&apos;s reconstructed morphology: </span>
          {esDocuments
            ? esDocuments
                .map(esDocument => esDocument._source as NexusMorphology)
                .sort(compareByName)
                .map((morphology, idx) => (
                  <>
                    {idx > 0 && ', '}<MorphologyLink key={trace.name} morphology={morphology} />
                  </>
                ))
            : '...'
          }.
        </>
      )}
    </ESData>
  );
};


export default TraceRelatedMorphologies;
