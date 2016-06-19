if(process.argv[2] === undefined || process.argv[3] === undefined || process.argv[4] === undefined) {
	console.log("You forget a setting.");
}
else {
	var request = require('request');
	var cheerio = require('cheerio');
	var fs = require('fs');
	var keyword = process.argv[2];
	var pages = process.argv[3];
	var folder = process.argv[4] + '/';
	if(!fs.existsSync(folder)){
		fs.mkdirSync(folder);
	}
	var images = [];
	var counter = 0;
	for(var page = 1; page <= pages; page++) {
		request('https://unsplash.com/search?utf8=%E2%9C%93&keyword=' + keyword + '&page=' + page, function(error, response, html) {
			if(!error && response.statusCode === 200) {
				var $ = cheerio.load(html);
				$('img.photo__image', 'div.photo-grid').each(function() {
					var image = $(this).attr('src').split('&');
					var imageUrl = image[0] + '&' + image[1] + '&' + image[2] + '&' + image[3] + '&' + image[6];
					images.push(imageUrl);
					console.log(imageUrl);
				});
				for(var image = 0; image < images.length; image++) {
					request(images[image]).pipe(fs.createWriteStream(folder + '/image_' + (counter + image) + '.jpg'));
				}
				counter = images.length;
			}
			else {
				console.log('A problem occurred.');
			}
		});
	}
}

