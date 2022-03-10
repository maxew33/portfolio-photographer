import React, { useState, useEffect } from 'react'
import { ref as storageRef, listAll, getDownloadURL } from 'firebase/storage'
import { collection, getDocs } from "firebase/firestore";

import { storage, db } from './firebase-config'

import './App.css';

import Banner from './comp/Banner'
import Carousel from './comp/Carousel'
import Signature from './comp/Signature'

function App() {

  const [gallery, setGallery] = useState(1)
  const [folderNum, setFolderNum] = useState(1)
  const [imgUrl, setImgUrl] = useState('')
  const [info, setInfo] = useState([])
  const [galleries, setGalleries] = useState([])

  // creation of the firebase storage reference
  // const storage = getStorage()
  const myStorageRef = storageRef(storage, 'gallery');

  let folder = 'gallery_' + gallery
  let folderRef

  let img = 'gallery_' + gallery + '01.jpg'
  let imgRef

  useEffect(() => {

    // call the storage

    //point to the folder
    folderRef = storageRef(myStorageRef, folder)

    //point to the image
    imgRef = storageRef(storage, img)

    listAll(myStorageRef)
      .then((res) => {

        // set the qty of folders in the storage

        setFolderNum(res.prefixes.length)

      }).catch((error) => {
        console.error(error)
      })


    // call the database

    //collection reference
    // const colRef = collection(db, 'gallery', '9boA73JaCrjucppsPO8K', 'gallery_1')
    const colRef = collection(db, 'gallery')

    //get collection data
    getDocs(colRef)
      .then((snapshot) => {
        let newGalleries = []
        snapshot.docs.forEach((elt) => {
          newGalleries.push({ ...elt.data(), id: elt.id })
        })
        setGalleries(newGalleries)
      })
      .catch(err => console.error(err))

      
    console.log(galleries)
  },
    [])


  useEffect(() => {
    //point to the folder
    folderRef = storageRef(myStorageRef, folder)

    //point to the image
    imgRef = storageRef(folderRef, img)

    getDownloadURL(imgRef)
      .then((url) => {
        console.log(url)
        setImgUrl(url)
      })
      .catch((error) => {
        console.error(error)
      });

      console.log(galleries[gallery-1])

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
      <Carousel imgUrl={imgUrl} name={galleries[gallery-1].name} />
      <button className="arrow"
        onClick={() => handleClickArrow(1)}>
        right arrow
      </button>
      <Signature />
    </div>
  );
}

export default App;
