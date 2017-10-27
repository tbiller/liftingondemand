import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../styles/components/ResultsTable.css';


// import ResultsTableHeader from './ResultsTableHeader';
// import ResultsTableBody from './ResultsTableBody';

export default function({
	appearances, 
	competitionClick,
	tdClick, 
	currentAttempt,
}) {
	const showCompressed = window.innerWidth < 800;
	const dateOptions = {year: 'numeric', month: 'numeric'};
	const minAttemptWidth = showCompressed ? 40: 50;

	const columns = [
		{Header: 'Date', id: 'date', minWidth: 60, accessor: (d) => new Date(d._competition.dateForSorting).toLocaleString('en-US', dateOptions), show: !showCompressed},
		{Header: 'Competition Name', id: 'compName', accessor: (d) => formatName(d._competition.name), minWidth: 120},
		{Header: 'Bwt.', id: 'bodyweight', accessor: (d) => (+d.bodyweight).toFixed(2), minWidth: 40, show: !showCompressed},
		{Header: 'Pl.', id: 'place', accessor: (d) => d.place() /*=== '-' ? '-' : +d.place*/, minWidth: 25, show: !showCompressed},
		{Header: 'Div.', id: 'division', accessor: (d) => d.division(), minWidth: 40, show: !showCompressed},
		{Header: formatAttemptHeader('SQ #1'), className: 'border-left squat', headerClassName: 'border-left squat', accessor: 'attempts.Squat 1', minWidth: minAttemptWidth, Cell: attemptCell, show: shouldShow('Squat', 1)},
		{Header: formatAttemptHeader('SQ #2'), className: 'squat', headerClassName: 'squat', accessor: 'attempts.Squat 2', minWidth: minAttemptWidth, Cell: attemptCell, show: shouldShow('Squat', 2)}, 
		{Header: formatAttemptHeader('SQ #3'), className: 'squat', headerClassName: 'squat', accessor: 'attempts.Squat 3', minWidth: minAttemptWidth, Cell: attemptCell, show: shouldShow('Squat', 3)}, 
		{Header: formatAttemptHeader('BP #1'), className: 'border-left bench', headerClassName: 'border-left bench', accessor: 'attempts.Bench 1', minWidth: minAttemptWidth, Cell: attemptCell, show: shouldShow('Bench', 1)},
		{Header: formatAttemptHeader('BP #2'), className: 'bench', headerClassName: 'bench',accessor: 'attempts.Bench 2', minWidth: minAttemptWidth, Cell: attemptCell, show: shouldShow('Bench', 2)}, 
		{Header: formatAttemptHeader('BP #3'), className: 'bench', headerClassName: 'bench',accessor: 'attempts.Bench 3', minWidth: minAttemptWidth, Cell: attemptCell, show: shouldShow('Bench', 3)}, 
		{Header: formatAttemptHeader('DL #1'), className: 'border-left deadlift', headerClassName: 'border-left deadlift', accessor: 'attempts.Deadlift 1', minWidth: minAttemptWidth, Cell: attemptCell, show: shouldShow('Deadlift', 1)},
		{Header: formatAttemptHeader('DL #2'), className: 'deadlift', headerClassName: 'deadlift',accessor: 'attempts.Deadlift 2', minWidth: minAttemptWidth, Cell: attemptCell, show: shouldShow('Deadlift', 2)}, 
		{Header: formatAttemptHeader('DL #3'), headerClassName: 'border-right deadlift', className: 'border-right deadlift', accessor: 'attempts.Deadlift 3', minWidth: minAttemptWidth, Cell: attemptCell, show: shouldShow('Deadlift', 3)}, 
		{Header: 'Total', id: 'total', accessor: '', minWidth: minAttemptWidth, Cell: totalCell},
		{Header: 'Wilks', accessor: 'wilks', minWidth: minAttemptWidth, show: !showCompressed}
	];

	function sortComps(appA, appB) {
		return new Date(appB._competition.dateForSorting) - new Date(appA._competition.dateForSorting);
	}

	function showWeight(weightStr) {
		if (isNaN(parseFloat(weightStr, 10))) {
			return weightStr;
		}
	}
	function formatName(compName) {
		const maxLetters = 18;
		const shortenedName = compName.substr(0, maxLetters);
		return shortenedName + (compName.length > maxLetters ? '...' : '');
	}

	function formatAttemptHeader(header) {
		if (!showCompressed) return header;
		
		return header.replace('#', '');
	}
	function shouldShow(liftName, attemptNumber) {
		if (!showCompressed) return true;
		if (!currentAttempt && liftName.toLowerCase() === 'squat') return true;
		if (+attemptNumber === 3) return true;
		if (currentAttempt) if (currentAttempt.liftName.toLowerCase() === liftName.toLowerCase()) return true;
		return false;
	}


	function totalCell(cell) {
		const lifter = cell.value;
		const weight = lifter.total.weight;
		const records = lifter.total.records;
		const showRecords = lifter.total.weight === weight;

		return weightCell(weight, records, 'total', showRecords);
	}

	function attemptCell(cell) {
		const attempt = cell.value;
		if (!attempt) return '';

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

	//console.log('rerendering with currentAttempt:')
	//console.log(currentAttempt);
	function getTdProps(state, rowInfo, column, instance) {
		const attemptCellPrefix = 'attempts.';
		const lifterAppearance = rowInfo.original;
		const lifter = lifterAppearance._lifter;
		const attempt = rowInfo.row[column.id];
		return {
			className: (() => {
				let className = '';
				if (!attempt) return '';
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
					// //console.log(currentAttempt._appearance);
					// //console.log(lifterAppearance);

					if (currentAttempt._appearance._id === lifterAppearance._id) {
						//console.log('addingcurrentlift')
						className += ' current-lifter';
						if (column.id.substr(attemptCellPrefix.length) === currentAttempt.attemptName) {
							className += ' current-lift';
						}
					}
				} else {
					//console.log('no currentattempt');
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
			className='lifter-table'
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