const YouTubeWatch = require('./index');

const yw = new YouTubeWatch({
	hubCallback: 'http://dev.sysdevs.org:9005',
	hubPort: 9005,
});

yw.on('error', err => console.log('YouTubeWatch error:', err));
yw.on('start', () => {
	let channels = ['UCY_UYz9m6XYmCpqC5EuqKMg',
					'UCGY2w6hIZWwyxasBUN7wbaQ'];

	yw.watch(channels);
});

yw.on('notified', video => {
	console.log(video.author, 'just uploaded a video called:', video.title);
});

yw.on('watch', err => {
	if (err) {
		return console.log('watch error:', err);
	}
	console.log('watching channel');
});

yw.on('unwatch', err => {
	if (err) {
		return console.log('unwatch error:', err);
	}
	console.log('unwatching channel');
});

yw.start();

