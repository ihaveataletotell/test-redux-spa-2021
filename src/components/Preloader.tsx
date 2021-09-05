import * as React from 'react';

export const Preloader = React.memo(
	function Preloader(props: {}): React.ReactElement {
		const style: React.CSSProperties = {
			margin: 'auto', background: 'rgb(255, 255, 255)', display: 'block', shapeRendering: 'auto'
		};

		return (
			<svg xmlns="http://www.w3.org/2000/svg" style={style} width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
				<circle cx="28" cy="75" r="11" fill="#f47e60">
					<animate attributeName="fill-opacity" repeatCount="indefinite" dur="1s" values="0;1;1" keyTimes="0;0.2;1" begin="0s"></animate>
				</circle>

				<path d="M28 47A28 28 0 0 1 56 75" fill="none" stroke="#f8b26a" strokeWidth="10">
					<animate attributeName="stroke-opacity" repeatCount="indefinite" dur="1s" values="0;1;1" keyTimes="0;0.2;1" begin="0.1s"></animate>
				</path>
				<path d="M28 25A50 50 0 0 1 78 75" fill="none" stroke="#abbd81" strokeWidth="10">
					<animate attributeName="stroke-opacity" repeatCount="indefinite" dur="1s" values="0;1;1" keyTimes="0;0.2;1" begin="0.2s"></animate>
				</path>
			</svg>
		);
	}
);