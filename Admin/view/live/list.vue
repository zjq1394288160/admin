<template>
    
    <Card shadow :bordered="false">
        <!-- 顶部工具条 -->
        {{fields.date}}
       <div class="table-seach-box">
            <div class="clearfix">
                <Button class="margin-right-sm Newedit " type="primary" @click="eidtRowData()">新增</Button>
                <div class='clearfix seek'>
                    <div class="floatLeft ">
                        <Select v-model="dateType" style="width:100px;text-align:center" clearable>
                                    <Option value="NULL" key="NULL" > 时间范围 </Option>
                                    <Option v-for="key of fields.date" :value="key" :key="key"> {{ attrs[key]["title"] || key }} </Option>
                            </Select>
                        <DatePicker :disabled="dateType == 'NULL'" type="datetimerange" confirm placeholder="请选择日期和时间" style="width: 260px;margin-left: -5px;margin-right: -4px;border-radius:0px" v-model="dateRange"></DatePicker>
                    </div>
                    <div class='floatLeft ALLFields '>
                        <Input v-model="kw" placeholder="请输入对象" style="width: 320px">
                        <Select v-model="filter" clearable slot="prepend" style="width: 100px">
                                    <Option value="ALL" key="ALL" > 全部 </Option>
                                    <Option v-for="key of fields.like" :value="key" :key="key"> {{ attrs[key]["title"] || key }} </Option>
                                </Select>
                        <Button slot="append" icon="ios-search" @click="search"></Button>
                        </Input>
                    </div> 
                </div>
            </div>
        </div>
        <!-- 表格  -->
        <Table border :loading="loading" :columns="columns" @on-selection-change="onRowSelect" :height="rows.length<10? 500 : '' " :data="rows"></Table>
        <!-- 底部工具条 -->
        <div style="margin: 10px;overflow: hidden">
            <div style="float: left;">
                     <Button class="margin-right-sm" type="primary"  @click="batchRemove">删除多个</Button>
            </div>
            <div style="float: right;">
                <Page :total="total" :page-size="size" :current='page' show-sizer show-total show-elevator  @on-change="onPageChange" @on-page-size-change="onSizeChange"></Page>
            </div>
        </div>
         <!-- Modal编辑框 -->
            <Modal v-model="modalShow" title="编辑">
                <Form ref="row" :model="row" :rules="modalValidate" :label-width="80">
                    <Card>
                        <div slot="title">
                            <Row>
                                <Col span='12'>
                                <FormItem label="房间">
                                    <Input v-model="row.room" placeholder="Enter your name"></Input>
                                </FormItem>
                                </Col>
                                <Col span="6" offset="6">
                                <strong>vip</strong>
                                <InputNumber :max="10" :min="1" v-model="row.vip"></InputNumber>
                                </Col>
                            </Row>
                        </div>
                        <Row>
                            <Col span="12">
                                <FormItem label="热度">
                                    <Input v-model="row.heat" placeholder="Enter your name"></Input>
                                </FormItem>
                                <FormItem label="波豆">
                                    <Input v-model="row.bean" placeholder="Enter your name"></Input>
                                </FormItem>
                                <FormItem label="打赏">
                                    <Input v-model="row.reward" placeholder="Enter your name"></Input>
                                </FormItem>
                                <FormItem label="价格">
                                    <Input v-model="row.price" placeholder="Enter your name"></Input>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                 <FormItem label="来源ip">
                                    <Input v-model="row.ip" placeholder="Enter your name"></Input>
                                </FormItem>
                                <FormItem label="鲜花数量">
                                    <Input v-model="row.flower" placeholder="Enter your name"></Input>
                                </FormItem>
                                <FormItem label="围观人数" prop="look">
                                    <Input v-model="row.look" placeholder="Enter your name"></Input>
                                </FormItem>
                                <FormItem label="点赞次数">
                                    <Input v-model="row.like" placeholder="Enter your name"></Input>
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Card>
                        <Form-item >
                            <Button type="primary" @click="modalSubmit('row')">提交</Button>
                            <Button type="ghost" @click="modalReset()" style="margin-left: 8px">重置</Button>
                        </Form-item>
                    </Card>
                </Form>
            </Modal>

    </Card>
    
</template>

<script>
import {modelParser,initModal,initValidate} from 'common/util/model';
import {fetchModel } from 'common/api/tool';
import {fetchLiveList,fetchLiveRemove,updateLiveInfo,fetchLiveInfo} from 'common/api/live';
var tableModel = {};
export default {
    name: "liveList",
    components: {},
    data() {
        return {
            kw: "", //搜索词
            page: 1, //当前页码
            size: 10, //分页大小（每页的条数）
            total: 0, //总条目数
            row:{},   //当前正在编辑查看数据
            rows: [], //列表数据，从服务器获取
            loading: true,//加载状态
            dateType:'NULL',///时间范围限定字段
            dateRange: [], //中国时间数组
            show: [],       //当前显示的字段(供筛选)
            order: [],      //当前排序
            filter: "ALL" , //当前检索字段
            attrs:{},       //table原始数据列（不含功能）
            columns: [],    //table展示列（实际展示,包含功能)
            modalShow: false, //是否展示Modal
            modalValidate: {},//Modal的验证属性
            //table 字段属性
            fields : {
                "all":[],
                "edit":[],
                "show":[],
                "like":[],
                "match":[],
                "order":[],
            },
        };
    },
    created() {
        fetchModel("Live").then(model => {
            tableModel = modelParser(model);
            this.show = tableModel["show"];
            this.fields.all = tableModel["all"];
            this.fields.edit = tableModel["edit"];
            this.fields.show = tableModel["show"];
            this.fields.like = tableModel["like"];
            this.fields.must = tableModel["must"];
            this.fields.match = tableModel["match"];
            this.fields.order = tableModel["order"];
            this.changeColumns();

        });
        this.updateTable();
    },
   
    methods: {
        toLiveShow(){
            this.$router.push({
                name: 'live_show'
            });
        },
        //查询按钮
        search() {
            this.page = 1;
            this.updateTable();
        },
        //跳转页面
        onPageChange(page) {
            this.page = page;
            this.updateTable();
        },
        //更改页面大小
        onSizeChange(size) {
            this.size = size;
            this.updateTable();
        },
        // 刷新列表数据
        updateTable(){
            this.loading = true;
            var params ={};
            params["kw"] = this.kw;
            params["size"] = this.size;
            params["page"] = this.page;
            params["filter"] = this.filter;
            params["dateType"] = this.dateType;
            params["dateRange"] = this.dateRange;
            //获取数据
            fetchLiveList(params).then(data => {
                this.rows = data["rows"];
                this.total = data["total"];
                this.loading = false;
            })
        },
        // 初始化modal
        initModalData() {
            var modal = initModal(tableModel)
            this.row = modal;
            var validates = initValidate(tableModel);
            //添加自定义校验
            this.modalValidate = validates;
        },
        eidtRowData(index){
            this.initModalData();
            if(index>=0){
                var id = this.rows[index]['id'];
                this.create = false;
                fetchLiveInfo(id).then((data)=>{
                    this.row = data;
                    this.modalShow = true;
                })
            }else{
                this.create = true;
                this.modalShow = true;
            }
        },
        //提交数据
        modalSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = this.row;
                    updateLiveInfo(params).then(data => {
                        this.$Message.success('更新成功!');
                        this.updateTable()
                        this.modalShow=false;
                    })
                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        //重置数据
        modalReset(){
            this.row={}
        },
        //onOff
        onOff(){
            alert('开关')    
        },
         // 表单多选
        onRowSelect(selection,row){
            this.selection = selection;
        },
        //批量删除（多选）
        batchRemove(){ 
            if(!this.selection.length){
                 this.$Message.info("未选择数据");
                 return
            }
            this.$Modal.confirm({
                title: 'Title',
                content: '<p>您是否确定删除</p>',
                onOk: () => {
                    var ids = [];
                    var selection = this.selection;
                    selection.forEach(row=>{
                        ids.push(row["id"]);
                    })
                    fetchLiveRemove(ids).then(data=>{
                        this.$Message.info("成功删除"+data["count"]+"条数据");
                        this.updateTable();
                    })
                }
            }) 
        },
        // 初始化表单列 （或更新）
        changeColumns(){
            let attrs = {};
            let columns = [];
             columns.push({
                type: 'selection',
                width: 60,
                align: 'center',
                fixed:"left",
            })
            for(let col of tableModel["columns"]){
                attrs[col["key"]] = col;
                if(!!~this.show.indexOf(col["key"])){
                    columns.push(col);
                }
            }
            this.attrs = attrs;
            columns.push({
                title:"操作",
                width: 150,
                align: 'center',
                fixed:"right",
                render: (h, params) => {
                    return h('div', [
                         
                              h('Button', {
                            props: {
                                type: 'success',
                                size: 'small'
                            },
                            style:{
                                marginRight:"3px"
                            },
                            on: {
                                click: () => {
                                    this.eidtRowData(params.index)
                                }
                            }
                       
                       }, '编辑'),
                       h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small'
                            },
                             style:{
                                marginRight:"3px"
                            },
                            on: {
                                click: () => {
                                    this.onOff(params.index)
                                }
                            }
                        }, '开/关'),
                         h('Button', {
                            props: {
                                type: 'info',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    location.href = location.pathname + "#/live/show/" + params.row['id']
                                }
                            }
                        }, '详情')
                       
                         
                    ]);
                }
            });
            this.columns=columns;
        },
    }
};
</script>
<style lang="less">
.clearfix:after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
}
.clearfix {
    zoom: 1;
}
.floatLeft{float:left;}
.floatRight{float:right;}
@media (min-width: 966px){
.ALLFields{
       margin-left:20px;
  }
    .seek{
      float: right !important;
  }
}
  
</style>
