import * as React from "react";
import { Hub, createHub } from "channel-event";

const hub = createHub();
const context = { hub };

/** Context to hold global channel hub */
export const ChannelEventContext = React.createContext<IChannelEventContext>(context);


/**
 * React context to provide a global `hub` to child components
 */
export class ChannelEventProvider extends React.PureComponent<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			context: context
		};
	}

	render() {
		return <ChannelEventContext.Provider value={this.state.context}>{this.props.children}</ChannelEventContext.Provider>;
	}
}

export interface IChannelEventContext {
	hub: Hub;
}

interface State {
	context: IChannelEventContext;
}

export const addGeneratorMiddleware: typeof hub.addGeneratorMiddleware = hub.addGeneratorMiddleware;
