import React, { useState, useEffect } from 'react'
import { ref as storageRef, listAll, getDownloadURL } from 'firebase/storage'
import { collection, getDocs } from "firebase/firestore";

import { storage, db } from './firebase-config'

import './app.css';

import Banner from './comp/Banner'
import Carousel from './comp/Carousel'
import Signature from './comp/Signature'
import Administration from './comp/Administration'

function App() {

  const [galleryDisplayed, setGalleryDisplayed] = useState(1)
  const [folderNum, setFolderNum] = useState(1)
  const [imgUrl, setImgUrl] = useState('')
  const [galleries, setGalleries] = useState([{ name: "", id: "", content: [] }])
  const [info, setInfo] = useState({ name: "", mail: "", about: "" })
  const [adminToggle, setAdminToggle] = useState(false)

  // creation of the firebase storage reference
  // const storage = getStorage()
  const myStorageRef = storageRef(storage, 'gallery');

  let folder = 'gallery_' + galleryDisplayed
  let folderRef

  let img = 'gallery_' + galleryDisplayed + '01.jpg'
  let imgRef

  const getImgUrl = (gallerieId, idx) => {return(gallerieId + idx)}

  const fillMyGallerie = (gallerieId, index) => {
    const galleryContentRef = collection(db, gallerieId)
    const myGalleryContent = []

    //get gallery collection data
    getDocs(galleryContentRef)
      .then((snapshot) => {
        console.log(index, gallerieId)
        snapshot.docs.forEach((elt, idx) => myGalleryContent.push({ ...elt.data(), id: elt.id, url: getImgUrl(gallerieId, idx+1) }))
      })
      .catch(err => console.error(err))
    
      console.log(myGalleryContent)

    return (myGalleryContent)
  }

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
    const galleryRef = collection(db, 'gallery')

    //get gallery collection data
    getDocs(galleryRef)
      .then(snapshot => {
        let newGalleries = []

        snapshot.docs.forEach((elt, index) => {
          newGalleries.push({ ...elt.data(), id: elt.id, content: fillMyGallerie(elt.id, index) })
        })

        setGalleries(newGalleries)
      })
      .catch(err => console.error(err.message))

    //infos collection reference
    const infoRef = collection(db, 'info')

    //get info collection data
    getDocs(infoRef)
      .then(snapshot => {
        let newInfos = []
        snapshot.docs.forEach(info => newInfos.push({ ...info.data(), id: info.id }))
        setInfo(newInfos[0])
      })
      .catch(err => console.error(err.message))
  },
    [])

  useEffect(() => {
    console.log('content: ', galleries[galleryDisplayed - 1].content)

    //point to the folder
    folderRef = storageRef(myStorageRef, folder)

    //point to the image
    imgRef = storageRef(folderRef, img)

    getDownloadURL(imgRef)
      .then(url => setImgUrl(url))
      .catch(error => console.error(error.message))
  },
    [galleryDisplayed])

  const handleClickArrow = value => {
    let newId = galleryDisplayed
    newId += value
    newId < 1 && (newId = folderNum)
    newId > folderNum && (newId = 1)
    setGalleryDisplayed(newId)
  }

  const handleToggleAdmin = () => {
    setAdminToggle(!adminToggle)
  }

  return (
    <div className="App">
      <Banner name={info.name} />
      <button className="arrow"
        onClick={() => handleClickArrow(-1)}>
        left arrow
      </button>
      <Carousel imgUrl={imgUrl} name={galleries[galleryDisplayed - 1].name} />
      <button className="arrow"
        onClick={() => handleClickArrow(1)}>
        right arrow
      </button>
      <Signature />
      <button className='admin-toggle' onClick={handleToggleAdmin}> {adminToggle ? 'sortir de ' : 'aller vers '} gestion des données </button>
      {adminToggle && <Administration galleries={galleries}/>}
    </div>
  );
}

export default App;