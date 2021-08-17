import React from 'react';
import './App.scss';
import { createApiClient, Ticket } from './api';
import { TLSSocket } from 'tls';
import axios from 'axios';
import { APIRootPath } from '@fed-exam/config';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	hidden: string[]
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		hidden: [],
		tickets: []
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getTickets()
		});
	}

	onHideClick = (id: string) => {
		this.setState({ hidden: this.state.hidden.concat(id) })
	}

	onRestoreClick = () => {
		this.setState({ hidden: [] })
	}

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => {
				const isSearchMatch = (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase())
				const isHidden = this.state.hidden.includes(t.id)

				return isSearchMatch && !isHidden
			})


		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (
				<li key={ticket.id} className='ticket'>
					<h5 className='title'>{ticket.title}</h5>
					<p className='content'>{ticket.content}</p>
					<footer>
						<div className='meta-data'>By {ticket.userEmail} | {new Date(ticket.creationTime).toLocaleString()}</div>
						<div className='labels'>
							{ticket.labels && ticket.labels.map((label, index) => <span key={index} className='label'>{label}</span>)}
						</div>
					</footer>
					<span onClick={() => this.onHideClick(ticket.id)} className='hide-button'>Hide</span>
				</li>))}
		</ul>);
	}


	onSearch = async (val: string, newPage?: number) => {

		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			const response = await axios.get(`${APIRootPath}?search=${val}`)
			this.setState({ tickets: response.data })
		}, 300);
	}



	render() {
		const { tickets, hidden } = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)} />
			</header>
			{tickets ?
				<div className='results'>Showing {tickets.length} results {hidden.length > 0 ? <i>({hidden.length} hidden tickets - <span onClick={this.onRestoreClick} className='restore-button'>restore</span>)</i> : null}</div>
				: null
			}
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;