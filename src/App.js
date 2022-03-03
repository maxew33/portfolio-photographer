import React, {useState} from 'react'

import './App.css';

import Banner from './comp/Banner'
import Carousel from './comp/Carousel'
import Signature from './comp/Signature'

function App() {

  const [imgId, setImgId] = useState(1)

  const handleClickArrow = (value) => {
    let newId = imgId
    newId += value
    setImgId(newId)
  }

  return (
    <div className="App">
      <Banner/>
      <div className="arrow"
      onClick = {() => handleClickArrow(-1)}>
        left arrow
      </div>
      <Carousel id={'mon image ' + imgId}/>
      <div className="arrow"
      onClick = {() => handleClickArrow(1)}>
        right arrow
      </div>
      <Signature/>
    </div>
  );
}

export default App;
