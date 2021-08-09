/**
 * 公共配置文件
 */
import $config from '../../config'


const configDict = {
	development: {
		baseURL: '/H5QuickBuild'
	},
	production: {
		baseURL: $config.baseURL
	}
}

const currentConfigKey = process.env.NODE_ENV
const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'development'

const configObj = {
	isDevelop: (isDev || isTest),
	...configDict[currentConfigKey],
	// h5模式宽高
	canvasH5Width: 375,
	canvasH5Height: 667,
	baseViewURL: "/H5QuickBuildView"
}

export default configObj