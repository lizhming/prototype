import React from 'react';
import { Progress } from 'reactstrap';

class ProgressBar extends React.Component {
	render() {
		return (
			<div id="progress-bar"> 
        <Progress multi>
          <Progress animated bar color="success" value="15">15%</Progress>
          <Progress animated bar color="warning" value="35">35%</Progress>
        </Progress>
      </div>
		);
	}
}

export default ProgressBar;