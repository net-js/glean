#!/usr/bin/env node
import { spawn } from 'child_process';
import { readFileSync } from 'fs';


function checkPackageManager() {
    const packageManager = process.env.npm_config_package_manager;
    if (packageManager === 'yarn') {
        return 'yarn';
    }
    return 'npm';
}

function run(command, args) {
    const child = spawn(command, args, { stdio: 'ignore' });
    child.on('error', (err) => {
        console.log(err);
        process.exit(1);
    });
}

function checkBranch() {
    let runner = spawn('git', ['branch', "--show-current"], { stdio: 'pipe' });
    //return a promise
    return new Promise((resolve, reject) => {
        runner.stdout.on('data', (data) => {
            const branch = data.toString().trim();
            resolve(branch)
        });

        runner.stderr.on('data', (data) => {
            console.log(data.toString());
            reject(data.toString());
        });
    })
}

let arg = process.argv[2];
if (arg === '-h' || arg === '--help') {
    let command = (checkPackageManager() === 'npm') ? 'npx gclean': "yarn gclean";
    console.log(`
    Clean the commit-history in just one command
    Usage: ${command};
    If you have any thing problem, please contact us at github else please star our repo on github. \n
    https://github.com/net-js/glean
    For version: ${command} --version;
    `)
} else if (arg === '-v' || arg === '--version') {
    const packageFile = readFileSync('./package.json', 'utf8');
    const { version } = JSON.parse(packageFile);
    console.log(`gclean@${version} - net-js`);
} else {
    arg = ""
}


async function main(){
    const branch = await checkBranch();
    run('git', ['checkout', '--orphan', 'gclean']);
    run('git', ['add', '-A']);
    run('git', ['commit', '-m', 'Cleaning up using npx gclean']);
    run('git', ['branch', '-D', branch]);
    run('git', ['branch', '-m', branch]);
    run('git', ['push', '-f', 'origin', branch]);
    console.log("Clean up complete on branch: " + branch, "\n", `
Thanks for using gclean!
If you have any thing problem, please contact us at github else please star our repo on github. \nhttps://github.com/net-js/glean
With love,
net-js - Happy Hacking!`); 
}

main()