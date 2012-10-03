(function($) {

	__setCaretTo = function(obj, pos) { 
    	obj.focus(); 
    	obj.setSelectionRange(pos, pos); 
	}

	__MAPPING_RU = {
	    "q" : "\u0449",
	    "Q" : "\u0429",
	    "w" : "\u0432",
	    "W" : "\u0412",
	    "e" : "\u0435",
	    "E" : "\u0415",
	    "r" : "\u0440",
	    "R" : "\u0420",
	    "t" : "\u0442",
	    "T" : "\u0422",
	    "z" : "\u0446",
	    "Z" : "\u0426",
	    "u" : "\u0443",
	    "U" : "\u0423",
	    "i" : "\u0438",
	    "I" : "\u0418",
	    "o" : "\u043E",
	    "O" : "\u041E",
	    "p" : "\u043F",
	    "P" : "\u041F",

	    "a" : "\u0430",
	    "A" : "\u0410",
	    "s" : "\u0441",
	    "S" : "\u0421",
	    "d" : "\u0434",
	    "D" : "\u0414",
	    "f" : "\u0444",
	    "F" : "\u0424",
	    "g" : "\u0433",
	    "G" : "\u0413",
	    "h" : "\u0436",
	    "H" : "\u0416",
	    "j" : "\u0439",
	    "J" : "\u0419",
	    "k" : "\u043A",
	    "K" : "\u041A",
	    "l" : "\u043B",
	    "L" : "\u041B",

	    "y" : "\u044B",
	    "Y" : "\u042B",
	    "x" : "\u0445",
	    "X" : "\u0425",
	    "c" : "\u0447",
	    "C" : "\u0427",
	    "v" : "\u044C",
	    "V" : "\u044A",

	    "b" : "\u0431",
	    "B" : "\u0411",
	    "n" : "\u043D",
	    "N" : "\u041D",
	    "m" : "\u043C",
	    "M" : "\u041C",

	    "+" : "\u0448",
	    "*" : "\u0428",
	    "#" : "\u044F",
	    "'" : "\u042F",

	    "\u00E4" : "\u044D", 
	    "\u00C4" : "\u042D", 
	    "\u00F6" : "\u0451", 
	    "\u00D6" : "\u0401", 
	    "\u00FC" : "\u044E", 
	    "\u00DC" : "\u042E", 

	    "<" : "\u0437",
	    ">" : "\u0417",

	    "alt+R" : "\u044F",
	    "shift+alt+R" : "\u042F",
	}

	__MAPPING_ES = {
	    "shift+alt+N"  : "\u00D1",
	    "alt+N"  : "\u00F1",

	    "shift+alt+C"  : "\u00C7",
	    "alt+C"  : "\u00E7",

	    "shift+alt+?"  : "\u00BF",
	    "alt+?"  : "\u00BF",

	    "shift+alt+!"  : "\u00A1",
	    "alt+!"  : "\u00A1",

	    "alt+O" : "\u00BA",
	    "alt+A" : "\u00AA"
	}

	__MAPPING_FR = 	{
	    "shift+alt+A"  : "\u00C6",
	    "alt+A"  : "\u00E6",

	    "shift+alt+C"  : "\u00C7",
	    "alt+C"  : "\u00E7",

	    "shift+alt+E"  : "\u00CB",
	    "alt+E"  : "\u00EB",

	    "shift+alt+I"  : "\u00CF",
	    "alt+I"  : "\u00EF",

	    "shift+alt+O"  : "\u0152",
	    "alt+O"  : "\u0153",

	    "shift+alt+Y"  : "\u0178",
	    "alt+Y"  : "\u00FF",
	}

	$.fn.keyremap = function(opts) {

		// var options = $.extend({}, options);

		return this.each(function() {
			
			$this = $(this);

            if ($this.attr("lang") === "ru") {
            	$this.bind('keydown',  {options: {'mapping' : __MAPPING_RU}}, __handle_echoid);
            	$this.bind('keydown',  {options: {'mapping' : __MAPPING_RU}}, __handle_escape);
            	$this.bind('keypress', {options: {'mapping' : __MAPPING_RU}}, __handle_alpha);
            	$this.bind('keyup', {options: {'mapping' : __MAPPING_RU}}, __handle_composite);
            	// console.log("installing ru on " + $this.attr("id"));
            }

            if ($this.attr("lang") === "fr") {
            	$this.bind('keydown',  {options: {'mapping' : __MAPPING_FR}}, __handle_echoid);
            	$this.bind('keydown',  {options: {'mapping' : __MAPPING_FR}}, __handle_escape);
            	$this.bind('keypress', {options: {'mapping' : __MAPPING_FR}}, __handle_alpha);
            	$this.bind('keyup', {options: {'mapping' : __MAPPING_FR}}, __handle_composite);
            	// console.log("installing fr on " + $this.attr("id"));
            }

            if ($this.attr("lang") === "es") {
            	$this.bind('keydown',  {options: {'mapping' : __MAPPING_ES}}, __handle_echoid);
            	$this.bind('keydown',  {options: {'mapping' : __MAPPING_ES}}, __handle_escape);
            	$this.bind('keypress', {options: {'mapping' : __MAPPING_ES}}, __handle_alpha);
            	$this.bind('keyup', {options: {'mapping' : __MAPPING_ES}}, __handle_composite);
            	// console.log("installing es on " + $this.attr("id"));
            }

			// Handle escape separately is ugly, but we need it -- 
			// because if we bind it to both
			// keyup and keydown we get doublettes .. 
			function __handle_escape(e) {

				var options = e.data.options;
				// console.log(options);

			    if (e.which == 27) {
			        
			        // scroll-pain (for moz)
			        // after switching to a mapping, mozilla 
			        // would not scroll to the cursor location, 
			        // but rather up to textarea's top
			        // which is inconvenient
			        // : so safe the scrollTop, and restore it after the 
			        // processing
			        var scrollTop = this.scrollTop;

			        // get the standard data from the textarea
			        // range of the selection, the current value of the textarea
			        // <prefix> <caret_position> <suffix> 
			        var range = $(this).getSelection();
			        var current = this.value;
			        var prefix = current.substring(0, range.start);
			        var suffix = current.substring(range.start, current.length);
			        var caret_position = range.start;

			        // the new content of the textarea, and the default length 
			        // of our replacement
			        var the_new_current = "";
			        var replacement_length = 1;
			        
			        // check for shift key
			        if (e.shiftKey) {
			            // and only do something, if we have a mapping for it
			            if (options.mapping["shift-escape"]) {
			                replacement_length = options.mapping["shift-escape"].length;                            
			                the_new_current = prefix + options.mapping["shift-escape"] + suffix;
			            } else { return; }
			        } else {
			            if (options.mapping["escape"]) {
			                replacement_length = options.mapping["escape"].length;
			                the_new_current = prefix + options.mapping["escape"] + suffix;
			            } else { return; }
			        }
			        
			        // update the value of the textarea
			        this.value = the_new_current;

			        // move the cursor manually to the right place
			        __setCaretTo( this, caret_position + replacement_length);
			        
			        // restore scroll position
			        this.scrollTop = scrollTop;
			        
			        // supress default action
			        return false;
			    }
			}    // end handle_escape


			// handle alt+<x> keys...
            // TODO
            function __handle_composite(e) {

            	var options = e.data.options;
                
                // scroll pain (for moz) (see comment on line 195)
                var scrollTop = this.scrollTop;
                
                var range = $(this).getSelection();
                var current = this.value;
                var prefix = current.substring(0, range.start);
                var suffix = current.substring(range.start, current.length);
                var caret_position = range.start;
                var the_new_current = "";
                
                // get the last character from the input - why?
                // because german umlauts leave no keycode in the 
                // event so we have to treat them specially
                var last_typed = current.substring(range.start - 1, range.start);
                                
                // check for all non-alpha characters which you like to map 
                // (and which are defined in ``mapping``)
                if ( 
                    last_typed == '\u00E4' || // ä
                    last_typed == '\u00F6' || // ö
                    last_typed == '\u00FC' || // ü
                    last_typed == '\u00C4' || // Ä 
                    last_typed == '\u00D6' || // Ö
                    last_typed == '\u00DC' || // Ü
                    last_typed == '<'      || 
                    last_typed == '>' ) {

                    // since one character has been written we have to delete one
                    // more in the prefix
                    prefix = current.substring(0, range.start - 1);
                    
                    // get the mapping ...
                    if (options.mapping[last_typed]) {

                        var replacement_length = options.mapping[last_typed].length;
                        var the_new_current = prefix + options.mapping[last_typed] + suffix;

                        // ... and update
                        this.value = the_new_current;
                        __setCaretTo(this, caret_position + replacement_length);
                        
                        // restore scroll position
                        this.scrollTop = scrollTop;
                        
                        return false;
                    } else { return; }
                }

                // restore scroll position
                this.scrollTop = scrollTop;
                
                return false;
            } // handle_composite

            // updates are for the german umlauts characters, since these are two-byte chars
            // which do not get mapped to keyCodes ...
            // we need to let them write it into the textarea, then replace it with the 
            // desired char; this looks ugly -- 
            // you can see it if you watch as you type, echoid ...
            function __handle_echoid(e) {

            	var options = e.data.options;
                
                // get the standard data from the textarea
                // range of the selection, the current value of the textarea
                // <prefix> <caret_position> <suffix> 
                
                // scroll pain (for moz) -- see comment line 195
                var scrollTop = this.scrollTop;
                
                var range = $(this).getSelection();
                var current = this.value;
                var prefix = current.substring(0, range.start);
                var suffix = current.substring(range.start, current.length);
                var caret_position = range.start;

                if (e.altKey) {
                    var the_key_string = null;

                    if (e.shiftKey) {
                        the_key_string = "shift+alt+" + String.fromCharCode(e.which);
                    } else {
                        the_key_string = "alt+" + String.fromCharCode(e.which); 
                    }

                    if (options.mapping[the_key_string]) {
                        var the_new_current = prefix + options.mapping[the_key_string] + suffix;
                        // update
                        this.value = the_new_current;
                        __setCaretTo( this, caret_position + 1 );

                        // restore scroll position
                        this.scrollTop = scrollTop;

                        return false;
                    }
                }
                
            } // handle_echoid
            
            // handle the "normal" alpha keys
            function __handle_alpha(e) {

            	var options = e.data.options;

                var returnval = true;
                var caret_position;
                
                // scroll pain (for moz) -- see comment line 195
                var scrollTop = this.scrollTop;
                
                if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                    var range = $(this).getSelection();
                    caret_position = range.start;
                    var current = this.value;

                    var the_key_string = String.fromCharCode(e.which); 

                    // Check extended ranges
                    // for the time being, allow only two input characters.
                    if ( options.prev_caret_position + 1 == caret_position ) {
                        var prevKey = current.substring( 
                        	options.prev_caret_position,caret_position);
                
                        if (options.mapping[prevKey + the_key_string]) {
                            // Found an extended mapping    
                            the_key_string = prevKey + the_key_string;
                            --caret_position;
                        }
                    }

                    // console.log(the_key_string);
                    // console.log(options.mapping);

                    if (options.mapping[the_key_string]) {
                        // We have a mapping; perform it




                        if (document.selection) { 
                            //IE
                            range = document.selection.createRange();

                            if( the_key_string.length > 1) {
                                range.moveStart( 'character', -(the_key_string.length -1 ) );
                            }

                            range.text = options.mapping[the_key_string];

                            // Block default action
                            returnval = false;
                        } else {
                            //Basically all other browsers

                            // get the standard data from the textarea
                            // range of the selection, the current value of the textarea
                            // <prefix> <caret_position> <suffix> 
                            var range = $(this).getSelection();
                            var current = this.value;
                            var prefix = current.substring(0, caret_position);
                            var suffix = current.substring(range.end, current.length);
    
                        
                            // do the replace
                            var replacement_length = options.mapping[the_key_string].length;
                            var the_new_current = prefix + 
                            	options.mapping[the_key_string] + suffix;
                            // update
                            $(this).val( the_new_current );
    
    
                            /* DEBUG
                            $("#live-debug").html("<pre>caret_position: " + caret_position +
                                 "; replacement_length: " + replacement_length +
                                 "; maps to: " + options.mapping[the_key_string] +
                                 "; prefix: '" + prefix +
                                 "'; suffix: '" + suffix +
                                 "'; the_new_current: " + the_new_current +
                                "</pre>"
                            );
                            //END DEBUG */
    
                            if (caret_position == -1) { caret_position += 1; }
    
                            __setCaretTo( this, caret_position + replacement_length);
    
                            // Block default action
                            returnval = false;
    
                        }
                    } else { 
                        // No mapping; use default action
                    }

                    // restore scroll position
                    this.scrollTop = scrollTop;
                    
                    options.prev_caret_position = caret_position;

                    return returnval;
                } 
            } // handle_alpha

		}
	)};
})(jQuery);
