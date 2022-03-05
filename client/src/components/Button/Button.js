import React from 'react';
import './Button.scss';

export default function Button(props) {
    //Rendering button with interchangeable icon and text
    return (
        <button className={props.className} onClick={props.onClick}>
            {props.text}
        </button>
    )
}