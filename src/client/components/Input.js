import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'style-loader!./input.less';


class Input extends Component {
	constructor(props) {
		super(props);

		this.state = {
			value: props.value,
		};

		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {

	}

	onBlur(ev) {
		if (this.props.onBlur) {
			this.props.onBlur(this.state.value);
		}
	}
	onFocus(ev) {
		if (this.props.onFocus) {
			this.props.onFocus(this.state.value);
		}
	}

	onChange(ev) {
		const { value } = ev.target;
		this.setState({ value }, () => {
			if (this.props.onChange) {
				this.props.onChange(value);
			}
		});
	}

	render() {
		const {
			className, placeholder, disabled, readOnly,
		} = this.props;

		return (
			<div className={`comp-input-box ${className}`}>
				<div className={`comp-input-group ${disabled ? 'disabled' : ''} ${readOnly ? 'readonly' : ''}`}>
					<input
						className={'comp-input'}
						onChange={this.onChange}
						value={this.state.value}
						placeholder={placeholder}
						disabled={disabled}
						readOnly={readOnly}
						onFocus={this.onFocus}
						onBlur={this.onBlur}
					/>
				</div>
			</div>
		);
	}
}

Input.propTypes = {
	className: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
	readOnly: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
};

Input.defaultProps = {
	className: '',
	value: '',
	placeholder: null,
	disabled: false,
	readOnly: false,
	onFocus: () => {},
	onBlur: () => {},
};

export default Input;
