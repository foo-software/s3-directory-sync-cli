// if the value is assigned as an argument get that... otherwise `undefined`
const getArgument = (name) => {
  const index = process.argv.indexOf(`--${name}`);

  if (index < 0) {
    return undefined;
  }

  return process.argv[index + 1];
};

module.exports.convertOptionsFromArguments = options => Object.keys(options)
  .reduce((accumulator, current) => {
    // get the argument value
    const argumentValue = getArgument(current);

    // if the value doesn't exist from an argument, use the existing option / value
    let value = typeof argumentValue !== 'undefined'
      ? argumentValue
      : options[current];

    // convert string boolean to boolean
    if (typeof value === 'string') {
      const lowerCaseValue = value.toLowerCase();
      if (lowerCaseValue === 'true') {
        value = true;
      } else if (lowerCaseValue === 'false') {
        value = false;
      }
    }

    return {
      ...accumulator,
      [current]: value,
    };
  }, {});
