;
import{ getAppId,getOpenId,getWxUserInfo,getRefreshToken,getIsRegister,getUserInfoAdmin,getUserInfo,getBackUrl } from '@src/common/js/mUtils'
/**
 * 用户数据状态管理
 */
const state = {
	token: '',
	permissionsList: [],
	userData: {
		avatar: '',
		level: ''
	},
	appId: getAppId(), // appId
	openId: getOpenId(), // openId
	// token: getToken(), // 登录token
	isRegister: getIsRegister(), // 用户注册标识
	// refreshToken: getRefreshToken(), // 刷新登录token
	wxUserInfo: getWxUserInfo(), // 微信账号信息
	userInfo: getUserInfo(), // 用户账号信息
	// userInfoAdmin: getUserInfoAdmin(), // 用户账号信息(对应后台)
	// backUrl: getBackUrl(), // 返回地址
};
const actions = {
	/**
	 * 更新个人信息
	 * @param commit
	 */
	updateUserInfo({
		commit
	}, userData) {
		commit('updateUserInfo', userData)
	},
	/**
	 * 更新token
	 * @param commit
	 */
	updateUserToken({
		commit
	}, userData) {
		commit('updateUserToken', userData)
	},
	/**
	 * 退出登录
	 */
	doLogout() {
		// todo
	},
	// 保存token
	saveToken: ({ commit }, payload) => {
		setToken(payload);
		commit("SAVE_TOKEN", payload);
	},
	// 保存用户注册标识
	saveIsRegister: ({ commit }, payload) => {
		setIsRegister(payload);
		commit("SAVE_IS_REGISTER", payload);
	},
	// 保存微信账号信息
	saveWxUserInfo: ({ commit }, payload) => {
		setWxUserInfo(payload);
		commit("SAVE_WX_USER_INFOU", payload);
	},
	// 保存用户账号信息
	saveUserInfo: ({ commit }, payload) => {
		setUserInfo(payload);
		commit("SAVE_USER_INFOU", payload);
	  },
};
const mutations = {
	/**
	 * 更新个人数据
	 * @param state
	 * @param data
	 */
	updateUserInfo(state, data) {
		state.userData = {
			...data
		};
	},
	/**
	 * 更新token
	 * @param state
	 * @param data
	 */
	updateUserToken(state, data) {
		state.token = data || '';
	},
	SAVE_WX_USER_INFOU(state, data){
		state.wxUserInfo = data
	},
	SAVE_TOKEN(state, data){
		state.token = data
	},
	SAVE_IS_REGISTER(state, data){
		state.isRegister = data
	},
	SAVE_USER_INFOU(state, data){
		state.userInfo = data
	}
};
const getters = {
	/**
	 * 获取登录认证信息token
	 * @param state
	 * @returns {string}
	 */
	authorization(state) {
		// return state.token ? ('Bearer ' + state.token) : ''
		return state.token ? state.token : ''
	},
	/**
	 * 用户信息
	 * @param state
	 * @returns {getters.userData|(function(*))|state.userData|{avatar, level}|*|userData}
	 */
	userData(state) {
		return state.userData
	},
};

export default {
	state,
	getters,
	actions,
	mutations
}