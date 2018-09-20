function sleep(time = 1000) {
  return new Promise(resolve =>
    setTimeout(() => {
      // received = true;
      resolve();
    }, time)
  );
}

module.exports = {
  sleep
};
