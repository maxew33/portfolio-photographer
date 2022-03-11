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
  const [galleries, setGalleries] = useState([{ name: "" }])
  const [galleriesContent, setGalleriesContent] = useState([])
  const [info, setInfo] = useState({ name: "", mail: "", about: "" })

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

    //gallery collection reference
    // const colRef = collection(db, 'gallery', '9boA73JaCrjucppsPO8K', 'gallery_1')
    const galleryRef = collection(db, 'gallery')

    //get gallery collection data
    getDocs(galleryRef)
      .then((snapshot) => {
        let newGalleries = []

        snapshot.docs.forEach((elt) => {
          newGalleries.push({ ...elt.data(), id: elt.id })
        })
        setGalleries(newGalleries)
      })
      .catch(err => console.error(err))


    //infos collection reference
    const infoRef = collection(db, 'info')

    //get info collection data
    getDocs(infoRef)
      .then((snapshot) => {
        let newInfos = []
        snapshot.docs.forEach((info) => {

          newInfos.push({ ...info.data(), id: info.id })
        })
        setInfo(newInfos[0])
      })
      .catch(err => console.error(err))

  },
    [])

  useEffect(() => {

    // Once my galleries are loaded, I get the content of each one
    if (galleries[0].name) {

      const newGalleriesContent = []

      galleries.map(gal => {
        const galleryContentRef = collection(db, gal.id)
        const myGalleryContent = []
        //get gallery collection data
        getDocs(galleryContentRef)
          .then((snapshot) => {
            snapshot.docs.forEach((elt) => {
              console.log(gal.id, { ...elt.data(), id: elt.id })
              myGalleryContent.push({ ...elt.data(), id: elt.id })
            })
          })
          .catch(err => console.error(err))

          newGalleriesContent.push(myGalleryContent)
      })

      setGalleriesContent(newGalleriesContent)

    }

  }, [galleries])

  useEffect(() => {
console.log('content: ',galleriesContent)

    //point to the folder
    folderRef = storageRef(myStorageRef, folder)

    //point to the image
    imgRef = storageRef(folderRef, img)

    getDownloadURL(imgRef)
      .then((url) => {
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
  }

  return (
    <div className="App">
      <Banner name={info.name} />
      <button className="arrow"
        onClick={() => handleClickArrow(-1)}>
        left arrow
      </button>
      <Carousel imgUrl={imgUrl} name={galleries[gallery - 1].name} />
      <button className="arrow"
        onClick={() => handleClickArrow(1)}>
        right arrow
      </button>
      <Signature />
    </div>
  );
}

export default App;
