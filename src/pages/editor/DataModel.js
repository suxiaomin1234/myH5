import { createUUID, deepClone } from "../../../common/uitls";
import filter  from '../../filters/index'
/*
lodash 一个工具类 让 JavaScript 变得更简单
https://www.lodashjs.com/
遍历 array、object 和 string
对值进行操作和检测
创建符合功能的函数
*/
/*
_.cloneDeep(value)# 类似_.clone，除了它会递归拷贝 value。（注：也叫深拷贝）。
列子
var objects = [{ 'a': 1 }, { 'b': 2 }];
var deep = _.cloneDeep(objects);
console.log(deep[0] === objects[0]);
*/
/*
_.merge(object, [sources])#
类似_.assign， 除了它递归合并 sources 来源对象自身和继承的可枚举属性到 object 目标对象。
如果目标值存在，被解析为undefined的sources 来源对象属性将被跳过。数组和普通对象会递归合并，
其他对象和值会被直接分配覆盖。源对象从从左到右分配。后续的来源对象属性会覆盖之前分配的属性。
Note: 这方法会改变对象 object.
object (Object): 目标对象。
[sources] (...Object): 来源对象。
列子
var object = {
  'a': [{ 'b': 2 }, { 'd': 4 }]
};
var other = {
  'a': [{ 'c': 3 }, { 'e': 5 }]
};
_.merge(object, other);
// => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
*/
import { cloneDeep, merge } from "lodash";
import $config from "@src/config";
// 元素配置信息字段
let elementConfig = {
  elName: "", // 组件名
  animations: [], // 动画
  commonStyle: {
    position: "absolute",
    width: $config.canvasH5Width,
    height: 30,
    top: 200,
    left: 0,
    rotate: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderWidth: 0,
    borderColor: "",
    borderStyle: "solid",
    borderRadius: 0,
    boxShadow: "",
    textShadow: "",
    fontFamily: "WRYH",
    writingMode: "horizontal-tb",
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1,
    letterSpacing: 0,
    textAlign: "left",
    //whiteSpace: 'pre-line',
    color: "#000000",
    backgroundColor: "",
    backgroundImage: "",
    backgroundSize: "cover",
    opacity: 1,
    zIndex: 1,
    wordBreak: "break-all",
    scaleX:0.5,
    scaleY:1,
    // overflow: 'hidden'
  }, // 公共样式
  events: [], // 事件
  propsValue: {}, // 属性参数
  value: "", // 绑定值
  valueType: "String", // 值类型
};
// 页面配置信息字段
let pageConfig = {
  name: "",
  elements: [],
  commonStyle: {
    backgroundColor: "",
    backgroundImage: "",
    backgroundSize: "cover",
    animations: [],
  },
  config: {},
};
// 项目配置信息字段
let projectConfig = {
  name: "",
  title: "未命名场景",
  description: "我用可视化编辑器做了一个超酷炫的H5，快来看看吧。",
  coverImage: "",
  auther: "",
  script: "",
  width: $config.canvasH5Width,
  height: $config.canvasH5Height,
  pages: [],
  shareConfig: {
    shareWx: false,
    coverImage: "",
    title: "这是#分享者#的大力推荐",
    description: "这是#分享者#的大力推荐",
  },
  pageMode: "h5", // 渲染模式
  flipType: 0, // 翻页模式
  slideNumber: false, // 翻页是否显示页码翻页指示
  add_time: 0,
  up_time: 0,
  status: 1, // 0 不允许访问， 1 允许访问
  isPublish: false,
  isTemplate: false,
};

let getElementConfig = function(element, extendStyle = {}) {
  let elementData = cloneDeep(element);
  let type = elementData.valueType || "String"; // 默认string类型
  let dict = {
    Sting: "",
    Array: [],
    Object: {},
    Boolean: false,
    Number: 0,
    // 待扩展数据类型
  };
  let elementConfigData = cloneDeep(elementConfig);
  let config = {
    uuid: createUUID(),
    ...elementConfigData,
    elName: elementData.elName,
    propsValue: deepClone(elementData.needProps || {}),
  };
  // 样式
  config.commonStyle = merge(config.commonStyle, elementData.defaultStyle);
  config.commonStyle = merge(config.commonStyle, extendStyle);

  config.value = element.defaultValue || dict[type];
  config.valueType = type;
  config.isForm = !!element.isForm;
  return config;
};
let copyElement = function(element, extendStyle = {}) {
  element = cloneDeep(element);
  element.uuid = createUUID();
  element.commonStyle = merge(element.commonStyle, extendStyle);
  // 加上一点偏移量，以作区分
  // element.commonStyle.top = element.commonStyle.top + 10
  // element.commonStyle.left = element.commonStyle.left + 10
  return element;
};
// 初始化uuid,并把项目配置信息字段解构到同个对象返回
let getPageConfig = function() {
  return {
    uuid: createUUID(),
    ...cloneDeep(pageConfig),
  };
};
let copyPage = function(data) {
  let pageData = cloneDeep(data);
  pageData.uuid = createUUID();
  pageData.elements = pageData.elements.map((element) => {
    return copyElement(element);
  });
  return pageData;
};

let getProjectConfig = function() {
  // 深拷贝项目配置信息字段
  let project = cloneDeep(projectConfig);
  // 获取uuid及页面配置信息字段对象
  let onePage = getPageConfig();
  // 解构赋值给page
  project.pages.push({
    ...onePage,
  });
  // console.log(project)
  return {
    ...project,
  };
};

/**
 * 获取元素样式
 * @param styleObj
 * @param scalePoint 缩放比例
 */
let getCommonStyle = function(styleObj, scalingRatio = 1) {
  let needUnitStr = [
    "width",
    "height",
    "top",
    "left",
    "paddingTop",
    "paddingLeft",
    "paddingRight",
    "paddingBottom",
    "marginTop",
    "marginLeft",
    "marginRight",
    "marginBottom",
    "borderWidth",
    "fontSize",
    "borderRadius",
    "letterSpacing"
  ];
  let style = {};

  for (let key in styleObj) {
    if (needUnitStr.includes(key)) {
      style[key] = styleObj[key] * scalingRatio + "px";
    } else {
      style[key] = styleObj[key];
    }
  }
  style.transform = `rotate(${style.rotate}deg)`;
  // let imgUrl = style.backgroundImage ? style.backgroundImage : ''; //请求到的图片路径
//   dealImage(imgUrl,function(base64){
//     console.log(base64)
//   })
//   function dealImage(path, callback){  
//     var img = new Image();  
//     img.src = path;  
//     img.onload = function(){  
//         //默认按比例压缩  
//         // var w = this.width,  
//         //     h = this.height; 
//         var quality = 0.95; // 默认图片质量为0.7  
          
//         //生成canvas  
//         var canvas = document.createElement('canvas');  
//         var ctx = canvas.getContext('2d');  
          
//         // 创建属性节点  
//         // canvas.setAttribute("width", w);  
//         // canvas.setAttribute("height", h);
                
//         ctx.drawImage(img, 0, 0);  
//         // quality值越小，所绘制出的图像越模糊  
//         var base64 = canvas.toDataURL('image/jpeg', quality);  
//         // 回调函数返回base64的值  
//         callback(base64);  
//     };  
// };
// console.log(filter)
  style.backgroundImage = style.backgroundImage
    ? `url(${filter.replaceIP(style.backgroundImage) })`
    : "";
  return style;
};

// function getEleByElName(elName) {
// 	let list = [];
// 	eleConfig.forEach(item => {
// 		list = [...list, ...item.components]
// 	})
// 	return list.find(v => {return v.elName === elName})
// }

export default {
  elementConfig,
  pageConfig,
  projectConfig,
  getElementConfig,
  getPageConfig,
  getProjectConfig,
  copyPage,
  copyElement,
  getCommonStyle,
};
