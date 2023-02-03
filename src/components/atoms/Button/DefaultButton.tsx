import styled from 'styled-components';

type ButtonHTMLType = 'button' | 'submit';
type ButtonStyleType = 'primary' | 'secondary' | 'default';

interface ButtonProps {
  type: ButtonHTMLType;
  styleType?: ButtonStyleType;
  buttonText: string;
  onClick: any;
}

function DefaultButton({
  type,
  buttonText,
  styleType = 'default',
  onClick,
}: ButtonProps) {
  return (
    <StyledButton type={type} styleType={styleType} onClick={onClick}>
      {buttonText}
    </StyledButton>
  );
}

const StyledButton = styled.button<{ styleType?: ButtonStyleType }>`
  color: #fff;
  background: black;
  padding: 8px 12px;
  border-radius: 8px;
`;

export default DefaultButton;
