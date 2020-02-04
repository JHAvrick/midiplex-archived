import React from 'react';
import * as SVGLoaders from 'svg-loaders-react';
import './loading.scss';

const Loading = () => {
    return (
        <div className="loading">
            <SVGLoaders.Audio />
        </div>
    )
}

export default Loading;
