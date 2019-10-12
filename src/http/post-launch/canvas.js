const get = require('./get');

const { CANVAS_API_KEY } = process.env;
const CANVAS_AUTH_HEADER = { authorization: `Bearer ${CANVAS_API_KEY}` };

const getInstructorProfile = async (canvasUrl, instructor, outline) => {
  try {
    if (!instructor.hasOwnProperty('email') || !instructor.email.length) {
      return instructor;
    }

    const id = instructor.email.split('@')[0];
    const url = `${canvasUrl}/api/v1/users/sis_login_id:${id}/profile`;
    const profile = await get(url, { headers: { ...CANVAS_AUTH_HEADER } });
    instructor.canvas = profile;
    instructor.canvas.message_user_path = await getMessagePathForInstructor(
      canvasUrl,
      id
    );

    return instructor;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCanvasProfilesForCourse = async (canvasUrl, outline) => {
  try {
    const promises = outline.instructor.map(i =>
      getInstructorProfile(canvasUrl, i, outline)
    );
    const profiles = await Promise.all(promises);
    return profiles;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCanvasProfilesForAllCourses = async (canvasUrl, outlines) => {
  try {
    const promises = outlines.map(o =>
      getCanvasProfilesForCourse(canvasUrl, o)
    );
    const profiles = await Promise.all(promises);
    return profiles;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getMessagePathForInstructor = async (canvasUrl, id) => {
  try {
    const url = `${canvasUrl}/sfu/api/user/${id}/profile`;
    const profile = await get(url, { headers: { ...CANVAS_AUTH_HEADER } });
    return profile.message_user_path;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getCanvasProfilesForAllCourses,
  getCanvasProfilesForCourse,
  getMessagePathForInstructor,
};
