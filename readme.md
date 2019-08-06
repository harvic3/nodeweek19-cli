# The Power Of CLI (NodeJS)

> Presentation for the NodeWeek conference at Globant Medellin CO in August 2019. 

Before we begin we must choose a name for our CLI, and for this particular case I have chosen `"nodewk"`.

# Chapter One 🎬

> Basic concepts to create a CLI in NodeJS 

## Let's know to `process.argv`

`process` is an object created when a `script` is running in NodeJS and it contains information about the current process and within its properties we find the `argv` which is an array that contains information about the command that executed the process.

`process.argv` will have at least two data and index one is the path to the NodeJS bin and index two is the path of the script being executed. 

```js
// index.js
'use strict';

const processArgv = process.argv;

console.log('Execution Arguments: ', processArgv);
console.log('I finished');

```

To execute the script we must run this command in console: 
```console
node index.js
```

When we run the script we'll get this:

```console
$ node index.js
Execution Arguments: [ 'C:\\Program Files\\nodejs\\node.exe', 'E:\\Repos\\node-cli\\index.js' ]
I finished
```

## Let's make our CLI executable

To do this we have to talk about `Shebang` (`#!`) which is a sequence used on UNIX systems to indicate that a text file is an `executable` and its format is `#!interpreter [optional-arg]`.

So knowing this all we have to do is add at the beginning of our script the line `#!/usr/bin/env node` to tell the system that it is an executable file with the bin of `node`.

```js
#!/usr/bin/env node
// index.js
'use strict';

const processArgv = process.argv;

console.log('Execution Arguments: ', processArgv);
console.log('I finished');

```

But wait, we're gonna have to do two more things to make this work: 

- First add a branch to our `package.json` file as follows using the `name` we chose for our CLI as shown below:

```json
"bin": {
  "nodewk": "./index.js"
}

```

- Second, we must `link` our application, which will allow us to run our application as if it had been installed directly from `npm` and for that we only have to run:  

```console
npm link
```

And then we execute 

```console
nodewk
```

Then in console we have the following result

```console 
$ nodewk
Execution Arguments: [ 'C:\\Program Files\\nodejs\\node.exe', 'C:\\Program Files\\nodejs\\node_modules\\node-cli\\index.js' ]
I finished
```

Then we will be able to see how our application was linked as if it were a npm package since our script is executed from the `node_modules` folder of `nodejs` and this we notice in the index one of the arguments array `argv`.


# Chapter Two 🎬

> Obtain and process user parameters

## Let's get the user parameters 

Imagine that our CLI application `"nodewk"` has some actions, for this case we will use only `action`, and then in the console we enter the following:  

```console
$ nodewk action --param1 value1 --param2 value2 --param3 value3 --paramN valueN
```

Then we will modify our script to separate the system parameters from the user parameters and we have the following: 

```js
#!/usr/bin/env node
// index.js
'use strict';

const processArgv = process.argv;

if (!processArgv[2]) {
  console.log('No entry');
  process.exit(1);
} else {
  console.log('System params: ', processArgv.splice(0, 2));
  console.log('User params: ', processArgv.splice(2));
}
```
And by executing our command, we will have a result:

```console
$ nodewk action --param1 value1 --param2 value2 --param3 value3 --paramN valueN
System params:  [ 'C:\\Program Files\\nodejs\\node.exe', 'C:\\Program Files\\nodejs\\node_modules\\node-cli\\index.js' ]
User params:  [ 'action', '--param1', 'value1', '--param2', 'value2', '--param3', 'value3', '--paramN', 'valueN' ]
```
And as you can see we already have the user parameters.

## Processing user parameters

For this task we are going to require a function that receives the array of user arguments and allows us to manage it in a more efficient way, for example by means of an object, then our function would be the following one: 

```js
const convertArrayArgumentsToObjectArguments = (argsV, separator) => {
  // Convert args array to string command
  const commandStr = argsV.join(' ');
  // Create a new array througt the separator (--)
  const commandOptions = commandStr.split(separator);
  // Create a object options with the command action
  const options = {
    action: commandOptions[0].split(' ').filter(param => param !== '')[0],
  };
  // Delete the action element of array
  commandOptions.shift();
  for (let index = 0; index < commandOptions.length; index++) {
    // Build and array params
    const params = commandOptions[index].split(' ');
    // Filter garbage data for the addicional spaces
    const fixParams = params.filter(param => param !== '');
    // Set the option and value(s)
    options[fixParams[0]] = fixParams.length > 2 ? fixParams.slice(1) : fixParams[1];
  }
  return options;
}
``` 

Then our new script will look like this:

```js
#!/usr/bin/env node
'use strict';

const separator = '--';
const processArgv = process.argv;

const convertArrayArgumentsToObjectArguments = (argsV, separator) => {
  const commandStr = argsV.join(' ');
  console.log('Command: ', commandStr);
  const commandOptions = commandStr.split(separator);
  const options = {
    action: commandOptions[0].split(' ').filter(param => param !== '')[0],
  };
  commandOptions.shift();
  for (let index = 0; index < commandOptions.length; index++) {
    const params = commandOptions[index].split(' ');
    const fixParams = params.filter(param => param !== '');
    options[fixParams[0]] = fixParams.length > 2 ? fixParams.slice(1) : fixParams[1];
  }
  return options;
}

if (!processArgv[2]) {
  console.log('No entry');
  process.exit(1);
} else {
  console.log('System params: ', processArgv.slice(0, 2));
  const options = convertArrayArgumentsToObjectArguments(processArgv.splice(2), separator);
  console.log('User params: ', options);
}
```
Now we execute the following command

```console
nodewk ourAction --param1 value1A value1B --param2 value2A value2B value2C --param3 value3 --paramN valueN
```

And we will obtain the following result, where the options entered by the user are available in an object ready to be used

```console
$ nodewk ourAction --param1 value1A value1B --param2 value2A value2B value2C --param3 value3 --paramN valueN
System params: [ 'C:\\Program Files\\nodejs\\node.exe', 'C:\\Program Files\\nodejs\\node_modules\\node-cli\\index.js' ]
User params: { 
  action: 'ourAction',
  param1: [ 'value1A', 'value1B' ],
  param2: [ 'value2A', 'value2B', 'value2C' ],
  param3: 'value3',
  paramN: 'valueN' 
}
```

## Chapter Three 🎬 

Well, at this point we have almost everything ready for our CLI application, however we are going to organize a little our script creating a main function, we are going to refactor some code and also we are going to eliminate unnecessary logs.

```js
#!/usr/bin/env node
'use strict';

const separator = '--';

const convertArrayArgumentsToObjectArguments = (argsV, separator) => {
  const commandStr = argsV.join(' ');
  const commandOptions = commandStr.split(separator);
  const options = {
    action: commandOptions[0].split(' ').filter(param => param !== '')[0],
  };
  commandOptions.shift();
  for (let index = 0; index < commandOptions.length; index++) {
    const params = commandOptions[index].split(' ');
    const fixParams = params.filter(param => param !== '');
    options[fixParams[0]] = fixParams.length > 2 ? fixParams.slice(1) : fixParams[1];
  }
  return options;
}

const main = async () => {
  const processArgv = process.argv;
  if (!processArgv[2]) {
    console.log('No entry');
    process.exit(1);
  }
  const options = convertArrayArgumentsToObjectArguments(processArgv.splice(2), separator);
  console.log('User params: ', options);
}

main();
```

And we verify that nothing happened, so we have

```js
$ nodewk ourAction --param1 value1A value1B --param2 value2A value2B value2C --param3 value3 --paramN valueN
User params:  { 
  action: 'ourAction',
  param1: [ 'value1A', 'value1B' ],
  param2: [ 'value2A', 'value2B', 'value2C' ],
  param3: 'value3',
  paramN: 'valueN' 
}
```





