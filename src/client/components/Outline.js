import React from 'react';
import PropTypes from 'prop-types';

import Schedule from './Schedule';
import Instructors from './Instructors';
import Grading from './Grading';
import MaterialsTexts from './MaterialsTexts';
import AdditionalNotes from './AdditionalNotes';

const Outline = ({ outline }) => (
  <div className="courseOutline">
    {outline.hasOwnProperty('info') ? (
      <>
        <h1>
          {outline.info.term} - {outline.info.name}
        </h1>
        <h2>{outline.info.title}</h2>

        {outline.info.deliveryMethod && (
          <p>Delivery Method: {outline.info.deliveryMethod}</p>
        )}

        <Schedule
          courseSchedule={outline.courseSchedule}
          examSchedule={outline.examSchedule}
        />

        {outline.instructor.length && (
          <Instructors
            instructors={outline.instructor.filter(i => i.roleCode === 'PI')}
            canvas={outline.canvas}
          />
        )}

        {outline.info.gradingNotes || outline.grades ? (
          <Grading
            grades={outline.grades}
            gradingNotes={outline.info.gradingNotes}
          />
        ) : null}

        {outline.info.materials ||
        outline.requiredText ||
        outline.recommendedText ? (
          <MaterialsTexts
            materials={outline.info.materials}
            requiredText={outline.requiredText || []}
            recommendedText={outline.recommendedText || []}
          />
        ) : null}

        <h3>Description</h3>
        <h4>Calendar Description</h4>
        <div className="userTextContent">
          <p>{outline.info.description}</p>
        </div>

        {outline.info.courseDetails ? (
          <>
            <h4>Course Details</h4>
            <div className="userTextContent">
              <p
                dangerouslySetInnerHTML={{ __html: outline.info.courseDetails }}
              ></p>
            </div>
          </>
        ) : null}

        {outline.info.prerequisites ? (
          <>
            <h4>Prerequisites</h4>
            <p>{outline.info.prerequisites}</p>
          </>
        ) : null}

        {outline.info.corequisites ? (
          <>
            <h4>Corequisites</h4>
            <p>{outline.info.corequisites}</p>
          </>
        ) : null}

        {outline.info.educationalGoals ? (
          <>
            <h4>Educational Goals</h4>
            <div className="userTextContent">
              <p
                dangerouslySetInnerHTML={{
                  __html: outline.info.educationalGoals,
                }}
              ></p>
            </div>
          </>
        ) : null}

        <AdditionalNotes courseInfo={outline.info} />

        <div className="disclaimer">
          <p>
            Notice: This course outline was generated from data provided by the{' '}
            <a href="http://www.sfu.ca/outlines.html">SFU Course Outlines</a>{' '}
            system. In case of any discrepancy between this outline and the{' '}
            <a
              href={`http://www.sfu.ca/outlines.html/${outline.info.outlinePath}`}
            >
              official outline
            </a>
            , the latter shall be considered authoritative.
          </p>
          <p>
            Instructors: visit{' '}
            <a href="http://outlines.sfu.ca">http://outlines.sfu.ca</a> to
            update this course outline
          </p>
        </div>
      </>
    ) : (
      <NoOutline />
    )}
  </div>
);

Outline.propTypes = {
  outline: PropTypes.object,
};

const NoOutline = () => (
  <>
    <h1>Course Outline Not Found</h1>
    <p>
      A Course Outline for this course could not be located in the SFU Course
      Outlines system.
    </p>
    <p>
      Instructors: visit{' '}
      <a href="http://outlines.sfu.ca">http://outlines.sfu.ca</a> to create or
      update this course outline.
    </p>
  </>
);

export default Outline;
