import { fireEvent, render, screen } from '@testing-library/react';
import DefaultButton from '../DefaultButton';

describe('<DefaultButton/>', () => {
  it('renders a buttonText', () => {
    render(
      <DefaultButton type="button" buttonText="button" onClick={() => {}} />,
    );

    const button = screen.getByRole('button');

    fireEvent.click(button);

    const buttonText = screen.getByText('button');
    expect(buttonText).toBeInTheDocument();
  });
});
