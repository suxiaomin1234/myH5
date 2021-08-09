/**
 *  元素点击事件相关方法
 * */
export default {
	methods: {
		/**
		 * 链接跳转
		 */
		_event_link(eventData) {
			return new Promise((resolve) => {
				if (eventData.url) {
					window.location.href = eventData.url;
				}
				resolve();
			});
		},
		/**
		 * 分享
		 * @private
		 */
		_event_share() {
			return new Promise((resolve) => {
				window.alert("分享");
				resolve();
			});
		},
		/**
		 * 事件绑定表单提交
		 * @private
		 */
		_event_submitForm(eventData, element, page, sideActive, onoff) {
			let _this = this;
			return new Promise((resolve) => {
				// 获取提交接口
				let apiUrl = eventData.url;
				// 获取页面表单数据
				let phone = "";
				let dataArr = [];
				if (onoff) {
					// 获取全局页面表单元素
					let onSuer = true;
					page.pages.forEach((data) => {
						data.elements.forEach((item) => {
							let formdata = {};
							if (!item.isForm) return;
							let key = item.propsValue.names;
							if (item.elName != "qk-button") {
								// 判断是否写了name
								// if (!item.propsValue.names) {
								// 	this.$message.error("请输入英文表单必输项");
								// 	onSuer = false;
								// 	return;
								// }
								if (
									item.propsValue.mustLose == true &&
									!item.propsValue.value
								) {
									let mess = _this._mustFill(item);
									this.$toast(mess);
									onSuer = false;
									return;
								}
								if (key == "codePhoneNum") {
									if (!item.propsValue.value) {
										this.$toast("输入正确手机号和验证码");
										onSuer = false;
										return;
									} else {
										if (item.propsValue.value.length < 18) {
											this.$toast("请输入正确手机号和验证码");
											onSuer = false;
											return;
										}
										phone = item.propsValue.value.substring(0, 11);
										formdata.value = item.propsValue.value.substring(12) || "";
										formdata.title = item.propsValue.title
										formdata.name = item.propsValue.names;
										dataArr.push(formdata)
									}
								} else {
									formdata.value = item.propsValue.value || "";
									formdata.title = item.propsValue.title;
									formdata.name = item.propsValue.names;
									dataArr.push(formdata)
								}
							}
						});
					});
					if (onSuer == true) {
						let obj = {
							phone: phone,
							apiUrl: apiUrl,
							dataArr: dataArr,
							type: "submitForm",
							pageData:page.pages,
						};
						resolve(obj);
					}
				} else {
					let key = "";
					let onSuer = true;
					// 提交当前页面
					let pageOnRlemt = page.pages[sideActive].elements;
					for (let i in pageOnRlemt) {
						let formdata = {};
						if (
							pageOnRlemt[i].isForm == true &&
							pageOnRlemt[i].elName != "qk-button"
						) {
							// if (!pageOnRlemt[i].propsValue.names) {
							// 	this.$message.error("请输入英文表单必输项");
							// 	onSuer = false;
							// 	return;
							// }
							if (
								pageOnRlemt[i].propsValue.mustLose == true &&
								!pageOnRlemt[i].propsValue.value
							) {
								let mess = _this._mustFill(pageOnRlemt[i]);
								this.$toast(mess);
								onSuer = false;
								return;
							}
							if (pageOnRlemt[i].propsValue.names == "codePhoneNum") {
								if (!pageOnRlemt[i].propsValue.value) {
									this.$toast("输入正确手机号和验证码");
									onSuer = false;
									return;
								} else {
									if (pageOnRlemt[i].propsValue.length < 18) {
										this.$toast("请输入正确手机号和验证码");
										onSuer = false;
										return;
									}
									phone = pageOnRlemt[i].propsValue.value.substring(0, 11);
									formdata.name = pageOnRlemt[i].propsValue.names;
									formdata.value =
										pageOnRlemt[i].propsValue.value.substring(12) || "";
									formdata.title = pageOnRlemt[i].propsValue.title
									dataArr.push(formdata)
								}
							} else {
								formdata.name = pageOnRlemt[i].propsValue.names;
								formdata.value = pageOnRlemt[i].propsValue.value || "";
								formdata.title = pageOnRlemt[i].propsValue.title
								dataArr.push(formdata)
							}
						}
					}
					if (onSuer == true) {
						let obj = {
							phone: phone,
							apiUrl: apiUrl,
							dataArr: dataArr,
							pageData:pageOnRlemt,
							type: "submitForm",
						};
						resolve(obj);
					}
				}
			});
		},
		/**
		 * 无事件绑定表单按钮提交
		 * @private
		 * element: 当前点击元素
		 * pageData：当前项目元素
		 * onoff：false 只提交当前页面表单，true 提交全局表单
		 * subSure: false 提交表单接口按输入的postNew，true 提交接口默认
		 * postNew：输入自定义接口
		 */
		_event_btnForm(element, pageData, sideActive, onoff, subSure, postNew) {
			let _this = this;
			return new Promise((resolve) => {
				let dataArr = [];
				let apiUrl = postNew;
				let obj = {};
				if (onoff) {
					// 获取全局页面
					let opage = pageData.pages;
					let phone = "";
					let key = "";
					let onSuer = true;
					for (let i in opage) {
						for (let n in opage[i].elements) {
							let formdata = {};
							if (
								opage[i].elements[n].isForm == true &&
								opage[i].elements[n].elName != "qk-button"
							) {
								// // 判断是否有必填选项
								if (
									opage[i].elements[n].propsValue.mustLose == true &&
									!opage[i].elements[n].propsValue.value
								) {
									let mess = _this._mustFill(opage[i].elements[n]);
									this.$toast(mess);
									onSuer = false;
									return;
								}
								if (opage[i].elements[n].propsValue.names == "codePhoneNum") {
									if (!opage[i].elements[n].propsValue.value) {
										this.$toast("输入正确手机号和验证码");
										onSuer = false;
										return;
									} else {
										if (opage[i].elements[n].propsValue.value.length < 18) {
											this.$toast("请输入正确手机号和验证码");
											onSuer = false;
											return;
										}
										phone = opage[i].elements[n].propsValue.value.substring(
											0,
											11
										);
										formdata.name = opage[i].elements[n].propsValue.names;
										formdata.value =
											opage[i].elements[n].propsValue.value.substring(12) || "";
									    formdata.title = opage[i].elements[n].propsValue.title
										dataArr.push(formdata)
									}
								} else {
									formdata.name = opage[i].elements[n].propsValue.names;
									formdata.value = opage[i].elements[n].propsValue.value || "";
									formdata.title = opage[i].elements[n].propsValue.title
									dataArr.push(formdata)
							
								}
							}
						}
					}
					if (subSure) {
						// 默认接口
						if (onSuer == false) return;
						obj = {
							phone: phone,
							apiUrl: "",
							dataArr: dataArr,
							pageData:opage
						};
						resolve(obj);
					} else {
						if (onSuer == false) return;
						obj = {
							phone: phone,
							apiUrl,
							dataArr: dataArr,
							pageData:opage
						};
						resolve(obj);
					}
				} else {
					// 提交当前页面
					let pageOnRlemt = pageData.pages[sideActive].elements;
					let phone = "";
					let key = "";
					let onSuer = true;
					for (let i in pageOnRlemt) {
						let formdata = {};
						if (
							pageOnRlemt[i].isForm == true &&
							pageOnRlemt[i].elName != "qk-button"
						) {
							// 判断是否写了name
							// if (!pageOnRlemt[i].propsValue.names) {
							// 	this.$message.error("请输入英文表单必输项");
							// 	onSuer = false;
							// 	return;
							// }
							if (
								pageOnRlemt[i].propsValue.mustLose == true &&
								!pageOnRlemt[i].propsValue.value
							) {
								let mess = _this._mustFill(pageOnRlemt[i]);
								this.$toast(mess);
								onSuer = false;
								return;
							}
							if (pageOnRlemt[i].propsValue.names == "codePhoneNum") {
								if (!pageOnRlemt[i].propsValue.value) {
									this.$toast("输入正确手机号和验证码");
									onSuer = false;
									return;
								} else {
									if (pageOnRlemt[i].propsValue.length < 18) {
										this.$toast("请输入正确手机号和验证码");
										onSuer = false;
										return;
									}
									phone = pageOnRlemt[i].propsValue.value.substring(0, 11);
									formdata.name = pageOnRlemt[i].propsValue.names;
									formdata.value =
										pageOnRlemt[i].propsValue.value.substring(12) || "";
									formdata.title = pageOnRlemt[i].propsValue.title
									dataArr.push(formdata)
								}
							} else {
								formdata.name = pageOnRlemt[i].propsValue.names;
								formdata.value = pageOnRlemt[i].propsValue.value || "";
								formdata.title = pageOnRlemt[i].propsValue.title
								dataArr.push(formdata)
							}
						}
					}
					if (subSure) {
						// 默认接口
						if (onSuer == false) return;
						obj = {
							phone,
							apiUrl: "",
							dataArr: dataArr,
							pageData:pageOnRlemt
						};
						resolve(obj);
					} else {
						if (onSuer == false) return;
						obj = {
							phone,
							apiUrl,
							dataArr: dataArr,
							pageData:pageOnRlemt
						};
						resolve(obj);
					}
				}
			});
		},
		/**
		 * 验证表单组件选择了必填提示
		 * elements :当前必填数据
		 */
		_mustFill(elements) {
			let elname = elements.elName;
			let message = "";
			switch (elname) {
				case "qk-input":
					message = elements.propsValue.placeholder;
					break;
				case "qk-textarea":
					message = elements.propsValue.placeholder;
					break;
				case "qk-radio":
					message = elements.propsValue.title;
					break;
				case "qk-checkbox":
					message = elements.propsValue.title;
					break;
				case "qk-select":
					message = elements.propsValue.placeholder;
					break;
			}
			return message;
		},
		/**
		 * 获取验证码按钮事件
		 * **/
	},
};
