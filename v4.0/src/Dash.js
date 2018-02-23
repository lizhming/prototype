import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

class Dash extends React.Component {
	constructor(props) {
		super(props);
		const ratio = this.props.ratio;
	}

	render() {
		return (
			<div id="dash-main">
				<Jumbotron>
	        <h1 className="display-3">Hello, world!</h1>
	        <p className="lead">This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.</p>
	        <hr className="my-2" />
	        <p>
					Duis vel ex ac turpis faucibus congue at non diam. Phasellus eu nisi at lorem convallis gravida et quis eros. Maecenas id sapien erat. Pellentesque fermentum congue aliquam. Suspendisse interdum elementum mollis. Morbi id tellus congue, aliquet urna a, molestie mi. Cras id cursus orci, eget tempus risus. Vestibulum non mollis risus. In pellentesque nibh sed neque volutpat auctor. Vestibulum congue, arcu non pellentesque porttitor, orci sapien volutpat tortor, nec fermentum tortor justo eu diam.
	        </p>
	        <p className="lead">
	          <Button color="primary">Learn More</Button>
	        </p>
	      </Jumbotron>
	    </div>
		);
	}
}

export default Dash;