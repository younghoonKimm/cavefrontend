import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

interface ProfileImageProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

function ProfileImage({
  src,
  width = 52,
  height = 52,
  alt = 'profileImg',
}: ProfileImageProps) {
  return (
    <StyledProfileImg width={width} height={height}>
      <Image src={src} width={width} height={height} alt={alt} />
    </StyledProfileImg>
  );
}

const StyledProfileImg = styled.div<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 50%;
  overflow: hidden;
  img {
    width: 100%;
    object-fit: cover;
  }
`;

export default ProfileImage;
