import React from 'react';

const BackDrop = props => {
	return(
		<div className='backDrop' onClick={props.clickHandler} ></div>
	);
}

export default BackDrop;