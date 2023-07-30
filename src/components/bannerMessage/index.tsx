import React from "react";
import "./bannerMessage.css";
import { useEffect } from "react";
import { BannerMessage as BannerMessageTypes } from '../../store';


const classNameMap = {
    "error": "banner-message error-message",
    "success": "banner-message success-message",
}

type BannerMessageProps = {
    messageObject: BannerMessageTypes,
    close: () => void,
}

const BannerMessage = ({ messageObject, close } : BannerMessageProps) => {
    const { message, timeout, type } = messageObject;

    useEffect(() => {
        if (timeout) {
            setTimeout(() => {
                close();
            }, timeout);
        }
    }, []);

    //@ts-ignore
    const classes = classNameMap[type] || "banner-message error-message";
    return (
        <div className={`${classes}`}>
            <p>{message}</p>
            <button onClick={close}>&times;</button>
        </div >
    );
}
export default BannerMessage;