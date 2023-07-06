interface DefaultInput {
  type: 'text' | 'number';
  disabled: boolean;
}

function DefaultInput({ type = 'text', disabled = false }: DefaultInput) {
  return <input type={type} disabled />;
}

export default DefaultInput;
