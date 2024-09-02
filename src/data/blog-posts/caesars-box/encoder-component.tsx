import { useState } from 'preact/hooks';
import { encoder } from './_encoder';

function EncoderComponent() {
  const [string, setString] = useState('HELLO INTERNET');

  const handleChange = (e: any): void => setString(e.target.value);

  return (
    <div style='white-space: pre-wrap;'>
      <textarea
        type='text'
        onInput={handleChange}
        value={string}
        style='height: 3rem; width: 50%;'
      ></textarea>
      <h3>{`${encoder(string)}`}</h3>
    </div>
  );
}

export default EncoderComponent;
