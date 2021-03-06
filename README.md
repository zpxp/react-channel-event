# react-channel-event

React Component decorator and context provider to expose a `channel-event` `IHub` to children components.

![Bundlephobia gzip + minified](https://badgen.net/bundlephobia/minzip/react-channel-event)

### Installation

`yarn add react-channel-event`

`npn install react-channel-event`


### Use

First, wrap your app with the `<ChannelEventProvider>` context element.

``` tsx

			<ChannelEventProvider>
				<App />
			</ChannelEventProvider>

```

Alternatively, you can wrap individial pages/sections with `<ChannelEventProvider>` to 'jail' events to those pages/sections only. An event will only be sent to components that exist under the same `<ChannelEventProvider>` context.


``` tsx

import { ChannelEvent, ChannelProps } from "react-channel-event";
import { take, fork } from "channel-event";


@ChannelEvent()
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

interface Props extends ChannelProps {}

interface State {
    count: number
}


```
