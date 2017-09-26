import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import '../styles/components/OptionSelect.css';


export default function({
	optionChange, 
	title,
	options,
	initialValue,
	optionType,
}) {

	function valueChanged(val) {
		optionChange(optionType, val.value);
	}

	const value = initialValue || (options.length > 0 ? options[0] : '');
	return (
		<div className='option-select'>
			{title &&
				<div className='option-title'>{title}</div>
			}
			<Select 
				value={value}
				options={options}
				onChange={valueChanged}
				clearable={false}
				searchable={false}
			/>
		</div>
	);
}
