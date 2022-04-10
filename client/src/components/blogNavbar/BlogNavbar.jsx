/** @format */

import { IconButton } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import React from 'react';
import { useHistory } from 'react-router';
import './blogNavbar.css';

const BlogNavbar = () => {
	const history = useHistory();
	const prevRoute = () => {
		history.goBack();
	};
	return (
		<div className='blog-navbar'>
			<IconButton onClick={prevRoute}>
				<KeyboardBackspaceIcon
					fontSize='large'
					style={{ color: '#ff5c26' }}
				/>
			</IconButton>
		</div>
	);
};

export default BlogNavbar;
