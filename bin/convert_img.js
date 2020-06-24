const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

(async () => {
	await imagemin(['*.{jpg,JPG,png}'], {
		destination: '.',
		plugins: [
			imageminWebp({quality: 75})
		]
	});

	console.log('Images optimized');
})();
