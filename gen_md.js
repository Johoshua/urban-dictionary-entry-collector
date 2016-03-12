"use strict";
const fs = require('fs');
const async = require('async');
const request = require('request');
const readline = require('readline');
const path = require('path');
const Datastore = require('nedb');
const process = require('process');

const ROOT = __dirname;

const files = process.argv.slice(2);
if (files.length < 2) {
    console.error('expected [input.db] [output.csv]');
} else {
    process(files);
}

const in_file = files[0];
const out_file = files[1];

const out = fs.createWriteStream(out_file);


const normalizeWord = (word) =>
    word.trim().toLowerCase();

const markdownEscape = (word) =>
    word.replace(/[#*+<>&\]\[()]/g, x => '\\' + x)
        .replace(/[\ud000-\uFFFF]/g, '');;



const getMarkdownForEntry = (data) => {
    if (!data.definitions.length)
        return '';
            
    const title = markdownEscape(data.entry);
    const tags = data.tags.map(x => markdownEscape('#' + x)); 
    const entries = data.definitions.map(def => {
        return `### ${markdownEscape(def.word)}
${markdownEscape(def.definition)}`;
    }).join('\n\n')
    return `# ${title}
${tags.length ? tags.join(', ') + '\n' : ''}
${entries}


`;
};


/**
    Task queue.
*/
const q = async.queue((task, callback) => {
    if (task.done) {
        task.file.end();
        callback();
    } else if (task.entry) {
        const entry = task.entry;
        const md = getMarkdownForEntry(entry);      
        task.file.write(md);
        return callback();
    } else {
        callback(null);
    }
}, 1);


const lineReader = readline.createInterface({
    input: fs.createReadStream(in_file)
});

lineReader
    .on('line', (line) => {
        const data = JSON.parse(line);
        if (data.entry)
            q.push({ entry: data, file: out }, () => { });
    })
    .on('close', () => {
        q.push({ done: true, file: out}, () => { })
    });
