var shell = require('shelljs');

var source = '../node_modules/loov-jsfx';

var success = true;
success &= !shell.mkdir('-p', '../public/external/jsfx').stderr;
success &= !shell.cp('-Rf', source, '../public/external/jsfx').stderr;
if (!success) {
  shell.echo(
    `❌ Error(s) occurred while copying Jsfx Editor sources from node_modules/loov-jsfx`
  );
} else {
  shell.echo('✅ Sources of Jsfx Editor properly copied in public folder');
}
