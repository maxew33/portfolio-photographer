import React from 'react'

import InfiniteScroll from './InfiniteScroll'

import '../style/carousel.css'

export default function Carousel(props) {
    console.log('carousel infos : ',props.imgUrl, props.name)
    return (
        <>
            <div className="main-picture">
                <img src={props.imgUrl}/>
                {props.name}
            </div>
            <InfiniteScroll />
        </>
    )
}
