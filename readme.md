# The Power Of CLI (NodeJS)

> Presentation for the NodeWeek conference at Globant Medellin CO in August 2019. 

# Chapter One 🎬

> Basic concepts to create a CLI in NodeJS 

- Let's know to `process.argv`

`process` is an object created when a `script` is running in NodeJS and it contains information about the current process and within its properties we find the `argv` which is an array that contains information about the command that executed the process.

`process.argv` will have at least two data and index one is the path to the NodeJS bin and index two is the path of the script being executed. 

```js
// index.js
'use strict';

const processArgv = process.argv;

console.log('Execution Arguments: ', processArgv);
console.log('I finished');

```

