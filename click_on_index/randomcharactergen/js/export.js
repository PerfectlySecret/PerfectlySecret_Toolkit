/*!
 * Copyright (c) 2016  Joshua M. David
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation in version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see [http://www.gnu.org/licenses/].
 */

// Use ECMAScript 5's strict mode
'use strict';

/**
 * Functions to export the data for randomness testing by external programs
 */
var exportData = {

	/** Cached jQuery selector for the Export dialog */
	$dialog: null,

	/** The least significant bits in the first image from the TRNG */
	randomBitsFirstImageBinary: '',
	randomBitsFirstImageHex: '',

	/** The least significant bits in the second image from the TRNG  */
	randomBitsSecondImageBinary: '',
	randomBitsSecondImageHex: '',

	/** Get the least significant bits from both images XORed together from the TRNG */
	randomBitsXoredBinary: '',
	randomBitsXoredHex: '',

	/** Get the final bits after randomness extraction from the TRNG */
	randomBitsExtractedBinary: '',
	randomBitsExtractedHex: '',

	/**
	 * Configure the Export dialog to open and all functionality within.
	 * Assumes a simplified HTML structure for the dialog:
	 * - An input element with id="exportFilename" for the desired filename.
	 * - A button with id="btnExport" to trigger the export.
	 */
	initExportDialog: function()
	{
		// Cache to prevent extra DOM lookups
		this.$dialog = $('#exportSettings'); // Make sure your dialog HTML has this ID

		// Configure button to open export dialog
		$('#btnOpenExportSettings').click(function()
		{
			// Hide previous status messages
			common.hideStatus();
			// Suggest a default filename (optional, could be removed if not desired)
			$('#exportFilename').val('onetimepad'); // Set a default filename
			// Open jQueryUI dialog
			exportData.$dialog.dialog('open');
		});

		// Configure export settings dialog using jQueryUI
		this.$dialog.dialog(
		{
			autoOpen: false,
			create: function (event)
			{
				// Set the dialog position as fixed before opening the dialog. See: http://stackoverflow.com/a/6500385
				$(event.target).parent().css('position', 'fixed');
			},
			modal: true,
			resizable: false,
			width: 300 // Made the dialog smaller
		});

		// Initialise other functionality within the dialog
		this.initExportButton();
		// Removed listeners for #exportDataSource, #exportFormat as they are removed
	},

	/**
     * Initialise the button to export the random data.
     */
    initExportButton: function()
    {
        // Export the data
        $('#btnExport').click(function()
        {
            // Get the desired filename, provide a default if empty
            var userFilename = $('#exportFilename').val().trim();
            if (!userFilename) {
                 userFilename = 'onetimepad'; // Fallback default filename
            }
            // Ensure the filename has a .txt extension
            if (!userFilename.toLowerCase().endsWith('.txt')) {
                 userFilename += '.txt';
            }

            // Hardcode the export method for Base64 text file using extracted entropy
            var exportMethod = 'EntropyExtractedBase64';

            // Export the random data
            exportData.prepareRandomDataForExternalTesting(exportMethod, userFilename);
        });
    },

    // Removed suggestFilename function as it's simplified

    /**
     * Exports the random data to a file with the specified name.
     * Assumes Base64 export of extracted entropy.
     * @param {String} exportMethod String indicating data source and format ('EntropyExtractedBase64').
     * @param {String} userFilename The filename provided by the user (including extension).
     */
    prepareRandomDataForExternalTesting: function(exportMethod, userFilename)
    {
        var sourceData = ''; // Store the chosen data source (hex)
        var output = '';
        var blob;

        // Simplified: Always use the extracted entropy
        if (exportMethod.startsWith('EntropyExtracted'))
        {
            sourceData = exportData.randomBitsExtractedHex; // Use Hex for Base64 conversion
        } else {
             console.error("Unsupported exportMethod:", exportMethod);
             common.showStatus('error', 'Internal error: Unsupported export method.', true);
             return; // Exit if source is unexpected (shouldn't happen with hardcoding)
        }

        // Simplified: Always export as Base64 text file
        if (exportMethod.endsWith('Base64'))
        {
            var words = CryptoJS.enc.Hex.parse(sourceData); // Parse Hex data
            output = CryptoJS.enc.Base64.stringify(words); // Convert to Base64 string
            blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
        } else {
             console.error("Unsupported export format in exportMethod:", exportMethod);
             common.showStatus('error', 'Internal error: Unsupported export format.', true);
             return; // Exit if format is unexpected
        }

        // Use FileSaver.js to pop up a save dialog with the user-provided filename
        try {
            saveAs(blob, userFilename); // Use the user-provided filename
            common.hideStatus(); // Hide status on successful save prompt
            exportData.$dialog.dialog('close'); // Close the dialog after initiating save
        } catch (e) {
             console.error("Error saving file:", e);
             common.showStatus('error', 'Could not save file. See console for details.', true);
        }
    }
};