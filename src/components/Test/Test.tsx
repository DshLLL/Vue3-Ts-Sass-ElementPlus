/* eslint-disable */
import { defineComponent ,onMounted,reactive,h,nextTick,PropType} from "vue";
import store from '@/store'

require("/src/components/Test/Test.scss");

interface MO {
  fun: (v: any) => Array<string>
  fun1?: ()=>void
}
export default defineComponent({
  setup: function () {
    onMounted(() => {
      const state:MO={
        fun:(v)=>['??']
      }
      // store.commit('setTest')
      store.commit('setTest');
      console.log(store.state.test)
      store.dispatch('setTests').then(r=>console.log(store.state.test))


    });
    return ()=>{
      return (
        <div id='test'>

        </div>
      )
    }
  }
});
