import Text from './text'
import imageSrc from './imageSrc'
import imageSrcList from './imageSrcList'
import Url from './url'
import musicSrc from './musicSrc'
import placeholder from './placeholder'
import rows from './rows'
import type from './inputType.vue'
import radioValue from './radioValue.vue'
import checkBox from './checkBox.vue'
import buttonFrom from './buttonFrom.vue'
import phoneFrom from './phoneFrom.vue'
import select from './select.vue'
import mustLose from './mustLose.vue'
export default {
	[Text.name]: Text,
	[imageSrc.name]: imageSrc,
	[Url.name]: Url,
	[musicSrc.name]: musicSrc,
	[imageSrcList.name]: imageSrcList,
	[placeholder.name]: placeholder,
	[rows.name]: rows,
	[type.name]: type,
	[radioValue.name]: radioValue,
	[checkBox.name]:checkBox,
	[buttonFrom.name]:buttonFrom,
	[phoneFrom.name]:phoneFrom,
	[select.name]:select,
	[mustLose.name]:mustLose
}