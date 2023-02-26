import React, { forwardRef } from 'react';
import styled from 'styled-components';

interface VideoProps {
  [key: string]: any;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>((props, ref) => {
  return <CustomVideo ref={ref} {...props} />;
});

const CustomVideo = styled.video`
  width: 240px;
  height: 240px;
  object-fit: cover;
  background: ${(props) => props.theme.bgColor};
`;

Video.displayName = 'Video';

export default Video;
