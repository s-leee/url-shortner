import React, { Component } from 'react';
import { Tooltip } from 'reactstrap';
import update from 'immutability-helper';
import Input from 'Components/Input';
import API from 'Network/Api';
import Util from 'Utils/Util';

import 'style-loader!./app.less';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			originalUrl: '',
			showErrorMsg: false,
			errorMsg: '',
			showShortenedUrl: false,
			shortenedUrl: '',
			urlList: [],
			showTooltip: [],
		};

		this.getShortenedUrlList = this.getShortenedUrlList.bind(this);
		this.onClickShortenBtn = this.onClickShortenBtn.bind(this);
		this.getUrlShortenView = this.getUrlShortenView.bind(this);
		this.getUrlListView = this.getUrlListView.bind(this);
		this.handleError = this.handleError.bind(this);
	}

	componentDidMount() {
		console.log('[App] componentDidMount');
		// fetch a list of existing shortened urls
		this.getShortenedUrlList();
	}

	onClickShortenBtn(ev) {
		if (this.state.originalUrl === '') {
			this.setState({
				showErrorMsg: true,
				errorMsg: 'The given url should not be empty.',
			});
		} else if (!Util.isValidUrl(this.state.originalUrl)) {
			this.setState({
				showErrorMsg: true,
				errorMsg: 'The given url is not valid.',
			});
		} else {
			const { url, method } = API.SET_SHORTENED_URL;
			const { hostname, port } = window.location;
			return fetch(url, {
				method,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					originalUrl: this.state.originalUrl,
					baseUrl: hostname + ':' + port,
				}),
			}).then(response => response.json())
				.then((responseJson) => {
					console.log('SET_SHORTENED_URL result: ', responseJson);
					if (responseJson.errorCode) {
						this.handleError(responseJson);
					} else {
						const { shortenedUrl } = responseJson;
						this.setState({
							showShortenedUrl: true,
							shortenedUrl,
						});
						// update the current shortened url list
						this.getShortenedUrlList();
					}
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}

	getShortenedUrlList() {
		return fetch(API.GET_SHORTENED_URL_LIST.url)
			.then(response => response.json())
			.then((responseJson) => {
				console.log('GET_SHORTENED_URL_LIST result: ', responseJson);
				if (responseJson.errorCode) {
					this.handleError(responseJson);
				} else {
					const { result } = responseJson;
					if (result.length > 0) {
						this.setState({ urlList: result });
					}
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}

	getUrlShortenView() {
		return (
			<div className="row shorten-container">
				<div className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1 col-md-10 offset-md-1 col-sm-12">
					<div className="input-area">
						<Input
							className="shorten-input"
							value={this.state.originalUrl}
							placeholder="Type in a link to shorten it"
							onChange={(value) => {
								if (value !== '') {
									this.setState({
										originalUrl: value,
										showErrorMsg: false,
										showShortenedUrl: false,
									});
								} else {
									this.setState({ originalUrl: value });
								}
							}}
						/>
						<button className="btn btn-primary" onClick={this.onClickShortenBtn}>Shorten</button>
					</div>
					{this.state.showShortenedUrl && <div>Shortened URL: <a target="_blank" href={this.state.shortenedUrl} className="shortened-url">{this.state.shortenedUrl}</a></div>}
					{this.state.showErrorMsg && <div className="error-msg">{this.state.errorMsg}</div>}
				</div>
			</div>
		);
	}

	getUrlListView() {
		return (
			<div className="row url-list-container">
				<div className="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1 col-md-10 offset-md-1 col-sm-12">
					<div>List of shortened URLs (hover your mouse to find out details): <br/></div>
					{this.state.urlList.map((item, idx) => {
						const { originalUrl, shortenedUrl, createdAt } = item;
						return (
							<div className="url-list-row" key={`url-list-row-${idx}`}>
								<div>{idx + 1}</div>
								<a id={`url-tooltip-${idx}`} className="url-link" target="_blank" href={shortenedUrl}>{shortenedUrl}</a>
								<Tooltip
									placement="right"
									isOpen={this.state.showTooltip[idx]}
									target={`url-tooltip-${idx}`}
									toggle={() => this.setState((prevState, props) => {
										return { showTooltip: update(this.state.showTooltip, {[idx]:{ $set: !prevState.showTooltip[idx] }}) }
									})}>
									<div>
										<div>{`Original URL: ${originalUrl}`}</div>
										<div>{`Created At: ${createdAt}`}</div>
									</div>
								</Tooltip>
							</div>
						);
					})}
					{this.state.urlList.length === 0 && <div>**There is no shortened url**</div>}
				</div>
			</div>
		);
	}

	handleError(error) {
		switch (error.errorCode) {
		case 412:
			alert(error.errorText);
			break;
		default:
			alert("Something went wrong");
		}
	}

	render() {
		return (
			<div className="app-container">
				{this.getUrlShortenView()}
				{this.getUrlListView()}
			</div>
		);
	}
}

export default App;
