import "./htmlModal.css";
import parse from 'html-react-parser';
import React, { useState } from "react";

interface HtmlModalProps {
    html: string;
    close: () => void;
}

const HtmlModal : React.FC<HtmlModalProps> = ({html, close}) => {
    const [raw, setRaw] = useState(false);
    return (
    <div className="HtmlModal-overlay"> 
        <div className="HtmlModal">
        <button className="close-button text-sm" onClick={close}>&times;</button>
            <div className="HtmlModal-toprow">
                <div className="HtmlModal-slider">
                    <button className={`HtmlModal-html-button ${!raw ? 'HtmlModal-html-button-active' : ''}`}
                        onClick={() => setRaw(!raw)}
                    >
                        Html
                    </button>
                    <button className={`HtmlModal-html-button ${raw ? 'HtmlModal-html-button-active' : ''}`}
                        onClick={() => setRaw(!raw)}
                    >
                        Text
                    </button>
                </div>

            </div>
            <div className="HtmlModal-content">
                {!raw ? parse(html) : <p>{html}</p>}
            </div>
        </div>
    </div>
    )
}

export default HtmlModal;