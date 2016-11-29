const EventEmitter = require('events');
const pubsubhubbub = require('pubsubhubbub');
const xml = require('xml2js');

const defaultOptions = {
	secretKey: 'replace me!',
	hubCallback: undefined,
	hubPort: 9001,
	hubUrl: 'http://pubsubhubbub.appspot.com/'
};

const topicBase = 'http://www.youtube.com/xml/feeds/videos.xml?channel_id=';

function handleFeed(yw, data) {
	xml.parseString(data.feed.toString('utf-8'), (err, res) => {
		if (err) {
			yw.emit('error', err);
			return;
		}
		if (!res.feed.hasOwnProperty('entry')) {
			// this is a deleted video?
			// TODO: emit deleted video event
			return;
		}

		let channelId = res.feed.entry[0]['yt:channelId'][0],
			videoId = res.feed.entry[0]['yt:videoId'][0],
			author = res.feed.entry[0]['author'][0].name[0],
			title = res.feed.entry[0]['title'][0],
			published = res.feed.entry[0]['published'][0];

		yw.emit('notified', {
			channelId: channelId,
			videoId: videoId,
			author: author,
			title: title,
			published: published,
		});
	});
}

class YouTubeWatch extends EventEmitter {
	constructor(options = defaultOptions) {
		Object.keys(defaultOptions).forEach(key => {
			if (!options.hasOwnProperty(key)) {
				options[key] = defaultOptions[key];
			}
		});

		super();
		this.options = options;
		this.hub = pubsubhubbub.createServer({
			callbackUrl: options.hubCallback,
			secret: options.secretKey
		});
		this.hub.on('error', err => self.emit('error', err));
		this.hub.on('feed', data => handleFeed(this, data));
		this.hub.on('denied', data => this.emit('error', new Error(data)));
	}
	start() {
		if (this.hub.server && this.hub.server.listening) {
			this.emit('error', new Error('YouTubeWatch has already been started'));
			return;
		}
		this.hub.listen(this.options.hubPort, () => this.emit('start'));
	}
	stop() {
		if (this.hub.server && !this.hub.server.listening) {
			this.emit('error', new Error('YouTubeWatch has not been started'));
			return;
		}
		this.hub.server.close(() => this.emit('stop'));
	}
	watch(channels = []) {
		if (!Array.isArray(channels)) {
			channels = [channels];
		}

		channels.forEach(c => {
			let topic = topicBase + c;

			this.hub.subscribe(topic, this.options.hubUrl,
				err => this.emit('watch', err));
		});
	}
	unwatch(channels = []) {
		if (!Array.isArray(channels)) {
			channels = [channels];
		}

		channels.forEach(c => {
			let topic = topicBase + c;

			this.hub.unsubscribe(topic, this.options.hubUrl,
				this.options.hubCallback, err => this.emit('unwatch', err));
		});
	}
}

module.exports = YouTubeWatch;

