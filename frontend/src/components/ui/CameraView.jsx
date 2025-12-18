import React from 'react';

const CameraView = ({ videoRef }) => {
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover transform -scale-x-100"
    />
  );
};

export default CameraView;
