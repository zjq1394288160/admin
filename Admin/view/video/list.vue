<template>
    <div class="wrapper-content">
        <Card shadow :bordered="false">
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
            {{fields.all}}
            <Table border :data="rows" :columns="columns" @on-selection-change="onRowSelect" :loading="loading" :height="size>10? 500 : '' "></Table>
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
                                <FormItem label="点赞">
                                    <Input v-model="row.real_like" placeholder="Enter your name"></Input>
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
                                <FormItem label="浏览量">
                                    <Input v-model="row.real_people" placeholder="Enter your name"></Input>
                                </FormItem>
                                <FormItem label="热门天数" prop="hot_days">
                                    <Input v-model="row.hot_days" placeholder="Enter your name"></Input>
                                </FormItem>
                                <FormItem label="点赞次数">
                                    <Input v-model="row.like" placeholder="Enter your name"></Input>
                                </FormItem>
                                <FormItem label="观看次数">
                                    <Input v-model="row.look" placeholder="Enter your name"></Input>
                                </FormItem>
                                <FormItem label="分享次数">
                                    <Input v-model="row.share_count" placeholder="Enter your name"></Input>
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Card>
                        <Form-item >
                            <Button type="primary" @click="modalSubmit('row')">提交</Button>
                            <Button type="ghost" @click="modalReset('row')" style="margin-left: 8px">重置</Button>
                        </Form-item>
                    </Card>
                </Form>
            </Modal>
        </Card>
    </div>
</template>

<script>
    import {
        Message
    } from 'iview';
    import {
        modelParser,
        initModal,
        initValidate
    } from 'common/util/model';
    import {
        fetchModel
    } from 'common/api/tool';
    import {
        updateVideoInfo,
        removeVideoInfo,
        fetchVideoList, 
        fetchVideoInfo
    } from 'common/api/video';
    var tableModel = {};
    export default {
        name: "videoList",
        components: {},
        data() {
            return {
                kw: "", //搜索词
                page: 1, //当前页码
                size: 10, //分页大小（每页的条数）
                total: 0, //总条目数
                row: {}, //当前正在编辑查看数据
                rows: [], //列表数据，从服务器获取
                loading: false, //加载状态
                dateType:"NULL",//时间范围限定字段
                dateRange: [], //中国时间数组
                show: [], //当前显示的字段(供筛选)
                order: [], //当前排序
                filter: "ALL", //当前检索字段
                attrs: {}, //table原始数据列（不含功能）
                columns: [], //table展示列（实际展示,包含功能)
                selection: [], //table当前选择项（用于多选）
                // 模态框数据
                modalShow: false, //是否展示Modal
                modalValidate: {}, //Modal的验证属性
                msg: [],
                //table 字段属性
                fields: {
                    "all": [],
                    "edit": [],
                    "show": [],
                    "like": [],
                    "match": [],
                    "order": [],
                },
            };
        },
        created() {
            fetchModel("Video")
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
            // this.msg=this.model.attributes.msg;
        },
        methods: {
            toVideoShow() {
                this.$router.push({
                    name: 'video_show'
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
                params["dateRange"] = this.dateRange;
                //获取数据
                fetchVideoList(params).then(data => {
                    this.rows = data["rows"];
                    this.total = data["total"];
                    this.loading = false;
                })
            },
            //移除
            remove(index) {
                this.$Modal.confirm({
                    title: 'Title',
                    content: '<p>您是否确定删除</p>',
                    onOk: () => {
                        var id = this.rows[index]['id'];
                        removeVideoInfo(id).then(data => {
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
                    return
                }
                this.$Modal.confirm({
                    title: 'Title',
                    content: '<p>您是否确定删除</p>',
                    onOk: () => {
                       var ids = [];
                        var selection = this.selection;
                        selection.forEach(row => {
                            ids.push(row["id"]);
                        })
                        removeVideoInfo(ids).then(data => {
                            Message.info("成功删除" + data["count"] + "条数据");
                            this.updateTable();
                        })
                    }
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
            // 重置模态框
            modalReset(name) {
                this.$refs[name].resetFields();
            },
            // 打开模态窗口
            eidtRowData(index) {
                this.initModalData();
                if(index>=0){
                    var id = this.rows[index]['id'];
                    this.create = false; //create==false 编辑
                    fetchVideoInfo(id).then((data) => {
                        this.row = data
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
                        updateVideoInfo(params).then(data => {
                            Message.success('更新成功!');
                            this.updateTable()
                            this.modalShow=false;
                        })
                    } else {
                        Message.error('表单验证失败!');
                    }
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
                                style: {
                                    marginRight: "2px"
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
                                style: {
                                    marginRight: "2px"
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index)
                                    }
                                }
                            }, '删除'),
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        // this.details(params.index)
                                        location.href = location.pathname + "#/video/show/" + params.row['id']
                                    }
                                }
                            }, '详情')
                        ]);
                    }
                });
                this.columns = columns;
            }
        }
    };
</script>
<style lang="less" scoped>
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
