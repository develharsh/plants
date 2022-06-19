export const Redirect = (path) => {
  const payload = {
    redirect: {
      destination: path,
      permanent: false,
    },
  };
  return payload;
};

export const deleteCookies = (tokens) => {
  let values = [];
  tokens.forEach((val) => values.push(`${val}=harsh;Max-Age=0;`));
  return ["Set-Cookie", values];
};
