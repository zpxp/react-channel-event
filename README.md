# react-channel-event

`yarn add react-channel-event`

`npn install react-channel-event`

React Component decorator and context provider to expose a `channel-event` `hub` to components.

``` tsx

import { EventChannel, ChannelProp } from "react-channel-event";
import { take, fork } from "channel-event";


@EventChannel()
export default class MyComponent extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			count: 0
		};

		const instance = this;

		function* forked(num: number) {
			console.log(`fork num: ${num}`);
			while (true) {
				let data = yield take("test");
				console.log(data);
				instance.setState(prev => ({
					count: prev.count + 1
				}))
			}
		}

		this.props.channel.runGenerator(function*() {
			let forks = 0;
			while (true) {
				yield take("test");
				forks++;
				yield fork(forked, forks);
			}
		});

	}

	render() {
		return (
			<div>
				<button onClick={() => this.props.channel.send("test", 22)}>send event</button>
				{this.state.count}
			</div>
		);
	}
}

interface Props extends ChannelProp {}

interface State {
	count: number
}


```