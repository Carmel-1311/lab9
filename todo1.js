function display() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function randomNumber() {
  return Math.floor((Math.random() * 10) + 1);
}

async function lottery() {
  let evenCount = 0;
  for (let round = 1; round <= 3; round++) {
    console.log("Wait 2 second ...");

    const num = randomNumber();
    await display();
    console.log(`Num ${round} : ${num}`);
    if (num % 2 === 0) {
      evenCount++;
    }  
    else break;
  }
  if (evenCount === 3){
        console.log("you win")
    }
    else{
        console.log("you lost")
    }
}

lottery();
