"use strict";
const fs = require('fs');
const async = require('async');
const request = require('request');
const readline = require('readline');
const path = require('path');
const Datastore = require('nedb');
const process = require('process');

// Max number of concurrent requests.
const CONCURRENCY = 10;

const API = 'http://api.urbandictionary.com/v0/define';

const ROOT = __dirname;

const normalizeWord = (word) =>
    word.trim().toLowerCase();

/**
    Save the response to the database.
*/
const processResponse = (db, word, data, callback) => {
    const key = normalizeWord(word);
    const definitions = data.list;
    const tags = data.tags;
    db.update(
        { entry: key },
        { $set: { entry: key }, $addToSet: { definitions: { $each: definitions }, tags: { $each: tags } } },
        { upsert: true }, (err, numReplaced, upsert) => {
            callback(err);
        });
};

/**
    Lookup the definition of a word using urban dictionary.
*/
const getDefinition = (db, word, callback) =>
    request({
        url: API,
        qs: { term: word }
    }, (err, response, body) => {
        if (err) 
            return callback(err);

        const data = JSON.parse(body);
        if (!data)
            return callback('invalid json')
        processResponse(db, word, data, callback)
    });


const q = async.queue((task, callback) => {
    if (task.word)
        getDefinition(task.db, task.word, callback);
    else
        callback();
}, CONCURRENCY);


/**
    Download all entries for a single letter.
*/
const process = (files) => {
    if (!files.length)
        return;
    
    const lineReader = readline.createInterface({
        input: fs.createReadStream(file[0])
    });
    
    const DB_FILE = path.join(ROOT, file + '.db');
    const db = new Datastore({ filename: DB_FILE, autoload: true });

    db.ensureIndex({ fieldName: 'entry', unique: true }, err => {
        lineReader
            .on('line', (line) => {
                q.push({ word: line, db: db }, (err) => {
                    if (err)
                        console.error(err)
                });
            })
            .on('close', () => {
                q.push({}, () => {
                    if (letter === 'Z')
                        return;
                    process(files.slice(1));
                })
            });
    })
};

const files = process.argv.slice(2);
if (!files.length) {
    console.error('No files provided');
} else {
    process(files);
}