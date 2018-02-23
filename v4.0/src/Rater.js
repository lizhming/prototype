import React from 'react';
import { Table } from 'reactstrap';

class Rater extends React.Component {
	constructor(props) {
		super(props);
		const ratio = this.props.ratio;
	}

	render() {
		return(
			<div className="container-fluid">
				<Table bordered dark responsive className="rater">
					<tbody>
						<tr>
							<td></td>
							<td>2</td>
							<td>3</td>
							<td>4</td>
						</tr>
						<tr>
							<td>1</td>
							<td></td>
							<td>3</td>
							<td>4</td>
						</tr>
						<tr>
							<td>1</td>
							<td>2</td>
							<td></td>
							<td>4</td>
						</tr>
						<tr>
							<td>1</td>
							<td>2</td>
							<td>3</td>
							<td></td>
						</tr>
					</tbody>
				</Table>
			</div>
			);
	}
}

export default Rater;