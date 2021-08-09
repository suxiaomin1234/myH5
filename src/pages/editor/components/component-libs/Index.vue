<template>
  <div class="components-libs-wrapper scrollbar-wrapper">
    <p class="page-title text-center">组件库</p>
    <el-scrollbar style="height: 100%;">
      <ul class="scrollbar-wrapper">
        <li v-for="(item, index) in componentsList" :key="index" class="clearfix paddingB30">
          <div class="components-libs-title">
            <p>{{item.title}}</p>
          </div>
          <div v-if="item.components && item.components.length">
            <div class="components-lib-item" v-for="(element,i) in item.components" :key="i" @click="handleClick(element)">
              <div class="lib-item-img"><i :class="[element.icon]"></i></div>
              <p class="lib-item-title">{{element.title}}</p>
            </div>
          </div>
          <div v-else>
            <p class="gray text-center paddingT20">待完善...</p>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
/**
 * camelCase 转换字符串string为驼峰写法。
 * _.camelCase('Foo Bar');
  // => 'fooBar'
  _.camelCase('--foo-bar--');
  // => 'fooBar'
  _.camelCase('__FOO_BAR__');
  // => 'fooBar'
 * **/
import { camelCase } from 'lodash'
// 获取左侧数据
import eleConfig from '../../ele-config'
import { _qk_register_components_object } from '@src/plugins/index'
import { mapState } from 'vuex'
// 组件赋值给window
window._qk_register_components_object = _qk_register_components_object
// console.log(_qk_register_components_object,222)
export default {
  name: 'component-libs',
  data() {
    return {
      componentsList: eleConfig,
    }
  },
  computed:{
    ...mapState({
      projectData: (state) => state.editor.projectData  // 获取当前编辑器编辑工程项目数据
    }),
  },
  methods: {
    /**
     * 点击事件, 向父组件派发add-element事件，参数： 当前组件对象
     * @param item
     */
    handleClick(item) {
      if(item.elName == "qk-bg-music"){
        let existEl = this.projectData.pages[0].elements.find(it=>{
          return it.elName == "qk-bg-music";
        });
        if(!existEl){
          let props = this.getComponentProps(item.elName)
          this.$store.dispatch('addElement', { ...item, needProps: props })
        }else{
          this.$message.warning('请勿重复添加音乐')
        }
      }else{
        // 非音乐组件 获取组件里的值
        console.log(item)
        let props = this.getComponentProps(item.elName)
         // 如果是表单组件，生成随机names
        if(item.isForm == true){
          let names = this.GenNonDuplicateID()
          props.names = names
        }
        console.log(1112,props)
        this.$store.dispatch('addElement', { ...item, needProps: props })
      }
    },
    GenNonDuplicateID(){
      return Number(Math.random().toString().substr(3,4) + Date.now()).toString(36)
    },
    /**
     * 根据elname获取组件默认props数据
     * @param elName
     */
    getComponentProps(elName) {
      let elComponentData
      for (let key in _qk_register_components_object) {
        if (key.toLowerCase() === camelCase(elName).toLowerCase()) {
          elComponentData = _qk_register_components_object[key]
          break
        }
      }
      if (!elComponentData) return {}
      // 获取元素里的数据文案等
      let props = {}
      for (let key in elComponentData.props) {
        console.log(key,elComponentData.props[key])
        props[key] = [Object, Array].includes(elComponentData.props[key].type)
          ? elComponentData.props[key].default()
          : elComponentData.props[key].default
      }
      return props
    },
  },
}
</script>

<style lang="scss" scoped>
.components-libs-wrapper {
  user-select: none;
  height: 100%;
  padding-top: 60px;
  position: relative;
  & ul {
    padding: 10px;
  }
}

.page-title {
  position: absolute;
  top: 16px;
  left: 0;
  width: 100%;
}

.components-libs-title {
  margin-bottom: 16px;
}

.components-lib-item {
  color: #424242;
  text-align: center;
  background: #f4f4f4;
  width: 80px;
  float: left;
  padding: 6px 0;
  margin: 5px;
  border: 1px solid #dddddd;
  font-size: 12px;
  cursor: pointer;
  transition: All 0.3s ease-in-out;
  &:hover {
    background: #fff;
    border: 1px solid $primary;
    color: $primary;
  }
  .lib-item-img {
  }
  .lib-item-title {
  }
}
.icons{
  font-size:16px;
  margin-top: 5px;
}
</style>
