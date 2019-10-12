const arc = require('@architect/functions');
const LTI = require('ims-lti');
const util = require('util');
const { getAllOutlines } = require('./outlines');
const { getCanvasProfilesForAllCourses } = require('./canvas');

const render = require('@architect/shared/views/index.js');

const handler = async req => {
  try {
    const provider = new LTI.Provider('courseoutlines', 'courseoutlines');
    const validateRequest = util.promisify(provider.valid_request);
    // patch the req object to be what the ims-lti library expects
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    req.url = `${protocol}://${req.headers.host}${req.path}`;
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
    console.log(error);
    return {
      headers: { 'content-type': 'text/html; charset=utf8' },
      body: `<p>An error occured</p><pre>${error}</pre>`,
    };
  }
};

exports.handler = arc.http.async(handler);
