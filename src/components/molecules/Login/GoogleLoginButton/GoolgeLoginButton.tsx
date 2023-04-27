import { GoogleIcon } from '@/components/atoms/Svg/Index';
import { flexStyle } from '@/styles/common';
import Link from 'next/link';
import styled from 'styled-components';

function GoolgeLoginButton() {
  return (
    <StyledLink href={'http://localhost:3002/api/auth/google'}>
      <GoogleIcon width={22} height={22} />
      Sign in with Google
    </StyledLink>
  );
}

const StyledLink = styled(Link)`
  ${flexStyle}
  text-decoration: unset;
  justify-content: center;
  gap: 0 20px;
  height: 52px;
  /* background: ${(props) => props.theme.lightTheme.bgColor}; */
  border: 1px solid #eee;
  background: ${(props) => props.theme.lightTheme.bgColor};

  border-radius: 62px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme.lightTheme.textColor};
  &:visited {
    color: ${(props) => props.theme.lightTheme.textColor};
  }
`;

export default GoolgeLoginButton;
