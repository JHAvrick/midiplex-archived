import React from 'react';
import './boot.scss';
import useBootStatus from './use-boot-status';

const Boot = function(props){
    const statuses = useBootStatus();
    return (
        <div className="boot">
            {statuses.map((status) => {
                return <p key={status} className="boot__status"> {status} </p>
            })}
        </div>
    )
}

export default Boot;
