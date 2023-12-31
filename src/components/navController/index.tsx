import React, { useRef, useState, useEffect } from 'react';
import './navController.css'
import { useSelector, useDispatch } from 'react-redux';
import { actions, RootState } from '../../store';
import HomeSvg from '../../assets/home-outline.svg';
import SettingsSvg from '../../assets/settings-outline.svg';
import RocketSvg from '../../assets/rocket-outline.svg';
import DiscordSvg from '../../assets/logo-discord.svg';
import BookSvg from '../../assets/book-outline.svg';
import Auth from "../auth"
import RobotSvg from '../../assets/robot-outline.svg'
import Mail from '../../assets/mail-outline.svg'
import Twitter from '../../assets/logo-twitter.svg'
import Sparkes from '../../assets/sparkles-outline.svg';
import { trimStringToChars } from "../../utils/helpers";
import constants from '../../constants';
import MenuButton from '../app/components/menuButton';

interface NavControllerProps {
    launch: () => Promise<void>;
    close: boolean;
    isAuthorized: boolean;
}


const NavController : React.FC<NavControllerProps> = ({launch, close, isAuthorized}) => {
    const dispatch = useDispatch();
    const { currentView, blogAgents, isLoggedIn, activeBlogAgent } = useSelector((state : RootState) => state.main);

    var dropDownOptions = [];
    var newAgentCount = 0;
    const agentsKeys = Object.keys(blogAgents);
    for (let i = 0; i < agentsKeys.length; i++) {
      var text = blogAgents[agentsKeys[i]]?.businessData?.name;
      if (agentsKeys[i] === "default"){
        text = "Demo Agent"
      }
      if (!text) {
        newAgentCount++;
        text = `Pro Agent #${newAgentCount}`;
      }
      dropDownOptions.push({id: agentsKeys[i], text: trimStringToChars(text, 18)});
    }
    const payment = () => {
        dispatch(actions.setCurrentView("purchase"));
    }

    return (
        <div className={`navController ${close ? 'notClosed' : 'closed'}`} style={{'backgroundColor' : "#f7f7f8"}}>
            <div className='column align-start' style={{width: '100%'}}>
                <div className='row align-center w-100 justify-sb'>
                    <h3 className="italic font-bold" style={{marginLeft: '15px'}}>BloggerGPT</h3>
                    <MenuButton/>
                </div>
                <div className="navController-pageSelectors">
                    {!isAuthorized && <div className={`navController-pill ${currentView === "launch" ? "selected" : ""}`}
                        onClick={() => dispatch(actions.setCurrentView("launch"))}>
                        <img src={HomeSvg} />
                        <h6>Home</h6>
                    </div>}
                    <div className={`navController-pill ${currentView === "home" ? "selected" : ""}`}
                        onClick={() => dispatch(actions.setCurrentView("home"))}>
                        <img src={Sparkes} />
                        <h6>Agent</h6>
                    </div>
                    <div 
                        className={`navController-pill ${currentView === "settings" ? "selected" : ""}`}
                        onClick={() => dispatch(actions.setCurrentView("settings"))}
                    >
                        <img src={SettingsSvg} />
                        <h6>Configure</h6>
                    </div>
                    <div 
                        className={`navController-pill ${currentView === "tutorial" ? "selected" : ""}`}
                        onClick={() => dispatch(actions.setCurrentView("tutorial"))}
                    >
                        <img src={RocketSvg} />
                        <h6>Tutorial</h6>
                    </div>
                    </div>
                <div className="navController-pageSelectors">
                    {isLoggedIn && (<>
                        <p className="italic" style={{marginLeft: '10px', marginBottom: '5px'}}>Your Agents</p>
                        <hr style={{marginTop: "10px", marginBottom: "10px", marginLeft: '2px'}}/>
                        <div className="navController-agentSel-col">
                        {
                            dropDownOptions.map((option, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`navController-pill ${activeBlogAgent === option.id ? "selected" : ""}`}
                                        onClick={() => dispatch(actions.setActiveBlogAgent(option.id))}
                                    >
                                    <h6>{option.text}</h6>
                                </div>
                                )
                            })
                        }
                        </div>
                    </>)}
                    {dropDownOptions.length > 4 && <hr style={{marginTop: "5px", marginBottom: "10px", marginLeft: '2px'}}/>}
                </div>
            </div>
                <div className="navController-pageSelectors">
                    <div className="navController-socials">
                        <div className="navController-socialBtn">
                            <a href={constants.discordUrl} target='_blank'>
                                <img src={DiscordSvg} />
                            </a>
                        </div>
                        <div className="navController-socialBtn">
                            <a href="https://blog.langface.ai" target='_blank'>
                                <img src={BookSvg} />
                            </a>
                        </div>
                        <div className="navController-socialBtn">
                            <a href="mailto:patrick@langface.ai" target='_blank'>
                                <img src={Mail} />
                            </a>
                        </div>
                        <div className="navController-socialBtn">
                            <a href="https://twitter.com/gautam_sharda_" target='_blank'>
                                <img src={Twitter} />
                            </a>
                        </div>
                    </div>
                    <div id="navControllerPurchase" onClick={payment}>
                            <img src={RobotSvg} />
                            <h6 className='text-20px'>Hire Agent</h6>
                    </div>
                <Auth launch={launch}/>
            </div>
        </div>
    )
}
export default NavController;
