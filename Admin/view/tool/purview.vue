<template>
    <Card shadow :bordered="false">
        <!-- {{rows}} -->
        <!-- 顶部工具条 -->
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
        <Table border :loading="loading" :columns="columns" @on-selection-change="onRowSelect" :height="size>10? 500 : '' " :data="rows"></Table>
        <!-- 底部工具条 -->
        <div style="margin: 10px;overflow: hidden">
            <div style="float: left;">
                <Button class="margin-right-sm" type="primary" @click="batchRemove">删除多个</Button>
            </div>
            <div style="float: right;">
                <Page :total="total" :page-size="size" :current='page' show-sizer show-total show-elevator @on-change="onPageChange" @on-page-size-change="onSizeChange"></Page>
            </div>
        </div>
        <!-- Modal编辑框 -->
        <Modal v-model="modalShow" title="编辑" :width="800" :closable='false' @on-ok="modalSubmit('row')">
            <!-- :rules="modalRoledate" -->
            <Form ref="row" :model="row" :label-width="80" label-position="left">
                <div class="clearfix modelRow">
                    <Row class='modelheader' :gutter="16">
                        <Col span='12'>
                            <FormItem label="类型" prop="city">
                                <Select v-model="row.type" placeholder="请选择类型">
                                        <Option value="超级管理员">超级管理员</Option>
                                        <Option value="用户">用户</Option>
                                        <Option value="管理员">管理员</Option>
                                    </Select>
                            </FormItem>
                              <Form-item label="权限名称" prop="name">
                                <Input v-model="row.name" placeholder="请输入权限名称" number></Input>
                            </Form-item>
                            <FormItem label="是否私有">
                                <i-switch  @on-change='privately()' size="large">
                                    <span slot="open">是</span>
                                    <span slot="close">否</span>
                                </i-switch>
                            </FormItem>
                        </Col>
                        <Col span='12'>
                           
                             <Form-item label="权限KEY" prop="key">
                                <Input v-model="row.key" placeholder="请输入权限KEY"></Input>
                            </Form-item>
                            <Form-item label="描述" prop="describe">
                                <Input v-model="row.describe" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述"></Input>
                            </Form-item>
                        </Col>    
                    </Row>

                    <div class='modelfooter'>
                        <span>选择角色:</span>
                        <div class='treeRole' v-if='!row.private' disableCheckbox       >
                            <Tree ref='getTreerole' :data='roleData' show-checkbox style="fontSize:16px">
                            </Tree>
                        </div>
                        <div class='treeRole' v-if='row.private'>
                             <Tree :data="roleData" style="fontSize:16px"></Tree>
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    </Card>
</template>
<script>
    import {
        modelParser,
        initModal,
        initValidate
    } from 'common/util/model'
    import {
        fetchModel,
        fetchpurviewList,
        fetchpurviewInfo,
        updatepurviewInfo,
        createpurview,
        removepurviewInfo,
        fetchgroupInfo
    } from "common/api/tool";
    var tableModel = {}
    export default {
        name: "purview",        
        component: {},
        data() {
            return {
                kw: "", //搜索词
                page: 1, //当前页码
                size: 10, //分页大小（每页的条数）
                total: 0, //总条目数            
                row: {private:false}, //当前正在编辑查看数据
                rows: [], //列表数据，从服务器获取
                dateRange: [], //中国时间数组 值两个
                show: [], //当前显示的字段(供筛选)
                order: [], //当前排序
                filter: "ALL", //当前检索字段
                dateType: 'NULL', //时间范围限定字段
                attrs: {}, //table原始数据列（不含功能）
                columns: [], //table展示列（实际展示,包含功能)
                selection: [], //table当前选择项（用于多选）
                modalShow: false,
                //table 字段属性
                fields: {
                    "all": [],
                    "edit": [],
                    "show": [],
                    "like": [],
                    "match": [],
                    "order": [],
                },
                roleData: [],
                flag:true,

            }
        },
        created() {
            fetchModel("Purview")
                .then(model => {
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
        wactch:{
            private:{
                deep:true,   //是否深度监视，默认值false
                handler:function(newV,oldV){
                    console.log(newV);
                    console.log(oldV);
                }
            }
        },
        methods: {

            privately(){ 
               
               if(this.flag){
                    function disable(t){
                        t["disabled"] = true;
                        // t["disableCheckbox"] = true;
                        if(t.children){
                            t.children.map((tree)=>{disable(tree)})
                        }
                    }
                    this.roleData.map((tree)=>{disable(tree)})
                    this.flag=false;
               }else{
                   function disable(t){
                        t["disabled"] = false;
                        // t["disableCheckbox"] = true;
                        if(t.children){
                            t.children.map((tree)=>{disable(tree)})
                        }
                    }
                    this.roleData.map((tree)=>{disable(tree)})
                    this.flag=true;
               }   
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
                let params = {};
                params["kw"] = this.kw;
                params["size"] = this.size;
                params["page"] = this.page;
                params["filter"] = this.filter;
                //获取数据
                fetchpurviewList(params).then(data => {
                    this.rows = data["rows"];
                    this.total = data["total"];
                    this.loading = false;
                })
            },
            // 表单多选
            onRowSelect(selection, row) {
                this.selection = selection;
            },
            // 初始化modal
            initModalData() {
                var modal = initModal(tableModel)
                this.row = modal;
                var validates = initValidate(tableModel);
                //添加自定义校验
                this.modalValidate = validates;
            },
            // 重置模态框
            modalReset(name) {
                this.$refs[name].resetFields();
            },
            infoRole() {
                fetchgroupInfo('lin22k')
                    .then(res => {
                        this.roleData = res;
                    })
            },
            // 打开模态窗口
            eidtRowData(index) {
                this.initModalData();
                this.infoRole()
                if (index >= 0) {
                    var id = this.rows[index]['id'];
                    this.create = false;
                    fetchpurviewInfo(id).then((data) => {
                        var arr = [];
                        // debugger
                        if (data.role) {
                            for (var i = 0; i < data.role.length; i++) {
                                arr.push(data.role[i].trim());
                            }
                        }
                        data.role = arr
                        this.row = data
                        this.modalShow = true;
                    })
                } else {
                    this.create = true;
                    this.modalShow = true;
                }
            },
            //提交数据
            modalSubmit(name) {
                var roleArray = this.$refs.getTreerole.getCheckedNodes();
                var array = [];
                if (roleArray) {
                    for (var key in roleArray) {
                        //如果是有子节点的
                        if( !roleArray[key].children){
                            array.push(roleArray[key].hash)
                        }   
                    }
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let params = this.row;
                        if (array.length) {
                            params['role'] = array;
                        }
                        if (this.create && !this.row["id"]) {
                            createpurview(params).then(data => {
                                this.$Message.success('创建成功!');
                                this.updateTable()
                                this.modalShow = false;
                            })
                        } else {
                            updatepurviewInfo(params).then(data => {
                                this.$Message.success('更新成功!');
                                this.updateTable()
                                this.modalShow = false;
                            })
                        }
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            //移除
            remove(index) {
                var id = this.rows[index]['id'];
                removepurviewInfo(id).then(data => {
                    this.rows.splice(index, 1);
                    this.$Message.info("删除成功")
                })
            },
            //批量删除（多选）
            batchRemove() {
                if (!this.selection.length) {
                    this.$Message.info("未选择数据");
                    return
                }
                var ids = [];
                var selection = this.selection;
                selection.forEach(row => {
                    ids.push(row["id"]);
                })
                removepurviewInfo(ids).then(data => {
                    this.$Message.info("成功删除" + data["count"] + "条数据");
                    this.updateTable();
                })
            },
            // 初始化表单列 （或更新）
            changeColumns() {
                let attrs = {};
                let columns = [];
                columns.push({
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: "left",
                })
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
                    align: 'center',
                    fixed: "right",
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.eidtRowData(params.index)
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                });
                this.columns = columns;
            },
        }
    }
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
.table-seach-box{
    padding-bottom:20px;
}

.modelRow {
    border: 1px solid #CCC;
    border-radius: 4px;
    padding: 20px;
    .modelheader {
        // padding: 30px;
        .ivu-form-item-label {
            font-size: 14px;
        }
    }
    .modelfooter {
        float: left;
        .treeRole {
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding-left: 70px;
        }
        span {
            font-size: 14px
        }
    }
}
.treeRole {
    .ivu-tree-title {
        font-size: 16px !important;
    }
}
</style>
