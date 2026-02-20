import { useState } from 'react';

export function useForm(init) {
  const [val, setVal] = useState(init);

  function onChange(e) {
    const { name, value } = e.target;
    setVal((s) => ({ ...s, [name]: value }));
  }

  function reset() {
    setVal(init);
  }

  return { val, setVal, onChange, reset };
}
