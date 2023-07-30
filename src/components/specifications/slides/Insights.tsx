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
            <label htmlFor='subject'>What are a few things that differentiated you from other businesses in this area?</label>
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
            <input type="text" className='specificatication-inputs-input' name="insight" value={insight} placeholder=" We focus on creating products that are not only technologically advanced but also intuitive and elegant." onChange={(e) => insightChange(e, index)}/>
            {insight && <button onClick={() => {removeInsight(index)}} className='insights-btn x'>&times;</button>}
        </div>
    )
}
export default Insights;

