// https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/

module.exports = function(url, options = {}) {
  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, options, response => {
      // handle http errors

      if (response.statusCode === 404) {
        resolve({});
      }

      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(
          new Error(
            `Failed to load page ${url}, status code ${response.statusCode}`
          )
        );
      }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', chunk => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve(JSON.parse(body.join(''))));
    });
    // handle connection errors of the request
    request.on('error', err => reject(err));
  });
};
