window.onload = () => {

	const { Howler, Howl } = require('howler');
	const mm = require('music-metadata');
	const { remote } = require('electron');
	let browserWindow = remote.getCurrentWindow();

	// Get ready to play
	let sound = new Howl({
		src: ['C:\\Users\\Kevin Long\\Documents\\GitHub\\audioplayer\\src\\music\\Olivia Rodrigo - drivers license.mp3'],
		volume: 1.5
	});

	// Get and load the basic metadata
	(async () => {
		try {
			const { common } = await mm.parseFile('C:\\Users\\Kevin Long\\Documents\\GitHub\\audioplayer\\src\\music\\Olivia Rodrigo - drivers license.mp3');
			document.querySelector("#trackName").textContent = common.title;
			document.querySelector("#artistName").textContent = common.artists.toString().replace(/(.),(.)/gm, '$1, $2');
			document.querySelector("#albumArt").src = `data:${common.picture[0].format};base64,${common.picture[0].data.toString('base64')}`;
		} catch (error) {
			console.error(error.message);
		}
	})();

	// Play
	document.querySelector("#play").addEventListener('click', () => {
		sound.play();
		updateProgress();
	})

	sound.on('play', () => {
		document.querySelector("#play").style.display = "none";
		document.querySelector("#pause").style.display = "inline-block";
	})

	// Pause
	document.querySelector("#pause").addEventListener('click', () => {
		sound.pause();
	})

	sound.on('pause', () => {
		document.querySelector("#pause").style.display = "none";
		document.querySelector("#play").style.display = "inline-block";
	})

	sound.on('end', () => {
		document.querySelector("#pause").style.display = "none";
		document.querySelector("#play").style.display = "inline-block";
	})

	// Previous
	document.querySelector("#prev").addEventListener('click', () => {
		if (sound.seek() >= 2) {
			sound.seek(0);
		}
	})

	// Next
	document.querySelector("#next").addEventListener('click', () => {
		sound.seek(sound.duration());
	})

	sound.on('seek', () => {
		updateProgress(true);
	})

	function updateProgress() {
		seek = false;
		if (dragging || sound.playing() || seek) {
			// console.log(dragging, seek, sound.playing());
			let percent = (seekTo || sound.seek()) / sound.duration();
			document.querySelector('#slider-bar').style.transform = `translateX(-${100 - (percent * 100)}%)`;
			document.querySelector('#slider-thumb').style.left = `${(percent * (document.querySelector('#slider-wrapper').getBoundingClientRect().right - document.querySelector('#slider-wrapper').getBoundingClientRect().left))}px`;
			window.requestAnimationFrame(updateProgress);
		}
	}

	let seekTo;
	let dragging = false;
	function dragThumb(e) {
		if (
			dragging
			&& e.pageX > document.querySelector('#slider-wrapper').getBoundingClientRect().left
			&& e.pageX < document.querySelector('#slider-wrapper').getBoundingClientRect().right
		) {
			// document.querySelector('#slider-thumb').style.left = `${}px`;
			// console.log(e.pageX, document.querySelector('#slider-wrapper').getBoundingClientRect().right)
			// let percent = (e.pageX) / document.querySelector('#slider-wrapper').getBoundingClientRect().right;
			let percent = ((e.pageX - document.querySelector('#slider-wrapper').getBoundingClientRect().left) / (document.querySelector('#slider-wrapper').getBoundingClientRect().right - document.querySelector('#slider-wrapper').getBoundingClientRect().left));
			// console.log(percent, sound.duration(), percent * sound.duration());
			// sound.seek(percent * sound.duration());
			seekTo = percent * sound.duration();
			window.requestAnimationFrame(dragThumb)
		}
	}

	document.querySelector("#slider-thumb").addEventListener('mousedown', (e) => {
		dragging = true;
		updateProgress();
		dragThumb(e);
	})

	document.querySelector("#slider-wrapper").addEventListener('mousedown', (e) => {
		dragging = true;
		updateProgress();
		dragThumb(e);
	})

	document.addEventListener('mouseup', () => {
		if (dragging) {
			sound.seek(seekTo);
			seekTo = false;
			dragging = false;

		}
	})

	document.addEventListener('mousemove', (e) => {
		if (dragging) { dragThumb(e); }
	})

	// Minimize
	document.querySelector("#minimize").addEventListener('click', () => {
		browserWindow.minimize();
	})

	// Close
	document.querySelector("#close").addEventListener('click', () => {
		browserWindow.close();
	})

}
