import React from 'react'

import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase-config'

import '../style/administration.css'

export default function Administration({ galleries }) {

    console.log(galleries)

    const handleExpand = e => {
        e.preventDefault()
        e.target.nextSibling.classList.toggle('content-hidden')
    }

    const handleAddPicture = (e) => {
        e.preventDefault()
        console.log(e.target.dataset.id, e.target.children, e.target.children[0].value, 'caca')
        const ref = collection(db, e.target.dataset.id)
        addDoc(ref, {
            name: e.target.children[0].value,
            descr: e.target.children[1].value
        })
        .then(() => {
            console.log('c est bon')
            e.target.reset()
        })
    }

    return (
        <div className='admin'>
            Administration

            <br />

            <div className="check-my-galleries">
                {galleries.map(gal => {
                    return (
                        <div className="gallery-index">
                            {gal.id} : {gal.name}
                            <button onClick={handleExpand}>extand</button>
                            <div className="content content-hidden">contenu :
                                <br />
                                {gal.content.map(content => {
                                    return (
                                        <>
                                            {content.id} : {content.name} - <button>supprimer</button>
                                            <br />
                                            {content.descr}<br />
                                            url à mettre dans une balise img : {content.url}
                                            <br />
                                        </>
                                    )
                                })}</div>
                            <button className="add-a-picture" onClick={handleExpand}>add a picture</button>

                            <form className="new-picture-info" data-id={gal.id} onSubmit={handleAddPicture}>
                                <input type="text" name="name" id="" />
                                <input type="text" name="descr" id="" />
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
