const glob = require( "glob" );

var wordpressDir = process.argv.slice(2);

const ignoredFiles = [
	"Gruntfile.js",
	"create-docs.js",
	"src/wp-includes/js/media-views.js",
	"src/wp-includes/js/media-audiovideo.js",
	"src/wp-includes/js/media-grid.js",
	"src/wp-includes/js/media-models.js",
	
	// Add these back later:
	"src/wp-includes/js/tinymce/tinymce.js",
	"src/wp-includes/js/customize-selective-refresh.js",
	"src/wp-includes/js/wp-api.js",
	"src/wp-admin/js/updates.js",
	"src/wp-admin/js/customize-controls.js",
].map( path => wordpressDir + "/" + path );

let files = glob( wordpressDir + "/**/*.js", {}, ( err, files ) => {
	files = files.filter( ( file ) => {
		return ! file.endsWith( ".min.js" );
	} );
	
	files = files.filter( ( file ) => {
		return ! file.startsWith( wordpressDir + "/out" );
	} );
	
	files = files.filter( ( file ) => {
		return ! file.startsWith( wordpressDir + "/tests" );
	} );

	files = files.filter( ( file ) => {
		return ! ignoredFiles.includes( file );
	} );

	files = files.filter( ( file ) => {
		return ! file.startsWith( wordpressDir + "/src/wp-includes/js/jquery" );
	} );

	files = files.join( " " );
	
	console.log( `documentation build ${files} -f html -o documentation` );
} );

