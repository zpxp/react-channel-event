import * as React from "react";
import { createHub, IHub } from "channel-event";

const win: any = window;

win["react-channel-event"] = win["react-channel-event"] || {};

if (!win["react-channel-event"].context) {
	// store the context on the window object so if multiple copies of the lib exist in node modules, context still behaves correctly
	win["react-channel-event"].context = React.createContext<IChannelEventContext>({} as any);
}
/** Context to hold global channel hub */
export const ChannelEventContext = win["react-channel-event"].context;

/**
 * React context to provide a global `hub` to child components
 */
export class ChannelEventProvider extends React.PureComponent<Props, State> {
	hub: IHub;
	constructor(props: {}) {
		super(props);

		this.hub = createHub();

		this.state = {
			context: this.props.hub !== undefined ? { hub: this.props.hub } : { hub: this.hub }
		};
	}

	componentWillUnmount() {
		this.hub.dispose();
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.hub !== prevProps.hub) {
			this.setState({ context: { hub: this.props.hub } });
		}
	}

	render() {
		return <ChannelEventContext.Provider value={this.state.context}>{this.props.children}</ChannelEventContext.Provider>;
	}
}

export interface IChannelEventContext {
	/** Override built in hub with supplied instance */
	hub: IHub;
}

interface State {
	context: IChannelEventContext;
}

interface Props {
	hub?: IHub;
}
