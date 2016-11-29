# youtube-watch
youtube-watch is a basic wrapper for [Pubsubhubbub](https://github.com/pubsubhubbub/). It allows you to efficiently receive YouTube notifications when your favorite channels upload, modify, or delete a video.

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

