import React, { useState } from 'react';
import PropTypes from 'prop-types';

import OutlineSwitcher from './Components/OutlineSwitcher';
import Outline from './Components/Outline';

function App({ outlines }) {
  const [activeOutline, setActiveOutline] = useState(0);

  if (!outlines.length) {
    return <p>A course outline could not be found for this course.</p>;
  }

  return (
    <>
      <OutlineSwitcher
        outlines={outlines}
        setActiveOutline={setActiveOutline}
      />
      <Outline outline={outlines[activeOutline]} />
    </>
  );
}

App.propTypes = {
  outlines: PropTypes.array,
};

export default App;
