// <template>
   
//    <div>
//         {{checkAllGroup}}
//     <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
//         <Checkbox label="香蕉"></Checkbox>
//         <Checkbox label="苹果"></Checkbox>
//         <Checkbox label="西瓜"></Checkbox>
//     </CheckboxGroup>
//    </div>
// </template>
// <script>
//     export default {
//         data () {
//             return {
//                 checkAllGroup: ['香蕉', '西瓜'],//默认选中
//             }
//         },
//         methods: {
//             checkAllGroupChange (data) {
//                 console.log(data)
//             }
//         }
//     }
// </script>

<template>
   <div>
       {{checkAllGroup}}
        <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <Checkbox :label="ele"  v-for="(ele,index) in checkAllGroup" :key='index' ></Checkbox>

        </CheckboxGroup>
        <!-- :value="checkAll" -->
         <Checkbox
                
                v-model='checkAll'
                @on-change='aaa' >全选</Checkbox>
   </div>
</template>
<script>
// const defaultFormThead = ['apple', 'banana','香蕉','西瓜'] // 默认选中项
    export default {
        data () {
            return {
                checkAllGroup: ['apple', 'banana','香蕉','西瓜'],
                checkAll:true,
            }
        },
        methods: {
            checkAllGroupChange (data) {
                console.log(data)
            },
            aaa(){
                console.log(this.checkAll)
            }
        },
        computed:{
            tem:function(){
               return
            }
        }
        
    }
    /**
     * 
     * 
     * 
     * 
     */
</script>