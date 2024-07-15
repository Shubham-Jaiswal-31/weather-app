import React from "react";
import "./Footer.css";

const Footer = () => {
	return (
		<footer>
			<div className="social-media">
				<a
					href="https://www.facebook.com/shubham.anandjaiswal/"
					target="_blank"
					rel="noopenenr noreferrer"
				>
					<i className="fa fa-facebook-f"></i>
				</a>
				<a
					href="https://www.github.com/Shubham-Jaiswal-31"
					target="_blank"
					rel="noopenenr noreferrer"
				>
					<i className="fa fa-github"></i>
				</a>
				<a
					href="https://www.instagram.com/zeronity31/"
					target="_blank"
					rel="noopenenr noreferrer"
				>
					<i className="fa fa-instagram" rel="noopenenr noreferrer"></i>
				</a>
				<a
					href="https://www.linkedin.com/in/shubham-anand-jaiswal-3a41b91a0"
					target="_blank"
					rel="noopenenr noreferrer"
				>
					<i className="fa fa-linkedin"></i>
				</a>
			</div>
			<div className="footer-links">
				<a
					href="https://www.example.com/terms"
					target="_blank"
					rel="noopenenr noreferrer"
				>
					Terms & Conditions
				</a>
				<a
					href="https://www.example.com/privacy"
					target="_blank"
					rel="noopenenr noreferrer"
				>
					Privacy Policy
				</a>
			</div>
		</footer>
	);
};

export default Footer;
