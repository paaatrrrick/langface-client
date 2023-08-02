import React, { useState } from 'react';
import { BusinessData } from '../../../store';

interface InsightsProps {
    specs: BusinessData;
    setSpecs: React.Dispatch<React.SetStateAction<BusinessData>>;
}

const Insights : React.FC<InsightsProps>= ({specs, setSpecs}) => {
    const [insights, setInsights] = useState([...specs.insights]);

    const insightChange = (e : React.ChangeEvent<HTMLInputElement>, index : number) : void => {
        const newInsights = [...insights];
        if (e.target.value === '') {
            newInsights.splice(index, 1);
        } else {
            newInsights[index] = e.target.value;
        }        
        setInsights(newInsights);
        setSpecs({...specs, ...{insights: newInsights}});
    }

    const removeInsight = (index : number) : void => {
        const newInsights = [...insights];
        newInsights.splice(index, 1);
        setInsights(newInsights);
        setSpecs({...specs, ...{insights: newInsights}});
    }

    const newInsights = [...insights, ''];

    return (
        <div className='specificatication-inputs'>
            <label htmlFor='subject'>What are a few unique pieces of expert-level insights about your product or service that you have gained through your journey in your industry?</label>
            {
                newInsights.map((insight, index) => {
                    return ( <InsightRow key={index} insight={insight} index={index} insightChange={insightChange} removeInsight={removeInsight} />)
                })
            }
        </div>
    );
};

interface InsightRowProps {
    insight: string;
    index: number;
    insightChange: (e : React.ChangeEvent<HTMLInputElement>, index : number) => void;
    removeInsight: (index : number) => void;
}
const InsightRow : React.FC<InsightRowProps> = ({insight, index, insightChange, removeInsight}) => {
    return (
        <div className="insights-row">
            <input type="text" className='specificatication-inputs-input' name="insight" value={insight} placeholder="Modern smartphones feature dual, triple, or even quad-camera arrays. These typically include a combination of wi...de-angle, ultra-wide-angle, telephoto, and depth-sensing cameras, allowing users to capture diverse perspectives and achieve impressive optical zoom levels." onChange={(e) => insightChange(e, index)}/>
            {insight && <button onClick={() => {removeInsight(index)}} className='insights-btn x'>&times;</button>}
        </div>
    )
}
export default Insights;

