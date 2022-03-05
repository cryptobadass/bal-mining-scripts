import { loadTree } from './merkle';
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { argv } = require('yargs');
const { config } = require('./config');

const globCwd = path.resolve(__dirname, '../' + config.reportsDirectory);

console.log('Merkle roots -> globCwd:', globCwd);

const filenamesOfTotals = glob.sync('./**/' + config.reportFilename, {
    cwd: globCwd,
});

console.log('Merkle roots -> filenamesOfTotals:', filenamesOfTotals);


const reports = filenamesOfTotals.map((fileName) => [
    parseInt(fileName.split('/')[1]), // weekNumber
    JSON.parse(fs.readFileSync(path.resolve(globCwd, fileName)).toString()),
]);

console.log('Merkle roots -> reports:', reports);

const roots = {};

reports.forEach(([week, report]) => {
    if (config.offset < week) {
        const merkleTree = loadTree(report, config.decimals || 18);
        console.log(`Week ${week}`);
        const root = merkleTree.getHexRoot();
        console.log(root);
        // homestead started distributing using a merkle strategy 20 weeks in
        // so weeks prior to this offset should not be included
        roots[week - config.offset] = root;
    }
});

if (argv.outfile) {
    const jsonString = JSON.stringify(roots, null, 4);
    console.log(jsonString);

    fs.writeFileSync(argv.outfile, jsonString);
}
