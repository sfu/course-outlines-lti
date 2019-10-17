const arc = require('@architect/functions');
const LTI = require('ims-lti');
const Sentry = require('@sentry/node');
const util = require('util');
const { getAllOutlines } = require('./outlines');
const { getCanvasProfilesForAllCourses } = require('./canvas');
const headerMunger = require('@architect/shared/headerMunger');
const render = require('@architect/shared/views/index.js');

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

const handler = async req => {
  try {
    const { LTI_CLIENT_ID, LTI_SECRET } = process.env;
    const provider = new LTI.Provider(LTI_CLIENT_ID, LTI_SECRET);
    const validateRequest = util.promisify(provider.valid_request);

    // patch the req object to be what the ims-lti library expects
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    req.url = `${protocol}://${req.headers.host}${req.requestContext.path ||
      req.path}`;
    req.protocol = protocol;

    const isValid = await validateRequest(req);
    if (!isValid) {
      throw new Error('unauthorized launch');
    }

    // launch is valid, fetch the course outline(s) for the course(s)
    const courseId = req.body.custom_course_offering_sis_id;
    const canvasUrl = req.body.custom_canvas_url_base;

    const courses = courseId ? courseId.split(':') : [];
    const outlines = await getAllOutlines(courses);
    const profiles = await getCanvasProfilesForAllCourses(canvasUrl, outlines);

    outlines.forEach((outline, i) => {
      // replace the instructor object with the corresponding object from profiles
      outline.instructor = profiles[i];

      // add a canvas object for the course
      outline.canvas = {
        canvasUrl: req.body.custom_canvas_url_base,
        courseId: req.body.custom_course_id,
        sisId: req.body.custom_course_offering_sis_id,
        courseUrl: `${req.body.custom_canvas_url_base}/courses/${req.body.custom_course_id}`,
      };
    });

    return {
      headers: { 'content-type': 'text/html; charset=utf8' },
      body: render({ outlines }),
    };
  } catch (error) {
    console.log(error, req, process.env);
    const returnBody = {
      headers: { 'content-type': 'text/html; charset=utf8' },
      body: `<p>An error occured</p>`,
    };
    if (process.env.SENTRY_DSN) {
      Sentry.configureScope(scope => scope.setExtra('req.body', req.body));
      const e = Sentry.captureException(error);
      await Sentry.flush(2000);

      return {
        status: 500,
        headers: { 'content-type': 'text/html; charset=utf8' },
        body: `
<html>
  <head>
    <style>
      body {

        scroll-behavior: smooth;
        text-rendering: optimizeSpeed;
        line-height: 1.5;
        font-size: 1rem;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        font-family: 'Lato', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        color: rgb(45, 59, 69);
      }
      
      h1 {
        margin-bottom: 0;
        font-size: 1.5em;
      }
    </style>
  </head>
  <body>
    <h1>Sorry, an error occurred</h1>
    <p>An error occurred while trying to display the SFU Course Outline for this course. This error has been reported to the SFU Canvas administrators.</p>
    <p>Error reference: ${e}</p>
  </body>
</html>`,
      };
    } else {
      return returnBody;
    }
  }
};

exports.handler = arc.http.async(headerMunger, handler);
