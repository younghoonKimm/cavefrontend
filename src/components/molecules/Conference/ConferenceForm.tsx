import Textarea from '@/components/atoms/Textarea/Textarea';
import { Dispatch, SetStateAction } from 'react';

interface ConferenceFormProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}

function ConferenceForm({ text, setText }: ConferenceFormProps) {
  return (
    <form>
      <Textarea value={text} onChange={(e: any) => setText(e.target.value)} />
    </form>
  );
}

export default ConferenceForm;
