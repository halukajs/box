
module.exports = {
	verbose: true,
	coverageReporters: ['text-summary', 'html'],
	reporters: [
		'default',
		['./node_modules/jest-html-reporter', {
			'pageTitle': 'Test Report'
		}]
	]
}
