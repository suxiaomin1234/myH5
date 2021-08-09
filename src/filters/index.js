/**
 * 封装些共用的过滤器
 */
const filter = {
	/**
	 * 将 boolean 转换成 文字是否
	 * @param value
	 * @returns {string}
	 */
	booleanToText: function (value) {
		return value ? '是' : '否'
	},
	/**
	 * 根据value获取label
	 * @param value
	 * @param list 对象列表
	 */
	getLabelText(value, list, label = 'label') {
		console.log(1, value, list, label)
		let data = list.find(v => v.value === value);
		if (data) {
			return data[label];
		} else {
			return ''
		}
	},
	/**
	 * 全局替换绝对路径脚本 -- （系统）
	 */
	replaceIP(str) {
		if (str) {
			if (typeof (str) == 'string') {
				str = str.replaceAll('http://172.19.80.80:8932', '')
			} else {
				str = JSON.stringify(str).replaceAll('http://172.19.80.80:8932', '')
			}
			return str
		}
		return ''
	},
	/**
	 * 全局替换绝对路径 -- 展示页面 （客户）
	 */
	replaceExiIP(str) {
		if (str) {
			if (typeof (str) == 'string') {
				str = str.replaceAll('http://172.19.80.80:8932', '')
			} else {
				str = JSON.parse(JSON.stringify(str).replaceAll('http://172.19.80.80:8932', ''))
			}
			return str
		}
		return ''
	}
}

export default filter