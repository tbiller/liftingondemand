import React from 'react';
import ReactTable from 'react-table';
import Lights from './Lights';
import 'react-table/react-table.css';
import '../styles/components/ResultsTable.css';

// import ResultsTableHeader from './ResultsTableHeader';
// import ResultsTableBody from './ResultsTableBody';

export default function({
	results,
	tdClick,
	lifterClick,
	currentAttempt,
	shouldShowResult,
	autoPlayingLifters,
	leaderboardType,
	currentTotalForLifter,
	loading,
	division,
	hasFinishedResults
}) {
	const showCompressed = window.innerWidth < 800;
	const minAttemptWidth = showCompressed ? 40 : 50;
	const live = (leaderboardType === 'live');
	// const hasFinishedResults = results[0].hasFinishedResults(division);

	const columns = [
		{Header: 'Pl.', id: 'place', accessor: (d) => d.place(division), minWidth: 20, show: hasFinishedResults && !live && !showCompressed},
		{Header: 'Flt.', accessor: 'flight', sortMethod: sortStrings, minWidth: 25, show: false},
		{Header: 'Lot', accessor: 'lot', sortMethod: sortStrings, minWidth: 25, show:false},
		{Header: 'Lifter', accessor: '_lifter.name', id: 'name', sortMethod: sortStrings, minWidth: 110, Cell:nameCell},
		{Header: 'Team', accessor: 'team', sortMethod: sortStrings, minWidth: 40, show: showTeam() },
		{Header: 'Bwt.', id:'bodyweight', accessor: (d) => (+d.bodyweight).toFixed(1), minWidth: 40, show: hasFinishedResults && !showCompressed},
		{Header: formatAttemptHeader('SQ #1'), className: 'border-left squat', headerClassName: 'border-left squat', accessor: 'attempts.Squat 1', minWidth: minAttemptWidth, Cell: attemptCell, show:shouldShow('Squat', 1)},
		{Header: formatAttemptHeader('SQ #2'), className: 'squat', headerClassName:'squat', accessor: 'attempts.Squat 2', minWidth: minAttemptWidth, Cell: attemptCell, show:shouldShow('Squat', 2)},
		{Header: formatAttemptHeader('SQ #3'), className: 'squat',  headerClassName:'squat', accessor: 'attempts.Squat 3', minWidth: minAttemptWidth, Cell: attemptCell, show:shouldShow('Squat', 3)},
		{Header: formatAttemptHeader('BP #1'), className: 'border-left bench', headerClassName: 'border-left bench', accessor: 'attempts.Bench 1', minWidth: minAttemptWidth, Cell: attemptCell,  show:shouldShow('Bench', 1)},
		{Header: formatAttemptHeader('BP #2'), className: 'bench',  headerClassName:'bench', accessor: 'attempts.Bench 2', minWidth: minAttemptWidth, Cell: attemptCell, show:shouldShow('Bench', 2)},
		{Header: formatAttemptHeader('BP #3'), className: 'bench',  headerClassName:'bench', accessor: 'attempts.Bench 3', minWidth: minAttemptWidth, Cell: attemptCell, show:shouldShow('Bench', 3)},
		{Header: formatAttemptHeader('DL #1'), className: 'border-left deadlift', headerClassName: 'border-left deadlift', accessor: 'attempts.Deadlift 1', minWidth: minAttemptWidth, Cell: attemptCell, show:shouldShow('Deadlift', 1)},
		{Header: formatAttemptHeader('DL #2'), className: 'deadlift',  headerClassName:'deadlift', accessor: 'attempts.Deadlift 2', minWidth: minAttemptWidth, Cell: attemptCell, show:shouldShow('Deadlift', 2)},
		{Header: formatAttemptHeader('DL #3'), headerClassName: 'border-right deadlift', className: 'border-right deadlift', accessor: 'attempts.Deadlift 3', minWidth: minAttemptWidth, Cell: attemptCell, show:shouldShow('Deadlift', 3)},
		{Header: live ? (showCompressed ? 'Tot.' : 'Current') : 'Total', id: 'total', accessor: '', minWidth: minAttemptWidth, Cell: totalCell, show: hasFinishedResults},
		{Header: 'Proj.', accessor: '', id: 'projected', minWidth: minAttemptWidth, Cell:  projectedTotalCell, show:live && !showCompressed && hasFinishedResults}
	];
	function formatAttemptHeader(header) {
		if (!showCompressed) return header;

		return header.replace('#', '');
	}
	function showTeam() {
		for (let i = 0; i < results.length; i++) {
			if (results[i].team) {
				return true;
			}
		}
		return false;
	}

	function shouldShow(liftName, attemptNumber) {
		if (!showCompressed) return true;
		if (!currentAttempt && liftName.toLowerCase() === 'squat') return true;
		if (live) {
			if(+attemptNumber === 1) return true;
		} else {
			if(+attemptNumber === 3) return true;
		}
		if (currentAttempt) if (currentAttempt.liftName.toLowerCase() === liftName.toLowerCase()) return true;
		return false;
	}


	function showWeight(weightStr) {
		if (isNaN(parseFloat(weightStr, 10))) {
			return weightStr;
		}
	}

	function nameCell(props) {
		let lifter = props.original;
		let autoPlaying = false;

		if (autoPlayingLifters.indexOf(lifter) !== -1) {
			autoPlaying = true;
		}

		return (
		<div>
			<span>{props.value}</span>
			{autoPlaying &&
				<div className='auto-playing'>AutoPlaying</div>
			}
		</div>
		);
	}

	function projectedTotalCell(cell) {
		const lifter = cell.value;
		const weight = lifter.totalAsOf(currentAttempt, true).total;
		const records = null;
		const showRecords = false;

		return weightCell(weight, records, 'total', showRecords);
	}

	function totalCell(cell) {
		const lifter = cell.value;
		const weight = live ? lifter.totalAsOf(currentAttempt).total : lifter.total.weight
		const records = lifter.total.records;
		const showRecords = lifter.total.weight === weight;

		return weightCell(weight, records, 'total', showRecords);
	}

	function attemptCell(cell) {
		const attempt = cell.value;
		if (!attempt) return null;
		const hasBeenCompleted = !live ? true : attempt.hasOccurredAsOf(currentAttempt);
		const hasBeenSubmitted = !live ? true : attempt.hasBeenSubmittedAsOf(currentAttempt);
		const shouldShow = hasBeenCompleted || hasBeenSubmitted;
		const showRecords = !!attempt.records;
		let className = 'weight-cell ' + attempt.result + (!hasBeenCompleted ? ' uncompleted' : '');

		if (!shouldShow) {
			return <span className={className}></span>;
		}

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

	function getTrProps(state, rowInfo, column, instance) {
		return {
			className: (() => {
				let className = '';
				const lifterAppearance = rowInfo.original;

				if (currentAttempt && lifterAppearance.videoId !== currentAttempt._appearance.videoId) {
					className += ' hidden';
				}
				if (currentAttempt) {
					// const liftAttempt = column
					if (currentAttempt._appearance === lifterAppearance) {
						className += ' current-lifter';
					}
				}
				return className;
			})()
		};
	}

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
				}
				if (currentAttempt) {
					if (currentAttempt._appearance === lifterAppearance) {
						className += ' current-lifter';
						if (column.id.substr(attemptCellPrefix.length) === currentAttempt.attemptName) {
							className += ' current-lift';
						}
					}
				} else {
				}
				return className;
			})(),
			onClick: (e) => {
				const lifterNameId = 'name';
				if (column.id.substr(0, attemptCellPrefix.length) === attemptCellPrefix) {
					// const lifter = rowInfo.original;
					// const attemptName = column.id.substr(attemptCellPrefix.length);
					tdClick({attempt: attempt});
				} else if (column.id === lifterNameId) {
					const lifter = rowInfo.original;
					lifterClick(lifter);
				}
			},
			// onMouseOver: (e) => {
			// 	if (!e.target.classList.contains('lift')) return false;
			// 	//console.log(e.target);
			// 	const left  = e.clientX + 10 + "px";
   //  			const top  = e.clientY -20  + "px";
   //  			const overlay = document.getElementsByClassName('mouse-overlay')[0];
   //  			overlay.style.left = left;
   //  			overlay.style.top = top;
   //  			overlay.classList.remove('hidden');
   //  			// e.preventDefault();
   //  			// debugger;
   //  			e.stopPropagation();
			// }
		}
	}

	return (
		<div>
			<ReactTable
				data={results}
				columns={columns}
				sortable={false}
				resizable={false}
				showPagination={false}
				minWidth={20}
				minRows={0}
				defaultPageSize={100}
				loading={loading}
				noDataText='No data found.'
				// defaultSortMethod={sortWeights}
				getTdProps={getTdProps}
				getTrProps={getTrProps}
			/>
		</div>
	)


}
