#!/usr/bin/env node
'use strict';

const MongoOplog = require('mongo-oplog');
const _ = require('lodash');
const Table = require('cli-table');
const fs = require('fs');
const child_process = require('child_process');

// Logging setup
const Console = console.Console;
const stdout = new Console(process.stdout);
const stderr = new Console(process.stderr);

// Command-line args
const HELP = `
Usage: oplog-tailer.js [MONGO URL]

If MONGO URL is not given, the MONGO_OPLOG_URL environment variable will be used.
If that's not set, it will default to mongodb://localhost.

Do not include a database name in the mongo URL. The "local" database (which contains
the oplog) will always be used.
`
if ((process.argv[2] === '--help') || (process.argv[2] === '-h')) {
  stderr.log(HELP)
  process.exit(0);
}

// Set up oplog tailing
const oplogUrl = process.argv[2] || process.env.MONGO_OPLOG_URL || 'mongodb://localhost/';

let oplogUrlWithDB;
if (oplogUrl.charAt(oplogUrl.length - 1) === '/') {
  oplogUrlWithDB = oplogUrl + 'local';
} else {
  oplogUrlWithDB = oplogUrl + '/local';
}

const oplog = MongoOplog(oplogUrlWithDB);
oplog.tail();

// [database.table] -> [size in bytes]
const totalSizePerDb = {};

// [database.table] -> [number of records]
const totalCountPerDb = {};

// [table] -> [size in bytes]
const totalSizeAcrossDbs = {};

// [table] -> [number of records]
const totalCountAcrossDbs = {};

// handle new oplog entries
oplog.on('op', data => {
  const date = new Date(data.ts.getHighBits() * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const jsonData1 = JSON.stringify(data.o) || '';
  const jsonData2 = JSON.stringify(data.o2) || '';

  // print a summary of the entry
  stdout.log(`[${date}] [${_.padEnd(data.ns, 30)}] ${data.op} ${_.truncate(jsonData1, { length: 100 })} ${_.truncate(jsonData2, { length: 100 })}`);

  // estimate size of update by the length of the json encoded version
  const size = jsonData1.length + jsonData2.length;

  // accumulate the per-db aggregates
  totalSizePerDb[data.ns] = (totalSizePerDb[data.ns] || 0) + size;
  totalCountPerDb[data.ns] = (totalCountPerDb[data.ns] || 0) + 1;

  // accumulate the cross-db aggregates
  const collectionName = data.ns.substr(data.ns.indexOf('.') + 1);
  totalSizeAcrossDbs[collectionName] = (totalSizeAcrossDbs[collectionName] || 0) + size;
  totalCountAcrossDbs[collectionName] = (totalCountAcrossDbs[collectionName] || 0) + 1;
});

// Converts a number of bytes to a human-readable estimate to 2 decimal places
// from: http://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function formatBytes(bytes, decimals) {
  if (bytes == 0) {
    return '0 Bytes';
  }

  const k = 1000;
  const dm = decimals + 1 || 3;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Print a summary table
function printTable(title, sizeData, countData) {
  stderr.log(title);
  const table = new Table({
    head: ['Table', 'Oplog Traffic', 'Number of Updates'],
    colWidths: [40, 25, 25],
  });

  _(sizeData)
    .map((size, name) => [name, size])
    .sortBy(nameAndSize => -nameAndSize[1])
    .each((nameAndSize) => {
      const name = nameAndSize[0];
      const size = nameAndSize[1];

      table.push([name, formatBytes(size), countData[name]]);
    });

  stderr.log(table.toString());
  stderr.log('\n\n');
}

// Print per-db and cross-db summaries and exit
function printSummaryAndExit(status) {
  printTable('By Database', totalSizePerDb, totalCountPerDb);
  printTable('Across Databases', totalSizeAcrossDbs, totalCountAcrossDbs);

  process.exit(status || 0);
}

// handle oplog tailing failures
oplog.on('end', () => {
  stderr.log('Stream ended');
  printSummaryAndExit(1);
});

oplog.on('error', err => {
  stderr.log('Error', err);
  printSummaryAndExit(1);
});

// Handle ctrl+c
process.on('SIGINT', function() {
  stderr.log('Exiting due to interrupt');
  printSummaryAndExit();
});

// Print something so the user know we're live
stderr.log('Oplog monitoring started. Entries will be printed here. Press ctrl+c to exit and print a summary.')
