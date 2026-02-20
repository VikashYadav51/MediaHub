function Error(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error?.message ||
    err?.message ||
    "Something went wrong"
  );
}

export default Error;
