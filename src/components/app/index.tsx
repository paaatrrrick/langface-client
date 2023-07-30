import React, {useEffect } from 'react';
import './app.css';
import HtmlModal from "../htmlModal";
import {useDispatch, useSelector} from 'react-redux';
import { isAuthenticatedResponse} from '../../utils/getJwt';
import constants from '../../constants';
import { actions, DefaultBlogAgent, BannerMessage as BannerMessageType, RootState } from '../../store';
import {getUserAuthToken} from '../../utils/getJwt';
import {setColorScheme} from '../../utils/styles';
import {hasNonDemoBlog} from '../../utils/helpers';
import NavController from '../navController';
import BannerMessage from '../bannerMessage';
import Home from '../home';
import Settings from '../settings';
import Tutorial from '../tutorial';
import Launch from '../launch';
import PurchaseScreen from '../purchaseScreen';
import io from "socket.io-client";
import MenuButton from './components/menuButton';
import Specifications from '../specifications';
import { Socket } from 'socket.io-client'; // import Socket type

let socket: Socket;

const templateMap  = {
    "blogger": Home,
    "settings": Settings,
    "tutorial": Tutorial,
    "purchase": PurchaseScreen,
    "launch": Launch
}

const App = () => {
    const dispatch = useDispatch();
    const {bannerMessage, currentView, tabId, htmlModal, showSideBar, activeBlogAgent, blogAgents } = useSelector((state: RootState) => state.main);
    const currentBlog: DefaultBlogAgent | undefined = blogAgents[activeBlogAgent];

    useEffect(() => {
        setColorScheme("colorScheme");
    }, [])

    const launch = async () => {
        var userToken = getUserAuthToken();
        if (! userToken) 
            return;
        
        const res = await fetch(`${constants.url}/user`, {
            method: 'GET',
            headers: {
                "x-access'langface-auth-token": getUserAuthToken()
            }
        });

        if (!isAuthenticatedResponse(res, () => {
            dispatch(actions.setBannerMessage({type: 'error', message: 'Error: Could not authenticate user', timeout: 5000}));
            dispatch(actions.signOut());
        })) {
            return
        };

        if (!res.ok) {
            dispatch(actions.setBannerMessage({type: 'error', message: 'Error: Could not authenticate user', timeout: 5000}));
            dispatch(actions.signOut());
            return;
        }
        const data = await res.json();
        dispatch(actions.login({blogs: data.blogs, user: data.user}));
        const blogIds = data.blogs.map((blog: { _id: string }) => blog._id);
        joinRoom(blogIds);
    }

    const joinRoom = async (blogIds: string[] | string) => { // check if type string, cast to array if so
        if (typeof blogIds === 'string') 
            blogIds = [blogIds];
        
        dispatch(actions.setBlogIds(blogIds));
        socket.emit("joinRoom", {blogIds, tabId});
    }
    useEffect(() => {
        socket = io(constants.url);
        socket.on("updateData", (incomingData: any) => { // you should create a type for incomingData
            console.log('incoming data');
            console.log(incomingData);
            dispatch(actions.updateBlogAgentData(incomingData));
        });
        launch();
        return() => {
            socket.emit("leaveRoom", {tabId})
        } // maybe there should be more code here. I see "..." at the end
    }, []);

    // Here should be a return statement rendering your components, I see your jsx code is cut off here
    // useEffect(() => {
    //     // @ts-ignore
    //     window.rewardful('ready', function () {
    //         // @ts-ignore
    //         if (window.Rewardful.referral) {
    //             // @ts-ignore
    //             console.log("referral: " + window.Rewardful.referral);
    //             // @ts-ignore
    //             window.localStorage.setItem("referral-id", window.Rewardful.referral);
    //         }
    //     });
    // });


    const isAuthorized = hasNonDemoBlog(blogAgents);
    if(isAuthorized && currentView === 'launch') dispatch(actions.setCurrentView('home')); 
    //@ts-ignore
    const Component = templateMap[currentView] || Home;
    return (
        <div className={`App`}>
        {!showSideBar && <MenuButton topCorner whiteImg/>}

        <NavController launch={launch} close={showSideBar} isAuthorized={isAuthorized}/>
        {htmlModal && <HtmlModal html={htmlModal} close={() => {dispatch(actions.setHtmlModal(""))}}/>}
            {currentView !== 'launch' &&  (
                <>
                    {/* <NightToggle/> */}
                    <div className="App-right-section">
                            <div className="flex-grow-1"/>
                            <div className="body"> 
                            {bannerMessage && <BannerMessage messageObject={bannerMessage} close={() => dispatch(actions.clearBannerMessage())}/>}
                                <Component joinRoom={joinRoom} launch={launch}/>
                            </div>
                            <div className="flex-grow-1"/>
                    </div>
                </>
            )}
            {(currentBlog.settingUp && currentView === "home") &&
                <div className="HtmlModal-overlay"> 
                    <div className="HtmlModalSpecs">
                        <Specifications dontShowTopSave closeOnSave/>
                    </div>
                </div>
            }
            {currentView === 'launch' && <div className="App-right-section" style={{flexDirection: 'column'}}><Launch launch={launch}/></div>
            }
    </div>
    );
}
export default App;
