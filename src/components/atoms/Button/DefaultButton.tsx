import styled from 'styled-components';

type ButtonHTMLType = 'button' | 'submit';
type ButtonStyleType = 'primary' | 'secondary' | 'default';

interface ButtonProps {
  type: ButtonHTMLType;
  styleType?: ButtonStyleType;
  buttonText: string;
  onClick: any;
  children?: any;
}

function DefaultButton({
  type,
  buttonText,
  styleType = 'default',
  onClick,
  children,
}: ButtonProps) {
  return (
    <StyledButton type={type} styleType={styleType} onClick={onClick}>
      {children}
      {buttonText}
    </StyledButton>
  );
}

const StyledButton = styled.button<{ styleType?: ButtonStyleType }>`
  /* color: #fff;
  background: black; */
  background: ${(props) =>
    props.styleType === 'primary' ? '#fff' : 'transparent'};
  padding: 15px 20px 14px;
  border-radius: 16px;
  width: 100%;
  font-size: 18px;
  font-weight: 700;
  text-align: left;
  vertical-align: middle;

  svg {
    float: left;
    margin-right: 12px;
  }
`;

export default DefaultButton;
