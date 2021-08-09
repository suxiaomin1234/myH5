import Compent from "./src/index"; // Component
Compent.install = Vue =>{
    Vue.component(Compent.name,Compent)
}
export default Compent