import React from 'react';
import { BusinessData } from '../../../store';

interface InsightsProps {
    specs: BusinessData;
    setSpecs: React.Dispatch<React.SetStateAction<BusinessData>>;
}
const Name : React.FC<InsightsProps>= ({specs, setSpecs}) => {
    const { name, product } = specs;
    return (
        <div className='specificatication-inputs'>
            <label htmlFor='subject'>What is the name of your product or business?</label>
            <input id='subject' className='specificatication-inputs-input' type='text' placeholder='ex: Apple, Inc.' value={name} onChange={(e) => setSpecs({...specs, ...{name: e.target.value}})}/>
            <label htmlFor='subject' style={{marginTop: '25px'}}>Describe what you provide in detail.</label>
            <textarea id='subject' className='specificatication-inputs-input' placeholder='ex: At Apple we produce high-quality electronic devices and services to enrich everyday life. We manufacture a variety of products, such as mobile phones to help people connect, personal computers for work and creativity, and digital music players to enjoy your favorite tunes. Additionally, we develop online services to store and share your data securely across these devices.' value={product} onChange={(e) => setSpecs({...specs, ...{product: e.target.value}})}/>
        </div>
    );
};
export default Name;