<template>
    <Card>
             <div><h1>直播管理编辑</h1></div>
           
            <Form ref="formData" :model="formData" :rules="formData" :label-width="80">
                <Row>
                    <Col :lg="12" :md="12" :sm="24" :xs="24" class='clearfix' >
                        <Row>
                             <div class='cover'>
                                <img src="../../asset/images/cropper-test.png" alt="">
                            </div>
                            <Col style='float:left'>
                                    <Card>
                                        <Button type="dashed"  @click='editcover'>点击更改封面</Button>
                                        
                                    </Card>
                             </Col>
                        </Row>
                    </Col>
                    <Col :lg="12" :md="12" :sm="24" :xs="24" >
                         <Card>
                            <div slot="title">
                                <Row>
                                    <Col span='10'>
                                    <FormItem label="房间">
                                        <Input v-model="formData.room" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    </Col>
                                    <Col span="8" offset="6">
                                    <strong>vip</strong>
                                    <InputNumber :max="10" :min="1" v-model="formData.vip"></InputNumber>
                                    </Col>
                                </Row>
                            </div>
                            <Row>
                                <Col span='12'>
                                     <FormItem label="主播id">
                                            <Input v-model="formData.uid" placeholder="Enter your name"></Input>
                                        </FormItem>
                                         <FormItem label="来源ip">
                                        <Input v-model="formData.ip" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="价格">
                                        <Input v-model="formData.price" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="热度">
                                        <Input v-model="formData.heat" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="波豆">
                                        <Input v-model="formData.bean" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="打赏">
                                        <Input v-model="formData.reward" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    
                                </Col>
                                <Col span='12'>
                                     <FormItem label="流名称">
                                        <Input v-model="formData.stream" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="拉流地址">
                                        <Input v-model="formData.pull" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="推流地址">
                                        <Input v-model="formData.push" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="鲜花数量">
                                        <Input v-model="formData.flower" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="围观人数" >
                                        <Input v-model="formData.look" placeholder="Enter your name"></Input>
                                    </FormItem>
                                    <FormItem label="点赞次数">
                                        <Input v-model="formData.like" placeholder="Enter your name"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Card>
                        <Card>
                            <FormItem label="标题">
                                <Input v-model="formData.title" placeholder="Enter your name"></Input>
                            </FormItem>
                            <FormItem label="简介">
                                <Input v-model="formData.blurb" placeholder="Enter your name"></Input>
                            </FormItem>
                             <FormItem label="地址">
                                <Input v-model="formData.address" placeholder="Enter your name"></Input>
                            </FormItem>
                        </Card>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('formData')">Submit</Button>
                            <Button type="ghost" @click="handleReset('formData')" style="margin-left: 8px">Reset</Button>
                        </FormItem>
                    </Col>

                </Row>
                
           </Form>
             <Modal v-model="coverModel" title="编辑" width='800px'>
                 <Row class-name="image-editor">
                    <Col span='14' class="image-editor-con1">
                        <div class="cropper">
                            <img :src='option1.cropedImg' id="cropimg1" alt="">
                        </div>
                    </Col>
                    <Col span='9' class="image-editor-con1" offset='1'>
                        <Row type="flex" justify="center" align="middle" class="image-editor-con1-preview-con">
                            
                            <div id="preview1">
                                <img :src="option1.preview" alt="">
                            </div>
                        </Row>
                        <div class="image-editor-con1-btn-con margin-top-10">
                            <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="handleChange1" id="fileinput1" class="fileinput" />
                            <label class="filelabel" for="fileinput1"><Icon type="image"></Icon>&nbsp;选择图片</label>
                            <span><Button @click="handlecrop1" type="primary" icon="crop">裁剪</Button></span>
                        </div>
                    </Col>
                </Row>
            </Modal>
    </Card>
  
     
</template>

<script>
// import iview from 'iview';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import {fetchLiveInfo,updateLiveInfo,createLiveInfo} from "common/api/live";
export default {
    name: 'liveShow',
    components: {

    },
    data () {
        return {
            coverModel:false,//封面编辑的model
            cropper1: {},
            option1: {
                cropedImg: '',
                preview:'',
            },
            formData: {
                uid: null,
                actid:null,
                type: '',//类型
                title: '',//标题
                label: '',//标签
                usersort: '',//用户类型
                address:'',//地址
                room: '',//房间
                price: '',//价格
                cover:'../../asset/images/login_bg.jpg'
                
            },
        }
    },
     created(){
        let id = this.$route.params.id;
        this.option1.cropedImg=this.formData.cover;
        if (id >= 0) {
            fetchLiveInfo(id).then(data => {
                // for(var key in  data){
                //     if(typeof data[key]=="number"&&key!="vip"){
                //         data[key]=data[key].toString();
                //     }  
                // }
                this.formData = data;
                this.option1.cropedImg=this.formData.cover;
            });
        }
    },
    methods:{
        handleChange1 (e) {
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.onload = () => {
                this.cropper1.replace(reader.result);
                reader.onload = null;
            };
            reader.readAsDataURL(file);
        },
        handlecrop1 () {
            let file = this.cropper1.getCroppedCanvas().toDataURL();
             this.formData.cover = file;
             this.option1.preview=file
        },
        //提交
        handleSubmit(name) {
            console.log(1)
           
            this.$refs[name].validate((valid) => {
                    
                if (valid) {
                    var params=this.formData;
                    if(  this.$route.params.id){
                        updateLiveInfo(params).then(data=>{
                            this.$Message.success('更新成功!');
                            this.formData={};
                        })
                    }else{
                        createLiveInfo(params).then(res=>{
                            this.$Message.success('创建成功!');
                            this.$router.push({
                                name: 'live_list'
                            });
                        })
                    }
                } else {
                    this.$Message.error('Fail!');
                }
            })
             debugger;
        },
        //重置
        handleReset(name) {
            // this.$refs[name].resetFields();
            this.formData={};
        },
        //更改封面
        editcover(){
            this.coverModel=true;
            
        }

    },
     mounted () {
        let img1 = document.getElementById('cropimg1');
        this.cropper1 = new Cropper(img1, {
            dragMode: 'move',
            // preview: '#preview',
            restore: false,
            center: false,
            highlight: false,
            cropBoxMovable: false,
            toggleDragModeOnDblclick: false,
            minContainerWidth: 462,
            minContainerHeight: 300,
        });
     }
};
</script>

<style lang="less">
  .image-editor {
        .cropper {
            box-sizing: border-box;
            border: 1px solid #c3c3c3;
            width: 100%;
            height: 100%;
            img {
                max-height: 100%;
            }
        }
        .fileinput {
            display: none;
        }
        .filelabel {
            display: block;
            padding: 6px 15px;
            background: #2d8cf0;
            display: inline-block;
            border: 1px solid #2d8cf0;
            border-radius: 4px;
            cursor: pointer;
            color: white;
            font-size: 12px;
            text-align: center;
            transition: all .2s;
            &:hover {
                background: #5cadff;
                border: 1px solid #5cadff;
                transition: all .2s;
            }
        }
        &-con1 {
            height: 300px;
            &-preview-con {
                width: 100% !important;
                height: 200px !important;
                border: 1px solid #c3c3c3;
                #preview1 {
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                     img{
                        max-height: 100%;
                        // height: 100%;  
                    }
                   
                }
            }
        }
    }
 .cover{
     width: 320px;
     height: 568px;
     border: 1px solid#495060;
     float: left;
     img{
         max-width: 100%;
     }
 }
 .clearfix::before,.clearfix::after{
     content:'';
     display: block;
     clear: both;
 }
 .clearfix{
     zoom:1;
 }
</style>
