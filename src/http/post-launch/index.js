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
      return {
        headers: { 'content-type': 'text/html; charset=utf8' },
        status: 403,
        body: `<p>Unauthorized Launch</p>`,
      };
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
        body: `<p>An error occured: ${e}</p>`,
      };
    } else {
      return returnBody;
    }
  }
};

exports.handler = arc.http.async(headerMunger, handler);
