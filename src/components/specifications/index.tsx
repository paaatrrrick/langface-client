import React, {useState, useEffect} from 'react';
import './specifications.css';
import { useSelector, useDispatch } from 'react-redux';
import { actions, RootState, DefaultBlogAgent } from '../../store';
import Name from './slides/Name';
import ValueProposition from './slides/ValueProposition';
import Insights from './slides/Insights';
import Links from './slides/Links';
import Loader from "../uxcore/loader";
import constants from "../../constants";
import { getUserAuthToken } from "../../utils/getJwt";

const inputsArray = [
    Name,
    ValueProposition,
    Insights,
    Links
]

interface SpecificationsProps {
    dontShowTopSave?: boolean;
    closeOnSave?: boolean;
}

const Specifications = ({dontShowTopSave, closeOnSave} : SpecificationsProps) => {
    const dispatch = useDispatch();
    const [reset, setReset] = useState<number>(1);
    const [currentSlide, setCurrentSlide] = useState(0);
    const activeBlogAgent = useSelector((state : RootState) => state.main.activeBlogAgent);
    const blogAgents = useSelector((state : RootState) => state.main.blogAgents);
    const isLoggedIn = useSelector((state : RootState) => state.main.isLoggedIn);
    const currentBlog : DefaultBlogAgent = blogAgents[activeBlogAgent];
    const businessData = currentBlog.businessData;
    const [specs, setSpecs] = useState(businessData);
    const [loading, setLoading] = useState<boolean>(false);
    const fields = Object.keys(specs);

    // useEffect(() => {
    //     setReset(reset + 1);
    //     console.log('hitting this use effect')
    //     console.log(activeBlogAgent);
    // }, [activeBlogAgent]);

    const updateSpecsOnSlideChange = async (direction : string, final : boolean) : Promise<void> => {
        const changes = {};
        for (let field of fields) {
            // @ts-ignore
            if (specs[field] !== businessData[field]) {
                // @ts-ignore
                changes[field] = specs[field];
            }
        }
        if (Object.keys(changes).length === 0) {
            moveSlide(direction, final);
            return;
        }
        if (currentBlog.demo) {
            dispatch(actions.updatebusinessData(changes));
            moveSlide(direction, final);
            return;
        }
        setLoading(true);
        const res = await fetch(`${constants.url}/updateBusinessData`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', "x-access'langface-auth-token": getUserAuthToken()}, 
            body: JSON.stringify({businessData: specs, blogID: activeBlogAgent})
        });
        if (!res.ok) {
            dispatch(actions.setBannerMessage({type: "error", message: "Oops, we had an error updating your information. Please refresh the page and try again."}));
        } else {
            dispatch(actions.updatebusinessData(specs));
            moveSlide(direction, final);
        }
        setLoading(false);
    }

    const moveSlide = (direction : string, final : boolean) : void => {
        if (final && closeOnSave) {
            if (currentSlide === 0 ) {
                dispatch(actions.updateBlogAgent({id : activeBlogAgent, settingUp: true}));
                dispatch(actions.setCurrentView(`${isLoggedIn ? "settings" : "launch"}`));
            } else {
                dispatch(actions.updateBlogAgent({id : activeBlogAgent, settingUp: false}));
            }
        } else if (final) {
            dispatch(actions.updateBlogAgent({id : activeBlogAgent, settingUp: false}));
            dispatch(actions.setCurrentView("home"));        
        } else if (direction === "back") {
            setCurrentSlide(currentSlide - 1);
        } else if (direction === "forwards"){
            setCurrentSlide(currentSlide + 1);
        }
    }
    var canGoNext = true;
    if (currentSlide === 0 && (!specs.name || !specs.product)) {
        canGoNext = false;
    }

    const Components = inputsArray[currentSlide];
    return (
        <div className="specifications">
            <h2 className='text-2xl'>Tell us about your business</h2>
            {!loading && <Components specs={specs} setSpecs={setSpecs}/>}
            {loading && <div className="abs-center"><Loader/></div>}
            {(!dontShowTopSave && currentSlide !== (inputsArray.length  - 1)) && <button onClick={() => {updateSpecsOnSlideChange("forward", false)}} className='specs-saveBtn' disabled={loading}>Save</button>}
            {(dontShowTopSave) && 
            <button onClick={() => {updateSpecsOnSlideChange('nil', true)}} 
            className='absolute top-5 right-5 rounded-full bg-light2 w-8 h-8 bg-l-l2 text-center hover:bg-b2 hover:text-brandColor hover:bg-l-b2' 
            disabled={loading}>&times;</button>}
            {(currentSlide == (inputsArray.length  - 1)) && <button onClick={() => {updateSpecsOnSlideChange('', true)}}className='app-btn1 spec-move-forward' disabled={(loading || !canGoNext)}>Save</button>}
            {(currentSlide !== 0) && <button className='app-btn1 spec-move-back' disabled={loading} onClick={() => {updateSpecsOnSlideChange("back", false)}}>Back</button>}
            {(currentSlide !== (inputsArray.length  - 1)) && <button className='app-btn1 spec-move-forward' disabled={(loading || !canGoNext)} onClick={() => {updateSpecsOnSlideChange("forwards", false)}}>Next</button>}

        </div>
    );
}

export default Specifications;