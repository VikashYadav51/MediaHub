function FileIn({ label, name, onChange, accept }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        type="file"
        name={name}
        onChange={onChange}
        accept={accept}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1 file:text-white"
      />
    </label>
  );
}

export default FileIn;
