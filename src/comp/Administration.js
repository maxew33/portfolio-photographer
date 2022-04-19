import React, { Fragment } from 'react'

import {
    collection, addDoc,
    deleteDoc, doc
} from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'
import { db } from '../firebase-config'

import '../style/administration.css'

export default function Administration({ galleries }) {

    console.log(galleries)

    const handleExpand = e => {
        e.preventDefault()
        e.target.nextSibling.classList.toggle('content-hidden')
    }

    const handleAdd = e => {
        e.preventDefault()
        const ref = collection(db, e.target.dataset.id)
        // addDoc(ref, {
        //     name: e.target.children[0].value,
        //     descr: e.target.children[1].value,
        //     img: e.target.children[2].value
        // })
        //     .then(() => {
        //         console.log('c est bon')
        //         e.target.reset()
        //     })
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
                                            <br />
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
