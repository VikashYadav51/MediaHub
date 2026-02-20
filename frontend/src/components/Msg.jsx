function Msg({ text, ok = false }) {
  if (!text) return null;
  return (
    <p className={`rounded-lg px-3 py-2 text-sm ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
      {text}
    </p>
  );
}

export default Msg;
