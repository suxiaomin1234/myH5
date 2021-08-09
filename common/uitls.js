/**
 * 生成uuid方法 列：9ed3f33f-7c1c-4684-be83-cb62315687d8
 * @returns {string}
 */
export const createUUID = function () {
	var d = new Date().getTime();
	/**
	 * window.performanc
	 * 浏览器暴露给js的一个接口，可以通过这个接口查看用户访问网站的连接建立时间、dns时间等信息。
	 * 使用该api时需要在页面完全加载完成之后才能使用，
	 * 最简单的办法是在window.onload事件中读取各种数据，因为很多值必须在页面完全加载之后才能得出。
	**/
	if (window.performance && typeof window.performance.now === "function") {
		d += performance.now(); //use high-precision timer if available
	}
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}

/**
 * 深拷贝
 * @param {*} obj 拷贝对象(object or array)
 * @param {*} cache 缓存数组
 */
export const deepClone = function (obj, cache = []) {
	// typeof [] => 'object'
	// typeof {} => 'object'
	if (obj === null || typeof obj !== 'object') {
		return obj
	}
	// 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
	/**
	 * 类似下面这种
	 * var a = {b:1}
	 * a.c = a
	 * 资料: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
	 */
	const hit = cache.filter(c => c.original === obj)[0]
	if (hit) {
		return hit.copy
	}

	const copy = Array.isArray(obj) ? [] : {}
	// 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
	cache.push({
		original: obj,
		copy
	})
	Object.keys(obj).forEach(key => {
		copy[key] = deepClone(obj[key], cache)
	})

	return copy
}

