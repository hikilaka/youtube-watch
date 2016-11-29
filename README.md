# youtube-watch
youtube-watch is a basic wrapper for [Pubsubhubbub](https://github.com/pubsubhubbub/). It allows you to efficiently receive YouTube notifications when your favorite channels upload, modify, or delete a video.

This release only supports notifications when a video is uploaded.

## Install
Installation is easy with npm
```bash
npm install youtube-watch
```

## Example
```javascript
const YouTubeWatch = require('youtube-watch');

const yw = new YouTubeWatch({
	secretKey: 'something_unique',
	hubCallback: 'http://your-ip-or-domain/',
	hubPort: 9001,
});

yw.on('start', () => {
    let channels = ['UCY_UYz9m6XYmCpqC5EuqKMg',
                    'UCGY2w6hIZWwyxasBUN7wbaQ'];

    yw.watch(channels);
});

yw.on('notified', video => {
	console.log(`${video.author} just uploaded a new video titled: ${video.title}`);
});

yw.start();
```

## Events
  * **'start'** - The service is available to begin watching feeds.
  * **'stop'** - The service is no longer available to watch feeds.
  * **'watch'** - A channel has been verified to begin receiving notifications.
  * **'unwatch'** - A channel has been verified to stop receiving notifications.
  * **'notified'**(*video*) - A channel has uploaded/modified/deleted a video.
    * *video* is an object which contains the following properties: *channelId*, *videoId*, *author*, *title*, and *published*.
  * **'error'**(*err*) - An error has occurred.
    * *err* is an Error object.

## API
### YouTubeWatch.constructor(*options*)
*options* is an object that you may write your own properties to.
The following properties are read by YouTubeWatch:
  * **secret** - A private key used by Pubsubhubbub, it is not required to include this property but it is highly recommended that you do. Defaults to *'change me!'*
  * **hubCallback** - Your ip/domain name that will be used as a callback URL by Pubsubhubbub. It *must* be in a URL format, *ex: 'http://example.com/'*. This is a __required__ property as the default is undefined.
  * **hubPort** - The port Pubsubhubbub will listen on. This must be an open port on your system. Defaults to port *9001*.
  * **hubUrl** - The URL in which we listen to updates from. This shouldn't be changed unless you know what you're doing.

### YouTubeWatch.start()
This function will start the internal service used by Pubsubhubbub. If the service successfully starts up then the *start* event is emitted otherwise the *error* event is. Once the *start* event has been sent you may begin to watch for channel updates via the *YouTubeWatch.watch()* function. If this function is called while the service has already been start an error is emitted.
### YouTubeWatch.stop()
This functions will stop the internal service. After it has been stopped a *stop* event is emitted. If the service is not running and this function is called then an error is emitted.
### YouTubeWatch.watch(channels=[])
Watches a list of channels IDs. Channels may either be a string or an array of strings. After each successful channel has been verified to receive updates a *watch* event is ommited.
### YouTubeWatch.unwatch(channels=[])
Removes the watch state from a list of channel IDs. Channels may either be a string or an array of strings. After each successful channel has been verified to stop receiving updates an *unwatch* event is ommited.

## License
Copyright (c) 2016 SysDevs

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.
