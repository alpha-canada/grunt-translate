/*
 * alpha-translate
 * @repo-url
 *
 * Copyright (c) 2016 Relentless Technology
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function ( grunt ) {
	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	var path = require( 'path' ),
		util = require( 'util' ),
		gettextParser = require("gettext-parser");

	grunt.registerMultiTask( 'translate', 'Convert i18n JSON files to MO format', function () {
		var options = this.options({
			
		});
		
		// Iterate over all specified file groups.
		this.files.forEach( function( f ) {
			// Create array of content of src files
			var src = f.src.filter(function ( filepath ) {
				
				// Warn on and remove invalid source files (if nonull was set).
				if ( !grunt.file.exists( filepath ) ) {
					grunt.log.warn( 'Source file "' + filepath + '" not found.' );
					return false;
				} else {
					return true;
				}
			}).map( function ( filepath ) {
				// Read file source.
				return grunt.file.readJSON( path.resolve( filepath ));
			});
			
			// Convert each file
			for ( var i = 0, ii = src.length; i < ii; i++ ) {
				var translations = src[ i ],
					langs;
	
				/**
				 * Build an object to pass into MO compiler
				**/
								
				var translationObject = {
					charset : "utf-8",
					headers : {
						"content-type" : "text/plain; charset=UTF-8"
					}
					
				};

				// translations object
				var moTranslations = {};
				
				// loop through each definition in the file
				for ( var id in translations ) {
					
					// translated string
					var translation = translations[id];
					
					if(translation === ""){
						// don't add empty strings
						continue;
					}
					
					// add translation definition object
					moTranslations[id] = {
						msgid : id,
						comments : {},
						msgstr: [translation]
					}
					
				}
				
				// add translations to MO config object
				translationObject.translations = {
					"" : moTranslations
				};
				
				// compile into an MO
				var output = gettextParser.mo.compile(translationObject);
				
				// write the file
				grunt.file.write( f.dest, output );
				grunt.log.writeln( 'File "' + f.dest + '" created.' );
				
			}
		});

		
	});
};
