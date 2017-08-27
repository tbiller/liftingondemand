import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// import ResultsTableHeader from './ResultsTableHeader';
// import ResultsTableBody from './ResultsTableBody';

export default function({
	appearances, 
	competitionClick,
	tdClick, 
	currentAttempt,
}) {
	const dateOptions = {year: 'numeric', month: 'numeric'};
	const minAttemptWidth = 50;
	console.log(appearances);

	const columns = [
		{Header: 'Date', id: 'date', minWidth: 60, accessor: (d) => new Date(d._competition.dateForSorting).toLocaleString('en-US', dateOptions)},
		{Header: 'Competition Name', id: 'compName', accessor: '_competition.name', minWidth: 150},
		{Header: 'Bwt.', id: 'bodyweight', accessor: (d) => (+d.bodyweight).toFixed(2), minWidth: 40},
		{Header: 'Pl.', id: 'place', accessor: (d) => d.place === '-' ? '-' : +d.place, minWidth: 25},
		{Header: 'Div.', accessor: 'division', minWidth: 40},
		{Header: 'SQ #1', className: 'border-left', headerClassName: 'border-left', accessor: 'attempts.Squat 1', minWidth: minAttemptWidth, Cell: attemptCell},
		{Header: 'SQ #2', accessor: 'attempts.Squat 2', minWidth: minAttemptWidth, Cell: attemptCell}, 
		{Header: 'SQ #3', accessor: 'attempts.Squat 3', minWidth: minAttemptWidth, Cell: attemptCell}, 
		{Header: 'BP #1', className: 'border-left', headerClassName: 'border-left', accessor: 'attempts.Bench 1', minWidth: minAttemptWidth, Cell: attemptCell},
		{Header: 'BP #2', accessor: 'attempts.Bench 2', minWidth: minAttemptWidth, Cell: attemptCell}, 
		{Header: 'BP #3', accessor: 'attempts.Bench 3', minWidth: minAttemptWidth, Cell: attemptCell}, 
		{Header: 'DL #1', className: 'border-left', headerClassName: 'border-left', accessor: 'attempts.Deadlift 1', minWidth: minAttemptWidth, Cell: attemptCell},
		{Header: 'DL #2', accessor: 'attempts.Deadlift 2', minWidth: minAttemptWidth, Cell: attemptCell}, 
		{Header: 'DL #3', headerClassName: 'border-right', className: 'border-right', accessor: 'attempts.Deadlift 3', minWidth: minAttemptWidth, Cell: attemptCell}, 
		{Header: 'Total', id: 'total', accessor: '', minWidth: minAttemptWidth, Cell: totalCell},
		{Header: 'Wilks', accessor: 'wilks', minWidth: minAttemptWidth }
	];

	function sortComps(appA, appB) {
		console.log(appA);
		return new Date(appB._competition.dateForSorting) - new Date(appA._competition.dateForSorting);
	}

	function showWeight(weightStr) {
		if (isNaN(parseFloat(weightStr, 10))) {
			return weightStr;
		}
	}

	// function compNameCell(cell) {
	// 	const name = cell.value._competition.name;
	// 	return (
	// 		<Link to={'/comp/' + name}>
	// 			{name}
	// 		</Link>
	// 	)
	// }

	function totalCell(cell) {
		const lifter = cell.value;
		const weight = lifter.total.weight;
		const records = lifter.total.records;
		const showRecords = lifter.total.weight === weight;

		return weightCell(weight, records, 'total', showRecords);
	}

	function attemptCell(cell) {
		const attempt = cell.value;
		const lifter = attempt.lifterObj;
		const showRecords = !!attempt.records;
		let className = 'weight-cell ' + attempt.result;

		if (!attempt.hasFrame()) { className += ' no-frame'; }

		return weightCell(attempt.weight, attempt.records, className, showRecords);
	}
		
	function weightCell(weight, records, className, showRecords=false) {
		return (
			<div>
				{showRecords &&
					<div className='records'>{records}</div>
				}
				<span className={className}>{weight}</span> 
			</div>
		);
	}

	function sortStrings(a, b) {
		return a - b;
	}

	console.log('rerendering with currentAttempt:')
	console.log(currentAttempt);
	function getTdProps(state, rowInfo, column, instance) {
		const attemptCellPrefix = 'attempts.';
		const lifterAppearance = rowInfo.original;
		const lifter = lifterAppearance._lifter;
		const attempt = rowInfo.row[column.id];
		return {
			className: (() => {
				let className = '';
				if (column.id.substr(0, attemptCellPrefix.length) === attemptCellPrefix) {
					className += ' lift';
					if (attempt.hasFrame()) {
						className += ' has-frame';
					} else {
						className += ' no-frame';
					}
				} else if (column.id === 'name') {
					className += ' lifter-name';
				} else if (column.id === 'compName') {
					className += ' comp-name';
				}
				if (currentAttempt) {
					// console.log(currentAttempt._appearance);
					// console.log(lifterAppearance);

					if (currentAttempt._appearance._id === lifterAppearance._id) {
						console.log('addingcurrentlift')
						className += ' current-lifter';
						if (column.id.substr(attemptCellPrefix.length) === currentAttempt.attemptName) {
							className += ' current-lift';
						}
					}
				} else {
					console.log('no currentattempt');
				}

				
				return className;
			})(),
			onClick: e => {
				if (column.id.substr(0, attemptCellPrefix.length) === attemptCellPrefix) {
					// const lifter = rowInfo.original;
					// const attemptName = column.id.substr(attemptCellPrefix.length);
					tdClick(attempt);
				} else if (column.id === 'compName') {
					competitionClick(rowInfo.original);
				}
			}
		}
	}

	function getTrProps(state, rowInfo, column, instance) {
		return {
			className: (() => {
				let className = '';
				const lifterAppearance = rowInfo.original;

				if (currentAttempt) { 
					if (currentAttempt._appearance._id === lifterAppearance._id) {
						className += ' current-lifter';
					}
				}
				return className;
			})()
		};
	}

	return (
		<ReactTable
			data={appearances.sort(sortComps)}
			columns={columns} 
			sortable={false}
			resizable={false}
			showPagination={false}
			minRows={0}
			defaultPageSize={100}
			getTdProps={getTdProps}
			getTrProps={getTrProps}
		/>

	)

	
}