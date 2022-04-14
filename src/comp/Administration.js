import React from 'react'

import '../style/administration.css'

export default function Administration({ galleries }) {

    console.log(galleries)

    return (
        <div className='admin'>Administration<br />
            {galleries.map((gal, index) => {
                return (
                    <div className="gallery-index">
                        Galerie n°{index+1} :
                        <div className="name">nom : {gal.name}</div>
                        <div className="name">contenu : {gal.content.map((content, idx) => {
                            return (
                                <div className="contenu">{idx+1} : {content.name}, {content.descr}</div>
                            )
                        })}</div>

                    </div>)
            }
            )}
        </div>
    )
}
