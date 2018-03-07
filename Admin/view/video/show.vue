<template>
    <!-- <div>短视频首页  管理推荐，排行等数据</div> -->
    <div>
        <div class='videoEdit-header'>
            <h1>视频展示页面</h1>
        </div> 
        <Form ref="formData" :model="formData" :rules="formData" :label-width="80">
        <div class="clearfix"> 
        <Row>  
            <!-- <Col class='video-left'> -->
            <Col span="12">
                <Card class="video-Video">
                        <div class="videoDetails">
                            <!-- <video width="568" height="320" 
                            src="http://video.yimwing.com/8fcd53b803134722b558a94fb7943545/da8893cbf385416c82b3d016e13552a6-5287d2089db37e62345123a1be272f8b.mp4" 
                            poster="http://www.youname.com/images/first.png" autoplay="autoplay"></video> -->
                            <video width="568" height="320" 
                            :src="formData.path" 
                            poster="../../asset/images/cover.jpg" autoplay="autoplay"></video>
                        </div>
                </Card>
                 <Card class="video-data">
                     <div class="Upload-video">
                            <strong >点击上传视频</strong>
                            <div class="Upload-video-button">
                                <Upload action="//jsonplaceholder.typicode.com/posts/">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
                                </Upload> 
                            </div>
                     </div>
                    <FormItem label="视频路径" >
                        <Input v-model="formData.path" placeholder="视频路径"></Input>
                    </FormItem>
                     <FormItem label="token" >
                        <Input v-model="formData.token" placeholder="Enter your name"></Input>
                    </FormItem>
                    <FormItem label="房间" prop="room">
                        <Input v-model="formData.room" placeholder="Enter your name"></Input>
                    </FormItem>
                    <FormItem label="活动ID" >
                        <Input v-model="formData.actid" placeholder="Enter your name"></Input>
                    </FormItem> 
                    <Row>
                        <Col span="12">
                            <FormItem label="用户ID"  prop="uid">
                                <Input v-model="formData.uid" placeholder="Enter your name"  style="font-size:'16px'"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <strong>vip</strong> 
                            <InputNumber :max="10" :min="1" v-model="formData.vip"></InputNumber>
                        </Col>
                    </Row>
                    <FormItem label="用户类型" >
                        <Input v-model="formData.usersort" placeholder="Enter your name"></Input>
                    </FormItem>
                    <strong  style='margin-right:30px'>缩略图</strong>
                    <Button type="success">缩略图上传</Button>
                     <FormItem label="缩略图路径" >
                        <Input v-model="formData.thumbnail" placeholder="Enter your name"></Input>
                    </FormItem>
                    <div class="video-thumbnail">
                        <div class="video-thumbnail-img">
                            <img :src="formData.thumbnail?formData.thumbnail:'../../asset/images/cover.jpg'" alt="">
                        </div> 
                    </div>
                </Card>
            </Col>
            <!-- <div class='video-left'> -->
            <Col span="12">
                <Card class="video-detail">
                    <div class="video-detail-header">
                        <strong></strong>
                        <FormItem label="标题" >
                            <Input v-model="formData.title" placeholder="Enter your name"></Input>
                        </FormItem>
                    </div>
                    <FormItem label="类型" >
                        <Input v-model="formData.type" placeholder="Enter your name"></Input>
                    </FormItem>
                    <FormItem label="标签" >
                        <Input v-model="formData.label" placeholder="Enter your name"></Input>
                    </FormItem>
                    <FormItem label="录制地址" >
                        <Input v-model="formData.address" placeholder="Enter your name"></Input>
                    </FormItem>
                     <Row>
                        <Col span="12">
                            <FormItem label="热度">
                                <Input v-model="formData.heat" placeholder="Enter your name"></Input>
                            </FormItem>
                            <FormItem label="波豆">
                                <Input v-model="formData.bean" placeholder="Enter your name"></Input>
                            </FormItem>
                            <FormItem label="打赏">
                                <Input v-model="formData.reward" placeholder="Enter your name"></Input>
                            </FormItem>
                            <FormItem label="点赞">
                                <Input v-model="formData.real_like" placeholder="Enter your name"></Input>
                            </FormItem>
                            <FormItem label="价格">
                                <Input v-model="formData.price" placeholder="Enter your name"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="浏览量">
                                <Input v-model="formData.real_people" placeholder="Enter your name"></Input>
                            </FormItem>
                            <FormItem label="热门天数" prop="hot_days">
                                <Input v-model="formData.hot_days" placeholder="Enter your name"></Input>
                            </FormItem>
                            <FormItem label="点赞次数">
                                <Input v-model="formData.like" placeholder="Enter your name"></Input>
                            </FormItem>
                            <FormItem label="观看次数">
                                <Input v-model="formData.look" placeholder="Enter your name"></Input>
                            </FormItem>
                            <FormItem label="分享次数">
                                <Input v-model="formData.share_count" placeholder="Enter your name"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <strong style='margin-right:20px'>封面图片</strong>
                    <Button type="success">图片上传</Button>
                    <FormItem label="封面图路径" >
                        <Input v-model="formData.cover" placeholder="Enter your name"></Input>
                    </FormItem>
                    <div class="video-cover">
                        <div class="video-cover-img">
                            <img :src="formData.cover ? formData.cover :'../../asset/images/xiaoka.jpg'" alt="">
                        </div> 
                    </div>
                    <div class="image-editor-submit">   
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('formData')">Submit</Button>
                            <Button type="ghost" @click="handleReset('formData')" style="margin-left: 8px">Reset</Button>
                        </FormItem>
                    </div>

                </Card>
            </Col>
            <!-- </div> -->
        </Row>
        </div>    
        </Form>
    </div>
</template>

<script>
// import iview from 'iview';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import {fetchVideoInfo,updateVideoInfo,createVideoInfo} from "common/api/video";
    export default {
        name: 'videoShow',
        components: {},
        data() {
            return {
                formData: {
                    //"type": "INTEGER",

                    uid: '',//用户ID
                    actid: '',//活动ID
                    type: '',//类型
                    // "type": "STRING",
                    cover: "",//封面图片长字符串
                    thumbnail: "",//缩略图长字符串
                    title: "",//标题
                    label: "",//标签 长字符串
                    address: "",//录制地点 长字符串
                    room: "",//房间 长字符串
                    //"type": "INTEGER",
                    usersort: '',//用户类型
                    price: '',//价格
                    vip: 0,//vip 非常小的整数
                    hot_days: '',//热门天数
                    heat: '',//热度
                    like: '',//点赞次数
                    look: '',//观看次数
                    real_like: '',//点赞
                    real_people:'',//浏览量
                    share_count: '',//分享次数
                    bean: '',//波豆
                    reward: '',//打赏
                    //"type": "STRING",
                    path:"",//视频路径长字符串
                    token: "",//token 长字符串
                    stealth: false,//"type": "BOOLEAN",隐身
                    latitude:0,//纬度
                    longitude:0,//经度
                    audit:0,//审核
                    fail_reason:"",//审核失败原因
                    audit_success_time:0,//审核时间
                },  
            };
        },
        methods: {
            handleSubmit(name) {
                 this.$refs[name].validate((valid) => {
                    if (valid) {
                        var params=this.formData;
                        if(  this.$route.params.id){
                            updateVideoInfo(params).then(data=>{
                                this.$Message.success('更新成功!');
                                this.formData={};
                            })
                        }else{
                            createVideoInfo(params).then(res=>{
                                this.$Message.success('创建成功!');
                                this.$router.push({
                                    name: 'video_list'
                                });
                            })
                        }
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset(name) {
                this.formData={};
            },
        },
        created(){
            let id = this.$route.params.id;
            if (id >= 0) {
                fetchVideoInfo(id).then(data => {
                    for(var key in  data){
                        if(typeof data[key]=="number"&&key!="vip"){
                            data[key]=data[key].toString();
                        }  
                    }
                    this.formData = data;
                });
            }
        }
    };
</script>

<style lang="less" scoped>
.videoEdit-header{
    border-bottom: 1px dotted #2D8CF0;
    margin-bottom: 20px;
    h1{
        padding-left:10px;
        color:#2D8CF0;
    }
}
.video-Video{
    display: flex;
    align-items: center;
    justify-content: center;
    .videoDetails{
        
    }
}
.video-data{
    .Upload-video{
        padding-left:20px;
       strong{
           margin-right:20px;
           float: left;
           line-height: 32px;
       }
    }
    .video-thumbnail{
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        .video-thumbnail-img{
            width: 300px;
            height:200px;
            img{
                width: 100%;
                height: 100%;  
            }
        }
    }
}
.video-detail{
    font-size: 16px;
    .video-detail-header{
        width:80%;
        background: pink;
        height: 83px;
        padding: 15px;
        margin:-36px auto 15px;
        border-radius: 3px;
        box-shadow: 2px 2px 3px #aaa;
    }
    .video-cover{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        margin-bottom: 20px;
         .video-cover-img{
            width: 500px;
            height:350px;
            img{
                width: 100%;
                height: 100%;  
            }
        }
    }
   
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
.video-right{float: right;}
.video-left{float: left;}

</style>
