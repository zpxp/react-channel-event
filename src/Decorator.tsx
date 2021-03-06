import * as React from "react";
import { ChannelEventContext, IChannelEventContext } from "./ContextProvider";
import { IChannel } from "channel-event";
import { IChannelMessage } from "channel-event/lib/channel";

const defaultconf = {
	pure: true,
	forwardRef: true
};

function ChannelEventImpl<P extends ChannelProps, T extends ReactComponent<P> = ReactComponent<P>>(Comp: T, conf: IConf) {
	conf = { ...defaultconf, ...conf };
	const base = conf.pure ? React.PureComponent : React.Component;

	class ChannelEvent extends base<P & { _internal_ref: any }, { channel: IChannel }> {
		static _CHANNEL_EVENT = true;

		static contextType = ChannelEventContext;
		context: IChannelEventContext;

		constructor(props: P & { _internal_ref: any }, context: IChannelEventContext) {
			super(props);
			this.state = {
				channel: context && context.hub && context.hub.newChannel(conf.channelId)
			};
		}

		render() {
			const El = Comp as any;
			const { _internal_ref, ...props } = this.props;
			return <El {...props} channel={this.state.channel} ref={_internal_ref} />;
		}

		componentWillUnmount() {
			const chan = this.state.channel;
			if (chan) {
				setTimeout(() => {
					chan.dispose();
				});
			}
		}
	}

	return conf.forwardRef ? React.forwardRef((props, ref) => <ChannelEvent {...(props as any)} _internal_ref={ref} />) : ChannelEvent;
}

/**
 * A decorator to automaticaly inject a `Channel` into `props.channel` of the decorated compontent.
 * Handles disposing the channel automaticaly
 * @param conf
 */
export function ChannelEvent(conf?: IConf) {
	return function <P extends ChannelProps, T extends ReactComponent<P>>(component: T): T {
		return (ChannelEventImpl(component, conf) as any) as T;
	};
}

interface IConf {
	pure?: boolean;
	forwardRef?: boolean;
	/**
	 * ID for `IChannel`. Allows two way communication in `IChannel.send` and `IChannel.listen`
	 */
	channelId?: string;
}

export interface ChannelProps<Actions extends { [type: string]: IChannelMessage<any> } = any> {
	channel?: IChannel<Actions>;
}

type ReactComponent<P = any, S = any> = new (props: P, context?: any) => React.Component<P, S>;
