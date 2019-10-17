// AWS sends some request headers as all-lower-case, and others as mixed-case. Normalize them for great justice.
// Hat-tip:
// https://architecture-as-text.slack.com/archives/C6BGT0D08/p1571179244177200?thread_ts=1571178938.175700&cid=C6BGT0D08

module.exports = req => {
  const headerKeys = Object.keys(req.headers);
  const normalizedHeaders = {
    ...req.headers,
  };

  headerKeys.forEach(header => {
    const lcHeader = header.toLowerCase();
    if (!req.headers.hasOwnProperty(lcHeader)) {
      normalizedHeaders[lcHeader] = req.headers[header];
    }
  });
  req.headers = normalizedHeaders;
  return req;
};
