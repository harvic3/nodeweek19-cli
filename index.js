#!/usr/bin/env node
'use strict';

const separator = '--';

// PORT - This code is only for debugger
if (process.debugPort !== 9229){
  console.log('Debug process: ', process.debugPort);
  const command = 'action  --param1 value1A value1B  --param2 value2A value2B value2C --param3 value3 --paramN valueN';
  processArgv.push(...command.split(' '));
}
// PORT End

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

const processAction = options => {
  const action = options.action;
  delete options.action;
  switch (action) {
    case 'create':
      console.log('We to create something with this params: ', options);
    break;
    case 'search':
      console.log('We to search something with this params: ', options);
    break;
    case 'edit':
      console.log('We to edit something with this params: ', options);
    break;
    case 'delete':
      console.log('We to delete something with this params: ', options);
    break;
    case 'process':
      console.log('We to process something  with this params: ', options);
    break;
    default: 
      console.log('You must send a valid action.');
  }
}

const main = async () => {
  const processArgv = process.argv;
  if (!processArgv[2]) {
    console.log('No entry');
    process.exit(1);
  }
  const options = convertArrayArgumentsToObjectArguments(processArgv.splice(2), separator);
  processAction(options);
}

main();