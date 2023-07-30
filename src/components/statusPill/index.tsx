import React, { ReactElement, RefObject } from "react";
import { useRef } from "react";
import "./statusPill.css";
import Loader from "../uxcore/loader";
import { setHtmlModal } from '../../store';
import { useDispatch } from "react-redux";
import Tree from 'react-d3-tree';
import html2canvas from 'html2canvas';

interface StatusPillProps {
    version: string,
    title: string,
    config?: string,
    img?: string,
    url?: string,
    html?: string,
    tree?: any
};


const StatusPill : React.FC<StatusPillProps> = ({ version, title, config, img, url, html, tree  }) => {
    const dispatch = useDispatch();
    const treeRef: RefObject<HTMLDivElement> = useRef(null);

    const handleDownload = () => {
        if (!treeRef?.current) return;
        html2canvas(treeRef.current).then(canvas => {
          const link = document.createElement('a');
          link.download = 'tree.png';
          link.href = canvas.toDataURL();
          link.click();
        });
    };

    const treeRefWdith = treeRef.current ? (treeRef.current.offsetWidth / 2) : 465;
    if (!title && !config) return null;
    return (
        <div className={`status-pill ${version}`}>
            <div className="row align-center justify start">
                {img && <img src={img} />}
                <h3>{title}</h3>
                {version === "updating" && <Loader />}
            </div>
            {tree && 
            <div className="statusPill-treewrapper" ref={treeRef}> 
                <Tree 
                    data={tree} 
                    orientation="vertical"
                    zoom={0.75}
                    translate={{ x: treeRefWdith, y: 40 }}
                    rootNodeClassName="node__root"
                    branchNodeClassName="node__branch"
                    leafNodeClassName="node__leaf"
                    separation={{ siblings: 3, nonSiblings: 4 }}
                />
            </div> 
            }
            <p>{config}</p>
            <div className="row">
                {url && <a href={url} target="_blank">View Post</a>}
                {html && <a onClick={() => {dispatch(setHtmlModal(html))}} >View HTML</a>}
                {tree && <a onClick={handleDownload}>Download Image</a>}
            </div>

        </div>
    )
};
export default StatusPill;