import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNexusContext } from '@bbp/react-nexus';

// import { sscx } from '../config';
import FullPage from '../layouts/FullPage';
import Title from '../components/Title';
// import { State } from '../store';
// import { DownloadItem, clearItems } from '../store/download';
// import Button from '../components/Button';

const Download: React.FC = () => {
  // const dispatch = useDispatch();
  // const downloadItems = useSelector<State, DownloadItem[]>(
  //   state => state.download.items,
  // );
  // const nexus = useNexusContext();

  // const handleDownload = () => {
  //   nexus.Archive.create(sscx.org, sscx.project, { resources: downloadItems })
  //     .then(data => {
  //       // CORS aren't enabled on prod, so I don't know how to implement this.
  //       alert('not implemented yet...');
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       alert('error (probably cors related)');
  //     });
  // };

  return (
    <FullPage>
      <Title title="Download page" />
      {/* <Button onClick={handleDownload} primary>
        Download data
      </Button> */}
      {/* <Button onClick={() => dispatch(clearItems())}>Clear data</Button> */}
      {/* <ul>
        {downloadItems.map(d => (
          <li key={d.resourceId}>{d.resourceId}</li>
        ))}
      </ul> */}
    </FullPage>
  );
};

export default Download;
