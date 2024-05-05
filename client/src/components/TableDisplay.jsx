import React from 'react';
import Table from 'react-bootstrap/Table';

const TableDisplay = ({ data = [], fields, highlight = {} }) => {
	// console.log('highlight = ', highlight);
	// const filteredData = Object.keys(highlight).length > 1 ? data.filter(x => JSON.stringify(x) === JSON.stringify(highlight)) : data
	return (
		<div style={{ height: '70vh', overflow: 'scroll' }}>
			<Table striped bordered hover style={{ maxHeight: "70vh", overflow: "scroll" }}>
				<thead>
					<tr>
						<th>#</th>
						{
							fields.map(field => (
								<th>{field.heading}</th>
							))
						}
					</tr>
				</thead>
				<tbody>
					{
						data.map((value, index) => {
							const active = JSON.stringify(value) === JSON.stringify(highlight)
							return (
								<tr className={active ? 'active-row' : ''}>
									<td>{index + 1}</td>
									{
										fields.map(field => (
											<th className=''>{value[field.key]}</th>
										))
									}
								</tr>
							)
						})
					}
				</tbody>
			</Table>
		</div>
	)
}

export default TableDisplay;
