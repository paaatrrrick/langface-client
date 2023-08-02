import React from 'react';
import { BusinessData } from '../../../store';


interface ValueProps {
    specs: BusinessData;
    setSpecs: React.Dispatch<React.SetStateAction<BusinessData>>;
}
const ValueProposition : React.FC<ValueProps> = ({specs, setSpecs}) => {
    const { valueProposition } = specs;
    return (
        <div className='specificatication-inputs'>
            <label htmlFor='subject'>How is your business differentiated in your industry? State everything that makes your product unique.</label>
            <textarea id='subject' className='specificatication-inputs-input' placeholder='At Apple we deliver unmatched user experience through innovative, high-quality technology products that are designed with elegance and simplicity.' value={valueProposition} onChange={(e) => setSpecs({...specs, ...{valueProposition: e.target.value}})}/>
        </div>
    );
};
export default ValueProposition;