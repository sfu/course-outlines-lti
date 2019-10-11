import React from 'react';
import PropTypes from 'prop-types';

const GradeItem = ({ gradeItem: { description, weight } }) => (
  <tr>
    <td className="gradeItemDescription">{description}</td>
    <td className="gradeItemWeight">{weight}%</td>
  </tr>
);

GradeItem.propTypes = {
  gradeItem: PropTypes.object,
};

const Grading = ({ grades, gradingNotes }) => (
  <>
    <h3>Grading</h3>
    {grades ? (
      <table className="gradeItemTable">
        <tbody>
          {grades.map((g, i) => (
            <GradeItem key={`GradeItem${i}`} gradeItem={g} />
          ))}
        </tbody>
      </table>
    ) : null}
    {gradingNotes ? (
      <>
        <h4>Grading Notes</h4>
        <div
          className="userTextContent"
          dangerouslySetInnerHTML={{ __html: gradingNotes }}
        ></div>
      </>
    ) : null}
  </>
);

Grading.propTypes = {
  grades: PropTypes.array,
  gradingNotes: PropTypes.string,
};

export default Grading;
