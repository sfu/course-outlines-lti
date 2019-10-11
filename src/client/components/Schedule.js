import React from 'react';
import PropTypes from 'prop-types';

import formatDate from 'date-fns/format';

const CourseSchedule = ({ data }) => {
  const items = data.map((s, i) => (
    <li key={`CourseSchedule${i}`}>
      {s.days} {s.startTime}-{s.endTime} - {s.buildingCode} {s.roomNumber}
    </li>
  ));
  return items.length ? (
    <ul className="scheduleList">{items}</ul>
  ) : (
    <p>To Be Announced</p>
  );
};

CourseSchedule.propTypes = {
  data: PropTypes.array,
};

const ExamSchedule = ({ data }) => {
  const items = data.map((s, i) => {
    if (!data || data.length === 0) return <p>To Be Announced</p>;

    return (
      <li key={`ExamScheule${i}`}>
        {s.buildingCode && s.roomNumber
          ? `${s.buildingCode} ${s.roomNumber}`
          : `Location TBA`}
        <br />
        {!s.startDate || !s.startTime || !s.endTime
          ? `Time and Date TBA`
          : `${formatDate(Date.now(), 'EEEE, MMMM d, yyyy')}, ${
              s.startTime
            } - ${s.endTime}`}
      </li>
    );
  });
  return <ul className="scheduleList">{items}</ul>;
};

ExamSchedule.propTypes = {
  data: PropTypes.array,
};

const Schedule = ({ courseSchedule = [], examSchedule = [] }) => (
  <>
    <h3>Schedule</h3>
    <div className="schedule">
      <div className="scheduleBlock">
        <h4>Course Times</h4>
        <CourseSchedule data={courseSchedule} />
      </div>
      <div className="scheduleBlock">
        <h4>Exam Times</h4>
        <ExamSchedule data={examSchedule} />
      </div>
    </div>
  </>
);

Schedule.propTypes = {
  courseSchedule: PropTypes.array,
  examSchedule: PropTypes.array,
};

export default Schedule;
