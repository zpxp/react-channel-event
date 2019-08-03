import * as React from "react";
import { ChannelEventContext, IChannelEventContext } from "./ContextProvider";
import { Channel } from "channel-event";

const defaultconf = {
	pure: true,
	forwardRef: false
};

function ChannelEventImpl<P extends ChannelProp, T extends ReactComponent<P> = ReactComponent<P>>(Comp: T, conf: IConf) {
	conf = { ...defaultconf, ...conf };
	const base = conf.pure ? React.PureComponent : React.Component;

	class ChannelEvent extends base<P, { channel: Channel }> {
		static _CHANNEL_EVENT = true;

		static contextType = ChannelEventContext;
		context: IChannelEventContext;

		constructor(props: P, context: IChannelEventContext) {
			super(props);
			this.state = {
				channel: context.hub.newChannel(conf.channelId)
			};
		}

		render() {
			const El = Comp as any;
			return <El {...this.props} channel={this.state.channel} />;
		}

		componentWillUnmount() {
			this.state.channel.dispose();
		}
	}

	return conf.forwardRef
		? React.forwardRef((props, ref) => <ChannelEvent {...props as any} forwardedRef={(props as any).forwardedRef || ref} />)
		: ChannelEvent;
}

/**
 * A decorator to automaticaly inject a `Channel` into `props.channel` of the decorated compontent.
 * Handles disposing the channel automaticaly
 * @param conf
 */
export function ChannelEvent(conf?: IConf) {
	return function<P extends ChannelProp, T extends ReactComponent<P>>(component: T): T {
		return (ChannelEventImpl(component, conf) as any) as T;
	};
}

interface IConf {
	pure?: boolean;
	forwardRef?: boolean;
	channelId?: string;
}

export interface ChannelProp {
	channel: Channel;
}

type ReactComponent<P = any, S = any> = new (props: P, context?: any) => React.Component<P, S>;
