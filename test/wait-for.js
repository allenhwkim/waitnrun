function waitFor(seconds) {

  return new Promise(resolve => {
    (function loop(i=0) {
      if (i<seconds) {
        setTimeout(() => {
          // console.log('waiting', i+1, `second${i===0?'':'s'}`);
          loop(i+1);
        }, 1000);
      } else {
        resolve(true);
      }
    }());
  })
}

module.exports = waitFor;
