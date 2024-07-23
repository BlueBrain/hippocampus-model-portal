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

const MorphologyLink: React.FC<{ morphology: NexusMorphology }> = ({ morphology }) => {
  const annotation = morphology.annotation;
  const hasBody = annotation ? annotation.hasBody : null;
  const label = hasBody ? hasBody.label : null;

  if (!label) return null;

  const match = annotationMtypeRe.exec(label);
  if (!match) return null;

  const [, layer, mtype] = match;
  const instance = morphology.name;

  const searchParams = new URLSearchParams({
    layer,
    mtype,
    instance,
  });
  const href = `/experimental-data/neuronal-morphology/?${searchParams.toString()}#data`;

  return (
    <Link href={href} prefetch={false} legacyBehavior>
      {morphology.name}
    </Link>
  );
};

const TraceRelatedMorphologies: React.FC<TraceRelatedMorphologiesProps> = ({ trace }) => {
  if (!trace.isRelatedTo) {
    return <span>No morphology reconstruction found for this cell.</span>;
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
                <React.Fragment key={morphology.name}>
                  {idx > 0 && ', '}
                  <MorphologyLink morphology={morphology} />
                </React.Fragment>
              ))
            : '...'}
          .
        </>
      )}
    </ESData>
  );
};

export default TraceRelatedMorphologies;