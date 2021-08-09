import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import httpServer from '@src/service/httpServer' // axios拦截器配置
import '@/permission' // 权限控制
import * as mUtils from '@/common/js/mUtils' // 公共方法
import config from '@/config'
import filters from './filters/index' // 全局过滤器
import AES from '@/common/js/secret'
import userModel from '@src/mixins/userModel'

import Element from 'element-ui'
import '@/common/styles/element-variables.scss'
import '@/common/styles/index.scss' // 自定义 css
import 'animate.css'
import VueClipboard from 'vue-clipboard2'
import Tabs from 'ant-design-vue/lib/tabs'
import 'ant-design-vue/lib/tabs/style/css'

import engineH5Swiper from '../engine-template/engine-h5-swiper'
import engineH5Long from '../engine-template/engine-h5-long'

import VueAwesomeSwiper from 'vue-awesome-swiper'
// import 'swiper/swiper-bundle.css'

//降低版本后引入的css
import 'vue-awesome-swiper/node_modules/swiper/dist/css/swiper.css'



import {
	interParams
} from '../src/service/interParams'

import '../src/common/styles/fonts/font.css'

// 引入svg
import SvgIcon from './components/SvgIcon' // svg组件
import toastRegistry from '@/components/toast/index' // 提示组件

// 这里也可以直接执行 toastRegistry()
Vue.use(toastRegistry)

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./common/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

Vue.use(Element);
Vue.use(Tabs);
Vue.use(VueClipboard)
Vue.use(engineH5Swiper)
Vue.use(VueAwesomeSwiper)
Vue.use(engineH5Long)

/**
 * 引入公共方法mUtils
 */
Vue.prototype.$mUtils = mUtils;
Vue.prototype.AES = AES
Vue.prototype.$axios = httpServer;
Vue.prototype.$interParams = interParams;

/**
 * 公共配置信息
 */
Vue.prototype.$config = config

// 注册全局过滤器
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

// 全局注册mixins
Vue.mixin(userModel); // 公共mixins


// 登录后跳转方法
Vue.prototype.goBeforeLoginUrl = () => {
	let url = mUtils.Cookie.get('beforeLoginUrl')
	url = decodeURIComponent(url)
	if (!url || url.indexOf('/author') != -1) {
		router.push('/')
	} else {
		router.push(url)
		mUtils.Cookie.set('beforeLoginUrl', '', 1 / 24 / 60, window.location.host, window.location.pathname.substring(0, window.location.pathname.length - 1))
	}
};


String.prototype.replaceAll = function (s1, s2) {
	// g表示执行全局匹配，m表示执行多次匹配
	return this.replace(new RegExp(s1, "gm"), s2);
}

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')