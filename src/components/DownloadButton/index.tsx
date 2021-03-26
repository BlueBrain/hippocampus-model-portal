/**
 * A simple download button that dispatched `download/add_item` redux action
 * for every single data element received as props.
 */

import React from 'react';
import { IoMdDownload } from 'react-icons/io';
// import { useDispatch } from 'react-redux';

// import { DownloadItem, addItem } from '../../store/download';

// import './style.less';

export type DownloadButtonProps = {
  // data: DownloadItem[];
  data: any;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ data }) => {
  // const dispatch = useDispatch();

  const handleClick = () => {
    // data.forEach(d => dispatch(addItem(d)));
  };

  if (data.length <= 0) {
    return null;
  }

  return (
    <button className="icon-button__download" onClick={handleClick}>
      <IoMdDownload />
    </button>
  );
};
export default DownloadButton;
