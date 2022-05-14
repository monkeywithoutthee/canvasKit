// get references to the canvas and context
const canvas = document.getElementById("canvas");
const overlay = document.getElementById("overlay");
const ctx = canvas.getContext("2d");
const ctxo = overlay.getContext("2d");
const canBackground = document.getElementById('canBack');
const ctxb = canBackground.getContext('2d');

var sl = window.localStorage;
    //  sl.clear();//be very very careful with this!! it wipes everything. Never ever put it live!!

// calculate where the canvas is on tzhe window
var x = canvas.getClientRects();
//console.log(x,'<<canvas');
var oPage = {
  options:['square','circle','grade'],
  currentOption:'square',
  canvasSize:{width:600,height:300},
  offsetX:x[0].left,
  offsetY:x[0].top,
  isDown:false,
  startX:null,
  startY:null,
  prevStartX:0,
  prevStartY:0,
  prevWidth:0,
  prevHeight:0,
  mouseX:0,
  mouseY:0,
  lastPoint:{x:null,y:null},
  isPathStarted:false,
  selColors:['#ffff00','#ff0000','#00ff00'],
  images:[],
  currentImage:0
};
//image will have layers, layers will have data, data will differ on shape
/*images[
  {
  imagedata:[
  {
  type:'square',
  move:{}
  }
            ]
  }
]


]*/
//var index = oPage.options.indexOf(oPage.currentOption);
//document.getElementById('colPickr').value = oPage.selColors[oPage.options.indexOf(oPage.currentOption)];
// style the context
ctx.strokeStyle = oPage.selColors[oPage.options.indexOf(oPage.currentOption)];
ctx.lineWidth = 3;
ctxo.strokeStyle = oPage.selColors[oPage.options.indexOf(oPage.currentOption)];
ctxo.lineWidth = 2;
const handleMouseDown = ((event)=>{
    event.preventDefault();
    event.stopPropagation();
  //  ctxo.font = '48px serif';
  //  ctxo.strokeText('booom', 10, 50);
    // save the starting x/y of the rectangle
    oPage.startX = parseInt(event.clientX - oPage.offsetX);
    oPage.startY = parseInt(event.clientY - oPage.offsetY);
    if (event.shiftKey){
      oPage.isPathStarted = false;
      return;
    };
    if (oPage.currentOption==='grade'){
      if (!oPage.isDown){
        ctxo.beginPath();
      };
      if (oPage.isPathStarted){
        oPage.images[oPage.currentImage].imagedata.push({type:'grade',move:{x:oPage.lastPoint.x,y:oPage.lastPoint.y}});
        ctxo.lineTo(oPage.lastPoint.x,oPage.lastPoint.y);
      };
      oPage.images[oPage.currentImage].imagedata.push({type:'grade',move:{x:oPage.startX,y:oPage.startY}});
      ctxo.lineTo(oPage.startX,oPage.startY);
      ctxo.stroke();
      oPage.lastPoint.x = oPage.startX;
      oPage.lastPoint.y = oPage.startY;
      oPage.isPathStarted = true;
     //console.log('in grade DOWN::',oPage.images[oPage.currentImage])
    };

    oPage.isDown = true;

  //console.log('mouse down start::',oPage.images[oPage.currentImage]);
    return;
});

const handleMouseUp = ((event)=>{
    event.preventDefault();
    event.stopPropagation();
    // the drag is over, clear the dragging flag
    oPage.startX = parseInt(event.clientX - oPage.offsetX);
    oPage.startY = parseInt(event.clientY - oPage.offsetY);

    if (oPage.currentOption==='square'){
      ctx.strokeStyle = oPage.selColors[0];
      ctxo.strokeStyle = oPage.selColors[0];
      //add image data (type and move);
      oPage.images[oPage.currentImage].imagedata.push({type:'square',move:{x:oPage.prevStartX,y:oPage.prevStartY,width:oPage.prevWidth,height:oPage.prevHeight}});
      ctxo.strokeRect(oPage.prevStartX, oPage.prevStartY, oPage.prevWidth, oPage.prevHeight);
    };
    if (oPage.currentOption==='circle'){
      ctx.strokeStyle = oPage.selColors[1];
      ctxo.strokeStyle = oPage.selColors[1];
      if (oPage.prevWidth/2>1){
                oPage.images[oPage.currentImage].imagedata.push({type:'circle',move:{x:oPage.prevStartX *1+(oPage.prevWidth/2),y:oPage.prevStartY *1+(oPage.prevWidth/2),radius:oPage.prevWidth/2,starta:0,enda:360}});
        ctxo.beginPath();
        ctxo.arc(oPage.prevStartX *1+(oPage.prevWidth/2), oPage.prevStartY *1+(oPage.prevWidth/2), oPage.prevWidth/2, 0, 360);
        ctxo.stroke();
      };
    //  console.log(oPage.prevStartX,oPage.prevStartY,'<<drawing circle MUP!:',oPage.prevWidth,oPage.prevHeight);
    };
   if (oPage.currentOption==='grade'){
     ctx.strokeStyle = oPage.selColors[2];
     ctxo.strokeStyle = oPage.selColors[2];
     //note - adding image data on multi shape is done on mousedown

      oPage.lastPoint.x = oPage.startX;
      oPage.lastPoint.y = oPage.startY;
    //  console.log('in mouseup grade');
    };
    oPage.isDown = false;
});

const handleMouseOut = ((event)=>{
    event.preventDefault();
    event.stopPropagation();
    // the drag is over, clear the dragging flag
    oPage.isDown = false;
});

const handleMouseMove = ((event)=>{
    event.preventDefault();
    event.stopPropagation();

    // if we're not dragging, just return
    if (!oPage.isDown&&oPage.currentOption!=='grade') {
       return;
    }
    // get the current mouse position
    oPage.mouseX = parseInt(event.clientX - oPage.offsetX);
    oPage.mouseY = parseInt(event.clientY - oPage.offsetY);
    // calculate the rectangle width/height based
    // on starting vs current mouse position
    const width = oPage.mouseX - oPage.startX;
    const height = oPage.mouseY - oPage.startY;

    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw a new rect from the start position
    // to the current mouse position
    if (oPage.currentOption==='square'){
      ctx.borderRadius = "50";
      ctx.strokeRect(oPage.startX, oPage.startY, width, height);
    };
    if (oPage.currentOption==='circle'){
      if (width>1){
        ctx.beginPath();
        ctx.arc(oPage.startX*1+(width/2), oPage.startY*1+(width/2), width/2, 0, 360);
        ctx.stroke();
      };
    };
    if (oPage.currentOption==='grade'&&oPage.isPathStarted){
      //ctx.lineTo(oPage.mouseX-50, oPage.mouseY-50);
      ctx.beginPath();
      ctx.lineTo(oPage.lastPoint.x,oPage.lastPoint.y);
      ctx.lineTo(oPage.mouseX, oPage.mouseY);
      ctx.stroke();
      //console.log(oPage.startX,oPage.startY,'<<drawing grade!::',oPage.mouseX,oPage.mouseY);
    };
    oPage.prevWidth  = width;
    oPage.prevHeight = height;
    oPage.prevStartX = oPage.startX;
    oPage.prevStartY = oPage.startY;
});
const removeClass = ((data)=>{
    //data = {class:''};
    var o = document.querySelectorAll('.'+data.class);
    if (o){
      o.forEach((item, i)=>{
        item.classList.remove(data.class);
      });
    };
});
canvas.addEventListener('mousedown',(event)=>{
  handleMouseDown(event);
});
canvas.addEventListener('mousemove',(event)=>{
  handleMouseMove(event);
});
canvas.addEventListener('mouseup',(event)=>{
  handleMouseUp(event);
});
canvas.addEventListener('mouseout',(event)=>{
  handleMouseOut(event);
});
document.addEventListener('click',(event)=>{
  //universal click filtered by class?
  //console.log('clicking::',event);
  const evTar = event.target;
  if (evTar.className.includes('optionEl')){
    removeClass({class:'optionElHigh'});
    if (evTar.innerText==='square'){
      oPage.currentOption = 'square';
    };
    if (evTar.innerText==='circle'){
      oPage.currentOption = 'circle';
    };
    if (evTar.innerText==='grade'){
      oPage.currentOption = 'grade';
    };
    evTar.classList.add('optionElHigh');
    oPage.isDown = false;
    oPage.isPathStarted = false;
    const index = oPage.options.indexOf(oPage.currentOption);
    document.getElementById('colPickr').value = oPage.selColors[index];
    ctx.strokeStyle = oPage.selColors[index];
    ctxo.strokeStyle = oPage.selColors[index];
    //console.log(oPage.currentOption,'<<in optionEl SQ');
    return;
  };
  if (evTar.className.includes('imageOptsEl')){
      if (evTar.innerText==='save'){
          setLocal('page',oPage);
      };
      if (evTar.innerText==='add_box'){
        removeClass({class:'imSelClass'});
        oPage.images.push({imagedata:[]});
        oPage.currentImage = oPage.images.length-1;
        setLocal('page',oPage);
        evTar.classList.add('imSelClass');
        drawstuff();
      };
    //  console.log(oPage.images,'<<in imageOptsEl::',evTar.innerText);
    return;
  };
  if (evTar.className.includes('savedImageTnEl')){
    //opens an image from the tn menu
    removeClass({class:'imSelClass'});
    var holder = document.querySelector('.imagesDiv');
    const index = Array.from(holder.childNodes).indexOf(evTar);
    oPage.currentImage = index;
    evTar.classList.add('imSelClass');
    drawstuff();
  //  console.log(evTar,'<<savedImageTnEl index::',index,holder);
  };
});
document.getElementById('colPickr').addEventListener('change',(event)=>{
  changeOptionCol({value:event.target.value});
//console.log('colPickr::',event.target.value);
});
document.addEventListener('DOMContentLoaded',(event)=>{
  //open the last image OR start a new one
  var x = getLocal('page');
  //console.log('innit::',x);
  if (x){
    oPage = x;
  };
  if (oPage.images.length===0){
    oPage.images.push({imagedata:[{type:oPage.currentOption,moves:[]}]})
    drawSavedImageTN();
  }else{
    //else draw last image
    drawstuff();
    drawSavedImageTN();
  };
  //optionElHigh
  var opt = document.querySelectorAll('.optionEl');
  var index = oPage.options.indexOf(oPage.currentOption);
  //optionElHigh
//  opt[index].firstChild.classList.add('optionElHigh');
    //console.log(oPage.images,'<<DOMContentLoaded::',opt[index],index,x);
});
const changeOptionCol = ((data)=>{
  //data = {value:''};
  const index = Array.from(oPage.options).indexOf(oPage.currentOption);
  oPage.selColors[index] = data.value;
  ctxo.strokeStyle = oPage.selColors[index];
  ctx.strokeStyle = oPage.selColors[index];
  //console.log(data,'<<',index,oPage.selColors);

});
const drawstuff = (()=>{
  console.log('drawstuff::', oPage.images[oPage.currentImage]);
  oPage.canvasSize={width:600,height:300};//temp!
  ctx.clearRect(0,0,oPage.canvasSize.width,oPage.canvasSize.height);
  ctxo.clearRect(0,0,oPage.canvasSize.width,oPage.canvasSize.height);
  const o = oPage.options;
  for (var i=0;i<o.length;i++){
    var x =

  }
/*  for (var i = 0; i < oPage.data.length; i++){
    ctx.beginPath();
    oPage.data[i].forEach((item, i) => {
      ctx.lineTo(item.x, item.y);
    });
    ctx.stroke();
  };*/
});
var drawSavedImageTN = (()=>{
  var sHTML = '';
  var tns = oPage.images;
  if (tns){
    tns.forEach((item, i) => {
      var imSelClass = '';
      if (oPage.currentImage === i){
        imSelClass = ' imSelClass';
      }
      sHTML += `<div class='savedImageTnEl${imSelClass}'>${i}</div>`;
    });
  };

  document.querySelector('.imagesDiv').innerHTML = sHTML;
  var x = canvas.getClientRects();
  oPage.offsetX = x[0].left;
  oPage.offsetY = x[0].top;
});

function getLocal(name){
    return JSON.parse(sl.getItem(name));
}
function setLocal(name,data){
  //  console.log(name,'<<setLocal::',JSON.stringify(data));
    sl.setItem(name,JSON.stringify(data))
    return true;
}
