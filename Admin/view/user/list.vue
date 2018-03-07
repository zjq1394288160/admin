<template>
    <Card shadow :bordered="false">
        <!-- 顶部工具条 -->
        <div class="table-seach-box">
            <div class="clearfix">
                <Button class="margin-right-sm Newedit " type="primary" @click="toUserCreate()">新增</Button>
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
         <CheckboxGroup v-model="disabledGroup" @on-change="checkAllGroupChange">
            <Checkbox :label='ele' v-for="(ele,index) in checkAllGroup" :key='index'></Checkbox>
        </CheckboxGroup>  
         <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
            <Checkbox
                 v-model="checkAll"
                @on-change="handleCheckAll">全选</Checkbox>
        </div>
        <Table border :loading="loading" :columns="columns" 
             @on-selection-change="onRowSelect" :height="size>10? 500 : '' " 
             @on-sort-change="AscorDesc"
             :data="rows">
             </Table>
        <!-- 底部工具条 -->
        <div style="margin: 10px;overflow: hidden">
            <div style="float: left;">
                <Button class="margin-right-sm" type="primary" @click="batchRemove">删除多个</Button>    
            </div>
            <div style="float: right;">
                <Page :total="total" :page-size="size" :current='page' show-sizer show-total show-elevator @on-change="onPageChange" @on-page-size-change="onSizeChange"></Page>
            </div>
        </div>
    </Card>
</template>

<script>
    import { Message } from "iview";
    import { modelParser} from "common/util/model";
    import {fetchModel} from "common/api/tool";
    import {fetchUserList,removeUserInfo,fetchUserInfo } from "common/api/user";
    var tableModel = {};
    export default {
        name: "errortype",
        components: {},
        data() {
            return {
                kw: "", //搜索词
                page: 1, //当前页码
                size: 10, //分页大小（每页的条数）
                total: 0, //总条目数
                row: {}, //当前正在编辑查看数据
                rows: [], //列表数据，从服务器获取
                loading: true, //加载状态
                dateRange: [], //中国时间数组 值两个
                show: [], //当前显示的字段(供筛选)
                order: [], //当前排序的字段
                filter: "ALL", //当前检索字段
                dateType: 'NULL', //时间范围限定字段
                attrs: {}, //table原始数据列（不含功能）
                columns: [], //table展示列（实际展示,包含功能)
                selection: [],
                //table 字段属性
                fields: {
                    all: [],
                    edit: [],
                    date: [],
                    show: [],
                    like: [], //搜索选项的下拉框
                    match: [],//精确匹配
                    order: []//排序Desc Asc
                },
                checkAll: true,
                disabledGroup:[],//默认的
                checkAllGroup: [],//遍历的
                noChexked:[],//没有选中
                ChexkData:[]
            };
        },
        created() {
            fetchModel("User").then(model => {
                tableModel = modelParser(model);
                this.show = tableModel["show"];
                this.fields.all = tableModel["all"];
                this.fields.edit = tableModel["edit"];
                this.fields.date = ["createdAt", "updatedAt"]
                this.fields.show = tableModel["show"];
                this.fields.like = tableModel["like"];
                this.fields.must = tableModel["must"];
                this.fields.match = tableModel["match"];
                this.fields.order = tableModel["order"];
                this.changeColumns(); //创建完毕初始化列表   
                console.log(tableModel)
            });
            this.updateTable();
        },
        watch: {
            disabledGroup(valArr) {
                this.noChexked=this.checkAllGroup.filter(i =>valArr.indexOf(i)<0);
                this.columns=this.ChexkData;
                var tem1=this.columns.filter(i => this.noChexked.indexOf(i.title)<0)
                var tem2=this.columns.filter(i => this.noChexked.indexOf(i.title)>=0)
                this.columns=tem1;
            }
        },
        methods: {
            checkAllGroupChange (data) {
                if(data.length==this.checkAllGroup.length){
                    this.checkAll=true;
                }
            },
            handleCheckAll(){
              if(this.checkAll){
                   this.disabledGroup=this.checkAllGroup;
              }else{
                  this.disabledGroup=[]
              }
            },
            AscorDesc(column){
                console.log(column)
                var params=[[column.key,column.order]];   
            },
            toUserCreate(){
                 this.$router.push({
                    name: 'user_create'
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
            updateTable() {
                this.loading = true;
                var params = {};
                params["kw"] = this.kw;
                params["size"] = this.size;
                params["page"] = this.page;
                params["filter"] = this.filter;
                params["dateType"] = this.dateType;
                var arr=[];
                if(this.dateRange[0]){
                    for(var i=0;i<this.dateRange.length;i++){ 
                        arr.push(new Date(this.dateRange[i]).getTime()) 
                    }
                }
                params["dateRange"] = arr;
                //获取数据
                fetchUserList(params).then(data => {
                    this.rows = data["rows"];
                    this.total = data["total"];
                    this.loading = false;
                });
            },
            // 展示详情
            showInfo(index) {
                // todo 打开新页面展示
                var params = {
                    username: this.rows[index].username
                };
                getUserInfo(params).then(res => {
                    this.curUser = res.data;
                    this.modal = true;
                });
            },
            //移除
            remove(index) {
                this.$Modal.confirm({
                    title: 'Title',
                    content: '<p>您是否确定删除</p>',
                    onOk: () => {
                        var id = this.rows[index]['id'];
                        removeUserInfo(id).then(data=>{
                            this.rows.splice(index, 1);
                            this.$Message.info("删除成功")
                        })
                    }
                })
            },
            // 表单多选
            onRowSelect(selection, row) {
                this.selection = selection;
            },
            //批量删除（多选）
            batchRemove() {
                if (!this.selection.length) {
                    Message.info("未选择数据");
                    return;
                }
                 this.$Modal.confirm({
                    title: 'Title',
                    content: '<p>您是否确定删除</p>',
                    onOk: () => {
                        var ids = [];
                        var selection = this.selection;
                        selection.forEach(row => {
                            ids.push(row["id"]);
                        });
                        removeUserInfo(ids).then(data => {
                            Message.info("成功删除" + data["count"] + "条数据");
                            this.updateTable();
                        });
                    }
                })
            },
            // 初始化表单列 （或更新）
            changeColumns() {
                let attrs = {};
                let columns = [];
                columns.push({
                    type: "selection",
                    width: 60,
                    align: "center",
                    fixed: "left"
                });
                for (let col of tableModel["columns"]) {
                    attrs[col["key"]] = col;
                    if (!!~this.show.indexOf(col["key"])) {
                        columns.push(col);
                    }
                }
                this.attrs = attrs;
                columns.push({
                    title: "操作",
                    width: 150,
                    align: "center",
                    fixed: "right",
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button", {
                                    props: {
                                        type: "success",
                                        size: "small"
                                        //   to:"/user/edit"
                                    },
                                    style: {
                                        marginRight: "5px"
                                    },
                                    on: {
                                        click: () => {
                                            location.href = location.pathname + "#/user/edit/" + params.row['id']
                                        }
                                    }
                                },
                                "详情"
                            ),
                            h(
                                "Button", {
                                    props: {
                                        type: "error",
                                        size: "small"
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index);
                                        }
                                    }
                                },
                                "删除"
                            )
                        ]);
                    }
                });
               for(var key in columns){
                   if(columns[key].title){
                       this.checkAllGroup.push(columns[key].title);
                        // if(columns[key].title=="ID"){  
                        //     columns[key].sortable='custom';     
                        // }
                        console.log(this.fields.order)
                        console.log(columns[key].title)
                        if(this.fields.order.indexOf(columns[key].title)>=0){
                            columns[key].sortable='custom';
                        }
                   }
                  
               }
               this.disabledGroup=this.checkAllGroup;
                this.columns = columns;
                this.ChexkData=columns;
            }
        }
    };
</script>
<style lang="less" scoped>
.ipt{
    cursor: pointer;
    // opacity: 0
}
    .newAdd {
        width: 56px;
        height: 32px;
        color: #fff;
        background-color: #2d8cf0;
        border-color: #2d8cf0;
        line-height: 32px;
        text-align: center;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
    }
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
