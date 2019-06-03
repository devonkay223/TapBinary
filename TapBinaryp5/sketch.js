let level = null;
let source = null;
let data = []; // relevant audio input get stored in data (reset between noise chunks)
let AmpMid= 4.7;  // can be adjusted based on enviroment
let Silence= 0.07;  // noise below this level is background noise
let Quiet= 2.5; // can be adjusted based on enviroment
let analyzed= true;
let binOut= ""; // binary output
let noise = null;

function setup() {
  // initalize a background
  createCanvas(window.innerWidth, window.innerHeight);

  button = createButton('analyze');
  fill(255);
  button.mousePressed(analyzeButton);

  button = createButton('begin');
  fill(255);
  button.mousePressed(begin);
  //data = new FloatList();
  source = new p5.AudioIn();
  source.start();
  // get audio input and record amplitude
  level = new p5.Amplitude();
  level.setInput(source);

}

function begin() {
  getAudioContext().resume();
}

//runs continuously (default 60 times per second)
function draw() {
  noise = source.getLevel();
  // check if the noise is background noise
  if (noise > Silence) {
    // if not print noise (float value)
    print("noise" + noise);
    // add noise to data
    data.push(noise);
    print("data push" + data.push(noise));
    analyzed = false; //there is new noise input that has not been analyzed yet
  }
  else if (analyzed == false) {
    // if there is currently just background noise
    analyzeNoise();
    analyzed= true; // the previous chunk of data has been analyzed
  }
}

// End sketch and get output by pressing mouse
function analyzeButton() {
  print("mousePressed")
  // analyze the last chunk of data
  analyzeNoise();
  // print the accumulated binary output
  print(binOut);
  // check if binary string can be translated
   if (canTrans()) {
    // translate binary to English
    print(getText());
   }
   else {
     print("Cannot be translated");
   }
  // end sketch
  print("trying to exit")
  remove();
}

// check if binary can be translated
function canTrans() {
  print("canTrans")
  let trans = false;
  // check if binary string is evenly divisible by 8
  if (binOut.length % 8 == 0){
    trans = true;
  }
  return trans;
}

// translate binary to English
function getText() {
  print("getText")
  let word = "";
  // traverse binary string in bytes and translate
  for (let i =0; i < binOut.length; i+=8) {
    // get byte
    let str = binOut.substring(i, i+8);
    // translate byte to int
    let num = unbinary(str);
    // translate int to char and add to total translated text
    word += char(num);
  }
  return word; // return total translated text
}

// analyze previous data chunk
function analyzeNoise() {
  print("analyzeNoise")
  let total =0.0;

  // output 0 or 1 based on tota value of data from last chunk (silence or noise)
  for(let j=0; j < data.length; j=0) {
    // add up all audio input in data
    total+= data[j];
    // remove values from data so next audio chunk starts fresh
    data.shift(j);
  }

  // print total value of last chunk of audio input
  print("total: " + total);

  // if total is loud print 0
  // AmpMid can be adjusted for your enviroment
  if(total > AmpMid) {
    binOut+= "0";
    print(0);
    // visual output white
    fill(250);
  }

  // if total is quiet but not silent print 1 (no noise)
  if(Quiet < total && total < AmpMid){
    binOut+= "1";
    print(1);
    // visual output black
    fill(0);

  }
}
