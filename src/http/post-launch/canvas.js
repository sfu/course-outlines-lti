const get = require('./get');

const { CANVAS_URL, CANVAS_API_KEY } = process.env;
const CANVAS_AUTH_HEADER = { authorization: `Bearer ${CANVAS_API_KEY}` };

const getInstructorProfile = async (instructor, outline) => {
  try {
    if (!instructor.hasOwnProperty('email') || !instructor.email.length) {
      return instructor;
    }

    const id = instructor.email.split('@')[0];
    const url = `${CANVAS_URL}/api/v1/users/sis_login_id:${id}/profile`;
    const profile = await get(url, { headers: { ...CANVAS_AUTH_HEADER } });
    instructor.canvas = profile;
    instructor.canvas.message_user_path = await getMessagePathForInstructor(id);

    return instructor;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCanvasProfilesForCourse = async outline => {
  try {
    const promises = outline.instructor.map(i =>
      getInstructorProfile(i, outline)
    );
    const profiles = await Promise.all(promises);
    return profiles;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCanvasProfilesForAllCourses = async outlines => {
  try {
    const promises = outlines.map(o => getCanvasProfilesForCourse(o));
    const profiles = await Promise.all(promises);
    return profiles;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getMessagePathForInstructor = async id => {
  try {
    const url = `${CANVAS_URL}/sfu/api/user/${id}/profile`;
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
