function capitalized(string) {
  return string[0].toUpperCase() + string[1].toLowerCase() + string[2].toUpperCase() + string.slice(3).toLowerCase();
}
module.exports = capitalized;
