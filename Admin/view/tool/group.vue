<template>
    <Card class='group'>
        <div class="clearfix">
             <div slot="title" class='groupContent-header'>
                    <h1 >分组列表</h1> 
                    <Button type="info" size="large" style="width:120px;height:40px;" @click="rootAdd">添加分组</Button>   
            </div>
            <div class='groupSidebar clearfix' >
                <div class=" groupBox " v-for='(ele,index) in treeLeft' :key='index' @click='rootData(ele,$event)'>
                    <Button type="ghost" size="large" class="groupBox-root"  >{{ele.title}}</Button>
                    <div  @click.stop='removeRoot(ele)'>
                        <Icon type="trash-a" class='IconRemove'></Icon>  
                    </div>
                    <div  @click.stop='editRootName(ele)'>
                        <Icon type="compose" class='TconEdit' ></Icon>
                    </div>
                </div>
            </div>
             <div class='groupContent'>
                <h1 slot="title" style="">分组管理</h1>  
                <div v-show='rootNameShow' >
                    <div>
                        <h2>{{rootName}}</h2>
                    </div>  
                    <Button type="info" size="small"  @click="append()"> 添加节点</Button>
                </div>
                 
                <Tree :data="tree" :render="renderContent" ></Tree>
            </div> 
            <Modal
                v-model="moveModel"
                title="移动当前分组到"
            >
                <Tree :data="moveTree" :render="renderModel" ></Tree>
            </Modal>            
        </div>
    </Card>
</template>

<script>
import _ from 'lodash';
import { fetchgroupInfo,removeInfo,createNodeInfo,updateMove,fetchgroupList}  from 'common/api/tool';
    export default {
        name: "group",
        components: {},
        data() {
            return {
                tree: [],
                moveTree:[],
                treeLeft:[],//左侧树形图
                value:'',//用于input value 更新
                moveModel:false,
                moveGO:"",//要移动的hash
                moveTitle:'',//要移动的title
                //editroot
                rootValue:'',   //新建root的value
                editrootValue:"",//编辑root的value
                Addroot:false,
                editrootHsh:'',

                //
                rootNameShow:false,//
                rootName:'',
                rootHash:'',
            };
        },
        methods: {
            //初始化root
           infoRoot(){
                fetchgroupList()
                .then(res =>{
                    this.treeLeft=res
                })
           },
            //渲染左侧root的数据
            rootData(ele,$event){ 
                var hash=ele.hash;
                this.rootName=ele.title;
                this.rootHash=ele.hash
                this.updateRootData(hash);
            },
            //刷新root数据
            updateRootData(hash){
                fetchgroupInfo(hash).then( res=>{
                    this.tree=res
                    this.rootNameShow=true;
                })
            },
            //编辑rootName
            editRootName(ele){
                // this.Addroot=true;
                this.editrootValue=ele.title;
                this.editrootHsh=ele.hash; 
                this.$Modal.confirm({
                    render: (h) => {
                        return h('div',[
                            h('div',{style:{fontSize:'16px'}},'请编辑您要更改的root名称'),
                            h('Input', {
                                props: {
                                    value: ele.title,
                                    autofocus: true,
                                },
                                on: {
                                    input: (val) => {
                                        this.editrootValue = val;
                                    }
                                }
                            })
                        ])
                    },
                     onOk: () => {
                        var str=this.editrootValue.trim();
                        if(str){
                            var flagRootName=this.treeLeft.find(el =>el.title==str);
                            if(flagRootName){
                                this.$Message.info('已有此名称')
                            }else{
                                 var params={};
                                params['hash']=this.editrootHsh,
                                params['title']=this.editrootValue,
                                updateMove(params)
                                .then( res=>{
                                    this.infoRoot()
                                    this.editrootValue=''
                                })  
                            }
                        }else{
                            this.$Message.info('名称不能为空')
                        }
                    },
                    onCancel: () => {
                        this.$Message.info('Clicked cancel');
                    }
                })      
            },
             //添加左边root
            rootAdd(){
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.rootValue,
                                autofocus: true,
                                placeholder: '请输入root名称'
                            },
                            on: {
                                input: (val) => {
                                    this.rootValue = val;
                                }
                            }
                        })
                    },
                     onOk: () => {
                         var str=this.rootValue.trim()
                        if(str){
                            var params={}
                            params['title']=str;
                            params['father']='root'
                            createNodeInfo(params)
                            .then(res => {
                                this.infoRoot()
                                this.rootValue='';
                            })
                        }else{
                              this.$Message.info('名称不能为空')
                        }
                    },
                    onCancel: () => {
                        this.$Message.info('Clicked cancel');
                    }
                })
            },
            //更新节点
            editText($event,root,node,data){           
                var flag=null;
                if(node.parent){
                    let parent=root[node.parent];
                    let arr=[];
                    for(var i=0;i<parent.children.length;i++){
                        console.log(root[parent.children[i]])
                        arr.push(root[parent.children[i]])
                    }
                    flag=arr.find(el => el.node.title==this.value)
                }else{
                    flag=root.find(el => el.node.title==this.value)
                }
                if(flag){
                    this.$Message.warning('父节点已存在相同子节点');
                }else{
                    var params={};
                    params['hash']=node.node.hash;
                    params['title']=this.value||node.node.title; 
                    updateMove(params)
                    .then(res => {
                        node.node.title=this.value||node.node.title;
                        this.value='';
                    })
                }    
            },
           
           
            //添加节点
            append(root,node,data) {
                var params={};
                params['title']='nodeNew';
                if(data){
                    params['father']=node.node.hash;
                    data['expand']=true; 
                }else{
                    params['father']=this.rootHash;     
                }  
                createNodeInfo(params)
                .then(child =>{
                    child['edit']=true;
                    child['expand']=true;
                    if(data){
                        const children = data.children || [];
                        children.push(child);
                        this.$set(data, "children", children);
                    }else{
                        this.tree.push(child)
                    }   
                })
            },
           
            //删除root
            removeRoot(ele){
                var hash=ele.hash;
                removeInfo(hash).then(child =>{
                    this.infoRoot()
                })   
            },
            //删除节点
            remove(root, node, data) {
                /**
                 *root <Array>：树的根节点 
                 * node <Object>：当前节点
                 * data <Object>：当前节点的数据
                 */
                 this.$Modal.confirm({
                    title: 'Title',
                    content: '<p>您是否确定删除</p>',
                    onOk: () => {
                        var hash=node.node.hash;
                        removeInfo(hash).then(child =>{
                            this.$Message.info('Clicked ok');
                            var hash=this.rootHash
                            this.updateRootData(hash)
                        })  
                    },
                    onCancel: () => {
                        this.$Message.info('Clicked cancel');
                    }
                });
            },
            //移动节点
            move(root,node,data){
                this.moveTree = [{
                    "hash":this.rootHash,
                    "title":this.rootName,
                }].concat(_.cloneDeep(this.tree));
                this.moveModel=true;
                this.moveGO=node.node.hash
                this.moveTitle=node.node.title;
            },
            oKmoveBourn(root,node,data){
                let title=this.moveTitle;    
                if(data.children&&data.children.find(el =>el.title==title)){
                    this.$Message.warning('父节点已存在相同子节点')

                }else{
                    var params={};
                    params['hash']=this.moveGO;
                    params['father']=node.node.hash;
                    updateMove(params)
                    .then( res =>{
                        this.updateRootData(this.rootHash)
                    }) 
                }
                this.moveModel=false;
            },
            renderContent(h, {root,node,data}) {
                var _self = this;
                var title = null;
                var iconEdit=null
                if(data.edit){
                    title =  h('input',{ domProps: {value:data.title },attrs: {autofocus:"autofocus"}, 
                    style: {width: "100px",fontSize:"16px"},
                                        on:{change:(event)=>{_self.$emit('input', event.target.value);} 
                                        }});
                    iconEdit= h("Button", {props: Object.assign({}, this.buttonProps, {icon: "checkmark"}),
                                                style: {
                                                        marginRight: "6px",
                                                        height:"20px",
                                                        width:"20px",
                                                        padding:0,
                                                },
                                                on: {
                                                    click: ($event) => {
                                                        data.edit=false
                                                        this.editText($event,root,node,data);                                   
                                                    }
                                                }
                                    })
                }else{
                    title =  h("span", {style:{fontSize:"16px"}},data.title);
                    iconEdit= h("Button", {props: Object.assign({}, this.buttonProps, {icon: "edit"}),
                                                style: {
                                                        marginRight: "6px",
                                                        height:"20px",
                                                        width:"20px",
                                                        padding:0,

                                                },
                                                on: {
                                                    click: ($event) => {
                                                        data.edit=true;

                                                    }
                                                }
                                    })
                }
                return h("span", {style: {display: "inline-block",width: "100%",fontSize:"24px",marginBottom: '-13px'},class:{clearfix:true}},
                    [

                    h("span", {style:{float:"left"}},
                                [
                                    h("Icon", {props: {type: "ios-folder-outline"},
                                                style: {marginRight: "8px"}
                                    }),
                                    title
                                    // h("span", {style:{fontSize:"16px"}},data.title),
                                    // h('input',{ domProps: {value:data.title }, style: {width: "100px"}})
                                ]),        
                    h("span", {style: {display: "inline-block",marginLeft:"200px",marginRight: "10px"
                                }}, 
                                [
                                    h("Button", {props: Object.assign({}, this.buttonProps, {icon: "ios-plus-empty"}),
                                                style: {marginRight: "6px",height:"20px",width:"20px",padding:"0px",},
                                                on: {click: () => {
                                                        this.append(root,node,data);
                                                    }
                                                }
                                    }),
                                    h("Button", {props: Object.assign({}, this.buttonProps, {icon: "ios-minus-empty"}),
                                                style: {
                                                        marginRight: "6px",
                                                        height:"20px",
                                                        width:"20px",
                                                        padding:0,
                                                },
                                                on: {
                                                    click: () => {
                                                        this.remove(root, node, data);
                                                    }
                                                }
                                    }),
                                    iconEdit,

                                    h("Button", {props: Object.assign({}, this.buttonProps, { icon: "arrow-move" }),
                                                style: {
                                                        marginRight: "6px",
                                                        height:"20px",
                                                        width:"20px",
                                                        padding:0,
                                                    },
                                                on: {
                                                    click: ($event) => {
                                                        this.move(root,node,data)                           
                                                    }
                                                }
                                    }),
                                ])
                    ]
                    )
                
                
            },
            renderModel(h,{root,node,data}) {
                 return h("span", {style: {display: "inline-block",width: "100%",fontSize:"14px"}},
                            [
                                h("span", 
                                    [
                                        h("Icon", {props: {type: "ios-folder-outline"},
                                                    style: {marginRight: "8px"}
                                        }),
                                        h("span", {style:{fontSize:"16px"}},data.title)
                                    ]),
                                    h("span", {style: {display: "inline-block",marginLeft: "10px",// float: "right", 
                                             }}, 
                                    [
                                        h("Button", {props: Object.assign({}, this.buttonProps, {icon: "arrow-left-c"}),
                                                     style: {marginRight: "6px",height:"20px",width:"20px",padding:"0px",},
                                                    on: {click: () => {
                                                           this.oKmoveBourn(root,node,data)
                                                        }
                                                    }
                                        }),
                                    
                                    ])
                            ])
            }
        },
        created() {
            this.infoRoot()
            this.$on('input',function(msg){
                this.value=msg
            });
        },
    };
</script>
<style lang="less">
.clearfix:after{
    content:'';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;

}
.clearfix{
    zoom:1;
}
.group{
    width:100%;
    height:100%;
    .groupContent-header{
       margin-bottom:10px;
    }
    .groupSidebar{
        border:1px solid #d1dbe5;
        width:200px;
        float: left;
        .groupBox{
            float: left;
            width: 100%;
            height: 40px;
            position: relative;
            .groupBox-root{
                width:100%;
                height:100%;
            }
            .IconRemove{
                position: absolute;
                width:15px;
                height: 40px;
                text-align: center;
                line-height:40px;
                top:0px;
                right:6px;
            }
            .TconEdit{
                position: absolute;
                width: 15px;
                height: 40px;
                text-align: center;
                line-height:40px;
                top:0px;
                right:26px;
            }
            i:hover{
                color:red;
            }
        }
        .groupBox:hover{
            background-color:#edf7ff;

        } 
    } 
    .groupContent{
        margin-left:250px;
        overflow: hidden;

    }
}


</style>