import React from 'react';
import { Table } from 'reactstrap';
import './Rater.css';

class Rater extends React.Component {
	render() {
		return(
			<div className="container-fluid">
				<Table dark responsive id="rater">
					<tbody>
						<tr>
							<td>1</td>
							<td>2</td>
							<td>3</td>
							<td>4</td>
						</tr>
						<tr>
							<td>1</td>
							<td>2</td>
							<td>3</td>
							<td>4</td>
						</tr>
						<tr>
							<td>1</td>
							<td>2</td>
							<td>3</td>
							<td>4</td>
						</tr>
						<tr>
							<td>1</td>
							<td>2</td>
							<td>3</td>
							<td>4</td>
						</tr>
					</tbody>
				</Table>
			</div>
			);
	}
}

export default Rater;