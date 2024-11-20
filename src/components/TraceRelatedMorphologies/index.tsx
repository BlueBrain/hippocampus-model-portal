import React from 'react';
import Link from 'next/link';

import { entryToArray, getCompareByFn } from '../../utils';
import { NexusMorphology, NexusTrace } from '../../types';
import { morphsByIdsDataPath } from '@/queries/http';
import HttpData from '../HttpData';

type TraceRelatedMorphologiesProps = {
  trace: NexusTrace;
};

const compareByName = getCompareByFn('name');
const annotationMtypeRe = /(\w+)_(.+)/;

const MorphologyLink: React.FC<{ morphology: NexusMorphology }> = ({ morphology }) => {
  const mtypeAnnotation = entryToArray(morphology.annotation)
    .find(annotation => entryToArray(annotation['@type']).includes('MTypeAnnotation'));

  const hasBody = mtypeAnnotation ? mtypeAnnotation.hasBody : null;
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
  if (!trace.isRelatedTo && entryToArray(trace.isRelatedTo).length === 0) {
    return <span>No morphology reconstruction found for this cell.</span>;
  }

  const morphologyIds = entryToArray(trace.isRelatedTo).map(trace => trace['@id'] as string).sort();

  return (
    <HttpData path={morphsByIdsDataPath(morphologyIds)}>
      {morphResources => (
        <>
          <span>Cell&apos;s reconstructed morphology: </span>
          {morphResources
            ? morphResources
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
    </HttpData>
  );
};

export default TraceRelatedMorphologies;
