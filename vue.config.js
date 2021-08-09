const path = require('path')
const fs = require('fs')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']



let devServer = {
	proxy: { // 代理
		'/H5QuickBuild': {
			//target: 'http://172.19.80.68:7024', //设置你调用的接口域名和端口号 别忘了加http
			target: 'http://27.154.242.142:5859', //设置你调用的接口域名和端口号 别忘了加http
			ws: false,
			changeOrigin: true, // needed for virtual hosted sites
			pathRewrite: {
				'^/H5QuickBuild': '/'
			},
		},
		'/uploadFile': {
			target: 'http://27.154.242.142:5859', //设置你调用的接口域名和端口号 别忘了加http
			ws: false,
			changeOrigin: true, // needed for virtual hosted sites
			pathRewrite: {
				'^/uploadFile': '/uploadFile'
			},
		},
		// '/H5QuickBuildView': {
		// 	target: 'http://localhost:8080', //设置你调用的接口域名和端口号 别忘了加http
		// 	ws: false,
		// 	changeOrigin: true, // needed for virtual hosted sites
		// 	pathRewrite: {
		// 		'^/H5QuickBuildView': '/'
		// 	},
		// }
	},
	// proxyTable: {
	// 	'/H5QuickBuild': {
	// 		target: 'http://172.19.80.80:8791', // 设置你调用的接口域名和端口号 别忘了加http
	// 		secure: false,
	// 		changeOrigin: true,
	// 		pathRewrite: {
	// 			'^/H5QuickBuild': '/' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
	// 		}
	// 	}
	// },
}

module.exports = {
	devServer: devServer,
	// 输出文件目录
	assetsDir: "static",
	lintOnSave:false,
	// 修改 pages 入口
	lintOnSave:false,
	pages: {
		index: {
			entry: 'src/main.js', // 入口
			template: 'public/engine-h5-long.html', // 模板
			filename: 'index.html' // 输出文件
		}
	},
	css: {
		loaderOptions: {
			sass: {
				// @/ 是 src/ 的别名
				data: fs.readFileSync(path.resolve(__dirname, `./src/common/styles/variables.scss`), 'utf-8') // 公共变量文件注入
			}
		}
	},
	productionSourceMap: process.env.NODE_ENV !== 'production',
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			// 生产环境
			config.plugins.push(
				new CompressionWebpackPlugin({
					filename: '[path].gz[query]', // 提示示compression-webpack-plugin@3.0.0的话asset改为filename
					algorithm: 'gzip',
					test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
					threshold: 10240,
					minRatio: 0.8
				})
			);

		} else {
			// 开发环境

		}
	},
	// 扩展 webpack 配置
	chainWebpack: config => {
		// @ 默认指向 src 目录，这里要改成 examples
		// 另外也可以新增一个 ~ 指向 packages
		config.resolve.alias
			.set('@', path.resolve('src'))
			.set('@src', path.resolve('src'))
			.set('@plugins', path.resolve('plugins'))
			.set('@server', path.resolve('server'))
		config.module
			.rule('js')
			.include.add(/engine-template/).end()
			.include.add(/src/).end()
			.include.add(/common/).end()
			.use('babel')
			.loader('babel-loader')
			.tap(options => {
				// 修改它的选项...
				return options
			})
		const svgRule = config.module.rule('svg')
		// 清除已有的所有 loader。
		// 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
		svgRule.uses.clear()
		svgRule
			.test(/\.svg$/)
			.include.add(path.resolve(__dirname, './src/common/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
		const fileRule = config.module.rule('file')
		fileRule.uses.clear()
		fileRule
			.test(/\.svg$/)
			.exclude.add(path.resolve(__dirname, './src/common/icons'))
			.end()
			.use('file-loader')
			.loader('file-loader')
	}
}
