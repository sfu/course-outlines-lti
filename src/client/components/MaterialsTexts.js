import React from 'react';
import PropTypes from 'prop-types';

const TextItem = ({ text }) => (
  <div className="readingItem">
    <div
      className="userTextContent"
      dangerouslySetInnerHTML={{ __html: text.details }}
    />
    {text.isbn && <p className="isbn">ISBN: {text.isbn}</p>}
  </div>
);

TextItem.propTypes = {
  text: PropTypes.object,
};

const MaterialsTexts = ({ materials, requiredText, recommendedText }) => (
  <>
    <h3>Materials and Texts</h3>
    {materials && <div dangerouslySetInnerHTML={{ __html: materials }} />}
    {requiredText.length ? (
      <>
        <h4>Required Reading</h4>
        {requiredText.map((t, i) => (
          <TextItem text={t} key={`RequiredText${i}`} />
        ))}
      </>
    ) : null}
    {recommendedText.length ? (
      <>
        <h4>Recommended Reading</h4>
        {recommendedText.map((t, i) => (
          <TextItem text={t} key={`RecommendedText${i}`} />
        ))}
      </>
    ) : null}
  </>
);

MaterialsTexts.propTypes = {
  materials: PropTypes.string,
  requiredText: PropTypes.array,
  recommendedText: PropTypes.array,
};

export default MaterialsTexts;
