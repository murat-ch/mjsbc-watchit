#!/usr/bin/env node

const chalk = require('chalk');
const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const program = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');

program
    .version('0.0.1')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({ filename = 'index.js' }) => {
        try {
            await fs.promises.access(filename);
        } catch(err) {
            throw new Error(`Could not find the file ${filename}`);
        }
        let proc;
        const start = debounce(() => {
            if (proc) {
            proc.kill();
        }
            console.log(chalk.magenta.bold('>>>> Starting process...'));
            proc = spawn('node', [filename], { stdio: 'inherit' });
        }, 100);
        chokidar
            .watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink',start);
    });

program.parse(process.argv);
