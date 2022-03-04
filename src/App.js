import React, { useState, useEffect } from 'react'
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase-config';

import './App.css';

import Banner from './comp/Banner'
import Carousel from './comp/Carousel'
import Signature from './comp/Signature'

function App() {

  const [gallery, setGallery] = useState(1)
  const [folderNum, setFolderNum] = useState(1)
  const [imgUrl, setImgUrl] = useState('')

  // creation of the firebase storage reference
  // const storage = getStorage()
  const storageRef = ref(storage, 'gallery');

  let folder = 'gallery_' + gallery
  let folderRef

  let img = 'gallery_' + gallery + '01.jpg'
  let imgRef

  useEffect(() => {

    // call the storage

    //point to the folder
    folderRef = ref(storageRef, folder)

    //point to the image
    imgRef = ref(storage, img)

    console.log(folderRef, imgRef)

    listAll(storageRef)
      .then((res) => {

        // set the qty of folders in the storage

        setFolderNum(res.prefixes.length)

      }).catch((error) => {
        console.error(error)
      })

  },
    [])


  useEffect(() => {
    //point to the folder
    folderRef = ref(storageRef, folder)

    //point to the image
    imgRef = ref(folderRef, img)

    getDownloadURL(imgRef)
      .then((url) => {
        console.log(url)
        setImgUrl(url)
      })
      .catch((error) => {
        console.error(error)
      });

  },
    [gallery])

  const handleClickArrow = (value) => {
    let newId = gallery
    newId += value
    newId < 1 && (newId = folderNum)
    newId > folderNum && (newId = 1)
    setGallery(newId)
    console.log('arrow clicked qty = ', folderNum)
  }

  return (
    <div className="App">
      <Banner />
      <button className="arrow"
        onClick={() => handleClickArrow(-1)}>
        left arrow
      </button>
      <Carousel imgUrl={imgUrl} />
      <button className="arrow"
        onClick={() => handleClickArrow(1)}>
        right arrow
      </button>
      <Signature />
    </div>
  );
}

export default App;
