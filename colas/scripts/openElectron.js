const cp = require('child_process');
module.exports = function (url) {
    const electron = require('electron');
    const child = cp.spawn(
        electron,
        ['.', url],
        {
            stdio: 'inherit',
            shell: true,
            //stdio: ['pipe', 'pipe', process.stderr, process.stdout],
            windowsHide: false
        }
    );
    child.on('close', function (code) {
        process.exit(code)
    });

}