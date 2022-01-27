import React from 'react';
import PropTypes from 'prop-types';

const avatarUrl = instructor =>
  instructor.canvas && instructor.canvas.avatar_url
    ? instructor.canvas.avatar_url
    : 'https://canvas.sfu.ca/images/messages/avatar-50.png';

const Instructor = ({ instructor, canvas }) => (
  <div className="instructor">
    <div className="instructorImage">
      <img
        src={avatarUrl(instructor)}
        alt={`${instructor.name} profile photo`}
      />
    </div>
    <div className="instructorDetails">
      <h4>{instructor.name}</h4>
      <ul className="instructorDetailList">
        {canvas && instructor.canvas ? (
          <li>
            <a target="_top" href={`${canvas.courseUrl}/users/${instructor.canvas.id}`}>
              Canvas Profile
            </a>
          </li>
        ) : null}
        {canvas && instructor.canvas && instructor.canvas.message_user_path ? (
          <li>
            <a
              target="_top" href={`${canvas.canvasUrl}/${instructor.canvas.message_user_path}`}
            >
              Send Canvas Message
            </a>
          </li>
        ) : null}
        <li>
          <a href={`mailto:${instructor.email}`}>{instructor.email}</a>
        </li>
        {instructor.phone && <li>{instructor.phone}</li>}
      </ul>
    </div>
  </div>
);

Instructor.propTypes = {
  instructor: PropTypes.object,
  canvas: PropTypes.object,
};

const Instructors = ({ instructors, canvas }) => (
  <>
    <h3>{instructors.length > 1 ? 'Instructors' : 'Instructor'}</h3>
    <div className="instructorList">
      {instructors.map((instructor, i) => (
        <Instructor
          instructor={instructor}
          canvas={canvas}
          key={`Instructor${i}`}
        />
      ))}
    </div>
  </>
);

Instructors.propTypes = {
  instructors: PropTypes.array,
  canvas: PropTypes.object,
};

export default Instructors;
