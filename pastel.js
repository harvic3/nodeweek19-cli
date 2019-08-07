#!/usr/bin/env node
'use strict';

const command = 'myCliApp action --param1 value1 --param2 value2A value2B value2C --param3 value3 --paramN valueN';
const separator = '--';
const spliceAmount = 1;
const processArgv = process.argv;

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

console.log('Debug process: ', process.debugPort);
if (process.debugPort !== 9229){
  processArgv.push(...command.split(separator));
}

console.log('System params: ', processArgv.splice(0, 2));

if (processArgv[0]){
  const params = process.argv.slice(spliceAmount);
  console.log('User params: ', params);
  const options = convertArrayArgumentsToObjectArguments(params, separator);
  console.log('Options: ', options);
  console.log('--param1', options.param1);
}else{
  console.log('No entry');
  process.exit(1);
}

/*
¿Por qué usar un paquete conocido para algo tan simple?, ejemplo usar 
handlebars para reemplazar un texto cuando podríamos hacerlo con una 
simple función de 5 líneas
*/
const message = { 
  ES: `Hola {{userName}} {{userLastName}}, 
tu clave para ganar es {{userName}}{{city}}.
{{userName}} recuerda que si ganas debes reclamar tu premio en {{city}}.`,
  EN: `Hi {{userName}} {{userLastName}}, 
your key for win in {{userName}}{{city}}.
Remember that if you wind you must claim your prize in {{city}}`,
}
const translateParams = {
  userName: 'Alien',
  userLastName: 'Funny',
  city: 'Alienville',
  lang: 'ES',
}

function processTranslateParams(translateParams, textToProcess, lang) {
  let newText = textToProcess[lang];
  for (let paramName in translateParams) {
    const paramValue = translateParams[paramName];
    const pattern = new RegExp(`(\{\{)(${paramName})(\}\})`, 'g');
    newText = newText.replace(pattern, paramValue);
  }
  return newText;
}

console.log('Translate: ', processTranslateParams(translateParams, message, translateParams.lang));
