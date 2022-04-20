import React, { Fragment, useState } from 'react'

import {
    collection, addDoc,
    deleteDoc, doc
} from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { db, storage } from '../firebase-config'

import '../style/administration.css'

export default function Administration({ galleries }) {

    const [progress, setProgress] = useState(0)

    console.log(galleries)

    const handleExpand = e => {
        e.preventDefault()
        e.target.nextSibling.classList.toggle('content-hidden')
    }

    const handleAdd = e => {
        e.preventDefault()

        const dataToAdd = e.target

        /* --- add the image to the store and get the url --- */
        const file = dataToAdd[2].files[0]

        console.log(file)

        const storageRef = ref(storage, `gallery/${dataToAdd[0].value}-${Date.now()}`)

        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on('state_changed', snapshot => {
            const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setProgress(prog)
        },
            err => console.error(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(url => addToTheDatabase(dataToAdd, url))
            }
        )

        /* --- add the informations to the database --- */
        const addToTheDatabase = (data, url) => {
            const databaseRef = collection(db, data.dataset.id)

            addDoc(databaseRef, {
                name: data[0].value,
                descr: data[1].value,
                url: url
            })
                .then(() => {
                    console.log('c est bon')
                    data.reset()
                })
        }

        console.log(e.target[0].value, e.target.children[0].value, e.target[2].files[0])
    }

    const handleSuppr = (galId, item) => {
        console.log('suppression de l\'image', galId, item.id)
        const docRef = doc(db, galId, item.id)
        const supprItem = window.confirm(`suppression de l'image ${item.name} ? `)
        if (supprItem) {
            alert('item supprimé')
            deleteDoc(docRef)
                .then(() => console.log('deleted'))
        }
        else {
            alert('abandon de la suppression')
        }
    }

    return (
        <div className='admin'>
            Administration

            <br />
            progress : {progress} %

            <br />

            <div className="check-my-galleries">
                {galleries.map(gal => {
                    return (
                        <div className="gallery-index" key={gal.id}>
                            {gal.id} : {gal.name}
                            <button onClick={handleExpand}>extand</button>
                            <div className="content content-hidden">contenu :
                                <br />
                                {gal.content.map(content => {
                                    return (
                                        < Fragment key={content.id}>
                                            {content.id} : {content.name} -
                                            <button className="suppr" onClick={() => handleSuppr(gal.id, content)}>
                                                supprimer
                                            </button>
                                            <br />
                                            {content.descr}<br />
                                            url à mettre dans une balise img : {content.url}
                                            <br /><br /><br />
                                        </Fragment>
                                    )
                                })}</div>

                            <button className="add-a-picture" onClick={handleExpand}>add a picture</button>

                            <form
                                className="new-picture-info content content-hidden" data-id={gal.id}
                                onSubmit={handleAdd}>
                                <input
                                    type="text"
                                    name="name"
                                    id=""
                                    placeholder="name"
                                    required />
                                <input
                                    type="text"
                                    name="descr"
                                    id=""
                                    placeholder="descr"
                                    required />
                                <input
                                    type="file"
                                    accept=".jpg, .jpeg, .png"
                                    required />
                                <br />
                                <button>validation of the picture</button>
                            </form>
                        </div>)
                }
                )}
            </div>
            <div className="add-gallerie">
                add a gallerie
                <form></form>
            </div>
        </div>
    )
}
