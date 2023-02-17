import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

interface ProfileImageProps {
  src: string;
  width: number;
  height: number;
}

function ProfileImage({ src, width, height }: ProfileImageProps) {
  return (
    <StyledProfileImg>
      <Image src={src} alt="image" width={width} height={height} />
    </StyledProfileImg>
  );
}

const StyledProfileImg = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    object-fit: cover;
  }
`;

export default ProfileImage;
