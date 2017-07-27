const glob = require( "glob" );
const exec = require( "child_process").exec;
const documentation = require( "documentation" );
const streamArray = require('stream-array');
const vfs = require('vinyl-fs');

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
];

function filterIgnoredFiles( files, startingDirectory ) {
	return files.filter( ( file ) => {

		if ( file.startsWith( `${startingDirectory}/out` ) ) {
			return false;
		}

		if ( file.startsWith( `${startingDirectory}/tests` ) ) {
			return false;
		}

		if ( file.startsWith( `${startingDirectory}/wp-includes/js/jquery` ) ) {
			return false;
		}

		if ( file.endsWith( `.min.js` ) ) {
			return false;
		}

		return true;
	} );
};

function output_to_file( content, destination ) {
	content.then( ( result ) => {
		let outputted = streamArray( result ).pipe( vfs.dest( destination ) );

		console.log( "Outputted to: ", destination );

		return outputted;
	} ).catch( ( err ) => {
		console.log( err );
		return;
	});
}

function output_documentation( files, destination = "./documentation" ) {
	let errors = [];

	let resultOutput = {
		errors: [],
		results: null,
	};

	return documentation
		.build( files, {} )
//		.catch( error => { errors.push( error ); return; } )
	    .then( result => {
	    	console.log( "hi" );
	    	resultOutput.results = documentation.formats.html( result, {} )
	    } )
	    .catch( error => { errors.push( error ); return; } )
		.then( results => resultOutput );
}

let startingDirectory = process.argv[2].replace(/\/$/, "");

let files = glob( `${startingDirectory}/**/*.js`, {}, ( err, files ) => {
	files = filterIgnoredFiles( files, startingDirectory );

	let l_files = files.slice( 0,  );
	let completed = 0;

//	for ( let file in l_files ) {
	let output = output_documentation( files[0] );

	output.then( output => {

		console.log( output );


		output_to_file( output.results, "./documentation2" )
	} ).catch( ( err ) => {
		console.log( err );

		return;
	} );

//		completed++;
//	}
//
//	console.log( completed )

} );
