import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default function({
	attempts, 
	attemptClick,
}) {
	const dateOptions = {year: 'numeric', month: 'numeric'};
	const minAttemptWidth = 50;
	//console.log(attempts);

	const columns = [
		{Header: 'Stars', accessor: 'numStars'},
		{Header: 'Name', accessor: '_lifter.name'},
		{Header: 'Date', id: 'date', accessor: (d) => new Date(d._competition.dateForSorting).toLocaleString('en-US', dateOptions)},
		{Header: 'Competition Name', accessor: '_competition.name'},
		{Header: 'Lift',  accessor: 'liftName'},
		{Header: 'Weight',  accessor: 'weight'}
	];

	function getTrProps(state, rowInfo, column, instance) {
		const attempt = rowInfo.original;
		return {
			onClick: (e) => {
				//console.log(attempt);
				attemptClick(attempt);
			}
		};
	}

	return (
		<ReactTable
			data={attempts}
			columns={columns} 
			sortable={false}
			resizable={false}
			showPagination={false}
			minRows={0}
			defaultPageSize={15}
			getTrProps={getTrProps}
		/>

	)

	
}