import React from 'react';
import PropTypes from 'prop-types';

const OutlineSwitcher = ({ outlines, setActiveOutline }) => {
  return outlines.length > 1 ? (
    <>
      <p>This is a cross-listed course. Select an outline to view:</p>
      <ul className="outlineSwitcher">
        {outlines.map((o, i) => (
          <li key={o.info.outlinePath}>
            <button
              onClick={() => {
                setActiveOutline(i);
              }}
            >
              {o.info.name}
            </button>
          </li>
        ))}
      </ul>
    </>
  ) : null;
};

OutlineSwitcher.propTypes = {
  outlines: PropTypes.array,
  setActiveOutline: PropTypes.func,
};

export default OutlineSwitcher;
