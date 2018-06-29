/**
 * This script download and extract a zipped version of the Piskel editor
 * (https://www.piskelapp.com/).
 * The zip file contains the raw, unchanged piskel editor sources into a folder
 * called "piskel-editor".
 */
var shell = require('shelljs');
var https = require('follow-redirects').https;
var fs = require('fs');
var unzip2 = require('unzip2');

const zipFilePath = '../public/External/Piskel/piskel-editor.zip';

if (shell.test('-d', '../public/External/Piskel/piskel-editor')) {
  //Nothing to do
  shell.echo(
    '✅ piskel-editor already existing in public/External/Piskel folder - skipping download'
  );
} else {
  shell.echo(
    '🌐 Unable to find piskel-editor, downloading it from github.com/4ian/GD (be patient)...'
  );

  var file = fs.createWriteStream(zipFilePath);
  https.get(
    'https://github.com/4ian/GD/releases/download/v5.0.0-beta34/piskel-editor.zip',
    function(response) {
      if (response.statusCode !== 200) {
        shell.echo(
          `❌ Can't download piskel-editor.zip (${response.statusMessage}), please check your internet connection`
        );
        shell.exit(1);
        return;
      }

      response.pipe(file).on('finish', function() {
        shell.echo(
          '📂 Extracting piskel-editor.zip to public/External/Piskel folder'
        );

        try {
          fs
            .createReadStream(zipFilePath)
            .pipe(unzip2.Extract({ path: '../public/External/Piskel' }))
            .on('close', function() {
              shell.echo(
                '✅ Extracted piskel-editor.zip to public/External/Piskel folder'
              );
              shell.rm(zipFilePath);
              if (
                !shell.test('-d', '../public/External/Piskel/piskel-editor')
              ) {
                shell.echo(
                  "❌ Can't verify that piskel-editor exists. Was the piskel-editor.zip file malformed?"
                );
              }
            });
        } catch (e) {
          shell.echo(
            '❌ Error while extracting piskel-editor.zip to public/External/Piskel folder:',
            e.message
          );
        }
      });
    }
  );
}
