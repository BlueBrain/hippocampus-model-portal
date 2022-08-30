import React from 'react';


type TextWithRefsProps = {
  text: string;
  doiIndex: Record<string, string>;
};

function createLink(doi, label) {
  return `<a href="https://doi.org/${doi}" target="_blank" rel="noopener noreferrer">${label}</a>`
}

const TextWithRefs: React.FC<TextWithRefsProps> = ({ text, doiIndex }) => {
  const refs = Object.keys(doiIndex);

  const html = refs.reduce((html, ref) => {
    const doi = doiIndex[ref];

    return html.replaceAll(ref, createLink(doi, ref));
  }, text);

  return (
    <span dangerouslySetInnerHTML={{ __html: html }}  />
  );
};


export default TextWithRefs;
