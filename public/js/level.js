
function getLevel(exp) {

  let previous = 0;
  for (let i = 1; i < 10; i++) {

    if ((previous + i)*1000 > exp) {
      return i;
    }

    previous = i;
  }


}