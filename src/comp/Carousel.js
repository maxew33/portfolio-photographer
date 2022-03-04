import React from 'react'

import InfiniteScroll from './InfiniteScroll'

import '../style/carousel.css'

export default function Carousel(props) {
    return (
        <>
            <div className="main-picture">
                <img src={props.imgUrl}/>
            </div>
            <InfiniteScroll />
        </>
    )
}
