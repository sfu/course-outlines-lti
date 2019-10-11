import React from 'react';
import PropTypes from 'prop-types';

const AdditionalNotes = ({ courseInfo }) => {
  const {
    degreeLevel,
    departmentalUgradNotes,
    departmentalGradNotes,
    graduateStudiesNotes,
    registrarNotes,
  } = courseInfo;

  return (
    <div className="additionalNotes">
      {degreeLevel === 'UGRD' && departmentalUgradNotes ? (
        <>
          <h3 className="supplemental">Department Undergraduate Notes</h3>
          <div className="userTextContent">
            <p dangerouslySetInnerHTML={{ __html: departmentalUgradNotes }} />
          </div>
        </>
      ) : null}

      {degreeLevel === 'GRAD' && departmentalGradNotes ? (
        <>
          <h3 className="supplemental">Department Graduate Notes</h3>
          <div className="userTextContent">
            <p dangerouslySetInnerHTML={{ __html: departmentalGradNotes }} />
          </div>
        </>
      ) : null}

      {degreeLevel === 'GRAD' && graduateStudiesNotes ? (
        <>
          <h3 className="supplemental">Graduate Studies Notes</h3>
          <div className="userTextContent">
            <p dangerouslySetInnerHTML={{ __html: graduateStudiesNotes }} />
          </div>
        </>
      ) : null}

      {registrarNotes ? (
        <>
          <h3 className="supplemental">Registrar Notes</h3>
          <div className="userTextContent">
            <p dangerouslySetInnerHTML={{ __html: registrarNotes }} />
          </div>
        </>
      ) : null}
    </div>
  );
};

AdditionalNotes.propTypes = {
  courseInfo: PropTypes.object,
};

export default AdditionalNotes;
