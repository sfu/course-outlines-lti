const get = require('./get');
const { COURSE_OUTLINES_URL } = process.env;

const getOutlineForCourse = course => {
  // 1197-bisc-101-d100
  const url = `${COURSE_OUTLINES_URL}${course
    .toLowerCase()
    .replace(/-/g, '/')}`;
  return get(url);
};

const getAllOutlines = async courses => {
  try {
    const promises = courses.map(course => getOutlineForCourse(course));
    const outlines = await Promise.all(promises);
    return outlines;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { getAllOutlines };
