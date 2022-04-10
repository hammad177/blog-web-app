/** @format */

import React from 'react';
import { useHistory } from 'react-router';
import './header.css';

const Header = () => {
	const history = useHistory();
	return (
		<header
			className={
				history.location.pathname === '/' ? 'home-bg' : 'profile-bg'
			}>
			<h1>MERN Blog Posting App</h1>
			<p>Complete CURD Functionality &#38; Authentication</p>
		</header>
	);
};

export default Header;
