import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFlickr } from '@fortawesome/free-brands-svg-icons'

import '../style/banner.css'

export default function Banner(props) {

    const handleClickBurger = () => {
    }

    return (
        <>
            <div className="banner-wrapper">
                <div onClick={handleClickBurger}>burger</div>
                <div>{props.name}</div>
                <div>
                    <FontAwesomeIcon icon={faFlickr} />
                </div>
            </div>
        </>
    )
}
