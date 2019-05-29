/**
 * This script will download and extract a zipped version of a prebuilt external html5 editor
 * The zip file contains the raw, unchanged editor sources, which will be extracted into a folder
 * The zip should be uploaded with one of the git releases (use gitRelease variable for version where you released it)
 */
var shell = require('shelljs');
var https = require('follow-redirects').https;
var crypto = require('crypto');
var fs = require('fs');
var unzipper = require('unzipper');
var process = require('process');
var path = require('path');
const { hashElement } = require('folder-hash');

const editor = process.argv[2];
const gitRelease = process.argv[3];
const folderHash = process.argv[4];
const gitUrl = 'https://github.com/4ian/GDevelop';
const basePath = path.join('../public/external/', editor, editor + '-editor');
const zipFilePath = basePath + '.zip';

// Tool function checking if the editor folder has the proper SHA256 checksum
// If you're updating the zip of a third party editor, update also the checksum
// in package.json.
const editorHasCorrectHash = () =>
  hashElement(basePath, { algo: 'sha256', encoding: 'hex' }).then(
    folderHashResult => {
      return folderHashResult.hash === folderHash;
    },
    () => {
      // Cannot hash the editor folder to see if it's up-to-date, assuming not.
      return false;
    }
  );

editorHasCorrectHash().then(isHashCorrect => {
  if (isHashCorrect) {
    //Nothing to do
    shell.echo(
      '✅ ' +
        editor +
        '-editor already existing in public/external/' +
        editor +
        ' folder and up-to-date - skipping download'
    );
    return;
  }

  shell.echo(
    '🌐 Outdated/non-existing ' +
      editor +
      '-editor, downloading it from ' +
      gitUrl +
      ' (be patient)...'
  );

  var file = fs.createWriteStream(zipFilePath);
  https.get(
    gitUrl + '/releases/download/v' + gitRelease + '/' + editor + '-editor.zip',
    function(response) {
      if (response.statusCode !== 200) {
        shell.echo(
          `❌ Can't download ` +
            editor +
            `-editor.zip (${
              response.statusMessage
            }), please check your internet connection`
        );
        shell.exit(1);
        return;
      }

      response.pipe(file).on('finish', function() {
        shell.echo(
          '📂 Extracting ' +
            editor +
            '-editor.zip to public/external/' +
            editor +
            ' folder'
        );

        try {
          fs.createReadStream(zipFilePath)
            .pipe(
              unzipper.Extract({
                path: path.join('../public/external/', editor),
              })
            )
            .on('close', function() {
              shell.echo(
                '✅ Extracted ' +
                  editor +
                  '-editor.zip to public/external/' +
                  editor +
                  ' folder'
              );
              shell.rm(zipFilePath);
              editorHasCorrectHash().then(isHashCorrect => {
                if (!isHashCorrect) {
                  shell.echo(
                    "❌ Can't verify that " +
                      editor +
                      '-editor hash is correct. Be careful about potential tampering of the third party editor! 💣'
                  );
                }
              });
            });
        } catch (e) {
          shell.echo(
            '❌ Error while extracting ' +
              editor +
              '-editor.zip to public/external/' +
              editor +
              ' folder:',
            e.message
          );
        }
      });
    }
  );
});
