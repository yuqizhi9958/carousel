/**
 *
 * @param num  移动距离
 * @param tep  移动步长
 * @param sec  移动时间
 * @param ele  移动元素
 */
function moveLeft(num,tep,sec,ele) {//移动距离，移动步长，移动时间，移动元素
  clearInterval(ele.timerId);
  ele.timerId = setInterval(function () {
    var divleft = ele.offsetLeft;
    var temp = num > divleft ? tep:-tep;//修改这两个代码
    divleft += temp;
    if(Math.abs(num - divleft) > Math.abs(temp)){//修改这两个代码
      ele.style.left = divleft+"px";
    }else {
      ele.style.left = num + "px";
      clearInterval(ele.timerId);
    }
  },sec)
};


/**
 * 自动轮播图函数
 */
function nextPic() {
  if(picIndex == 5){
    ul.style.left="0px"
    picIndex = 0;
  }
  picIndex++;
  var target = -picIndex * moveWidth;
  moveLeft(target,10,10,ul);
  for(var i = 0 ; i < ollis.length ; i++){
    ollis[i].removeAttribute("class");
  }
  liIndex++;
  if(liIndex == 5){
    liIndex = 0;
  }
  ollis[liIndex].setAttribute("class","current");
}


/**
 * 封装的动画函数！
 * @param target 目标位置
 * @param ele 移动的元素
 */

function animateSlow(ele,obj,fn){
  clearInterval(ele.timerId);
  //设置计时器
  ele.timerId = setInterval(function () {

    var flag = true;
    for(var key in obj){
      if(key == "z-index"){
        ele.style[key] = obj[key];
      }else if(key == "opacity"){
        var currentLeft = getStyle(ele,key) * 100;

        var step = (obj[key]*100-currentLeft)/10;
        step = step < 0 ? Math.floor(step) : Math.ceil(step);
        //3.计算
        currentLeft += step;
        //4.判断赋值
        console.log(key+"--step:"+step+"----currentLeft"+currentLeft);

        ele.style[key] = currentLeft/100;

        if(obj[key]*100 != currentLeft){
          flag = false;
        }

      }else {

        var currentLeft = parseInt(getStyle(ele,key));

        var step = (obj[key]-currentLeft)/10;
        step = step < 0 ? Math.floor(step) : Math.ceil(step);
        currentLeft += step;
        console.log(key+"--step:"+step+"----currentLeft"+currentLeft);

        ele.style[key] = currentLeft + "px";

        if(obj[key] != currentLeft){
          flag = false;
        }
      }
    }

    if(flag){
      clearInterval(ele.timerId);
      if(Object.prototype.toString.call(fn) == "[object Function]"){
        fn();
      }
    }
  },20);
}

/**
 * 获取元素的样式值
 * @param ele 元素
 * @param attr 样式名
 * @returns {*} 返回的样式值
 */
function getStyle(ele,attr){
  //能力检测(判断当前浏览器是否支持某个方法或者属性.)
  if(ele.currentStyle){
    //如果进到了这里,说明当前浏览器是ie8及他之前的浏览器.
    return ele.currentStyle[attr];
  }else {
    //如果进到了这里,说明当前浏览器是谷歌/火狐/ie9及以后.
    return window.getComputedStyle(ele,null)[attr];
  }
}

/**
 * 封装一个函数，用来获取页面的clientWidth和页面的clientHeight
 * @returns {{clientWidth: number, clientHeight: number}}
 */
function getClient() {
  return {
    clientWidth : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0,
    clientHeight : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0,
  }
}


//获取页面的scrollTop和页面的scrollLeft
function getScroll(){
  return {
    scrollLeft : window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
    scrollTop : window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
  };
}





/**
 * 封装一个函数做兼容，获取pageX和pageY的值
 * @returns {{pageX: *, pageY: *}}
 */

function getPage(e) {
  e = e || window.event;
  return {
    //如果你的浏览器支持e.pageX，直接获取就好了。
    //如果你的浏览器不支持e.pageX，那就计算出这个值（当前可视区的距离加上滚出去的距离。）
    pageX : e.pageX || e.clientX + getScroll().scrollLeft,
    pageY : e.pageY || e.clientY + getScroll().scrollTop,
  }
}




// 不同的浏览器，获取事件对象e 的page方式不一样
//谷歌和火狐，ie9季候的浏览器支持这个page
//ie8以前的不支持，要通过计算获取
//兼容函数
function getEventPage(e) {
  e = e || window.event;
  return {
    pageX: e.pageX || document.documentElement.scrollLeft + e.clientX,
    pageY: e.pageY || document.documentElement.scrollTop + e.clientY
  }
}



/**不同的浏览器，给元素注册多个同样的事件，有不同的方式，所有要做兼容处理

 *
 * @param obj 元素
 * @param type  string 事件名称
 * @param listener  事件处理程序
 */
function setEventListener(obj,type,listener) {
  if(obj.attachEvent){
    //如果进到这里来了就说明当前浏览器是ie8及以前的
    obj.attachEvent("on"+type,listener);
  }else if(obj.attachEvent == undefined){
    //如果进到这里来了就说明当前的浏览器就是谷歌火狐浏览器
    obj.addEventListener(type,listener,false);
  }else {
    obj["on"+type] = listener;
  }
}

/**
 * //移除事件兼容处理
 * @param obj 元素
 * @param type string 事件名称
 * @param listener 事件处理程序
 */
function removeEvent(obj,type,listener){
  //能力检测
  if(obj.detachEvent){
    //ie8及之前
    obj.detachEvent("on"+type,listener);
  }else if(obj.detachEvent == undefined){
    //谷歌/火狐/ie9及以后
    obj.removeEventListener(type,listener,false);
  }else {
    obj["on"+type] = null;
  }
}

