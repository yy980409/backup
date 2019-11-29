<template>
    <div class="back" >
        <headTop></headTop>
        <el-collapse-transition>
            <div v-show="showProgress">
                <el-progress :percentage="dev_per" :format="format"></el-progress>
            </div>
        </el-collapse-transition>
<!--        用于激活updated函数-->
        <p v-show="false">{{cc}}</p>
<!--        -->
        <el-row :gutter="10" style="margin:10px;">
            <el-col :span="19">

                <el-card class="box-card1"  >
                    <el-col :span="2" >
                    <i class="el-icon-s-platform" ></i>
                    </el-col>
                    <el-col :span="22" >
                        <el-row >
                            <el-col :span="4" ><span class="aa">设备总数</span></el-col>
                            <el-col :span="4" ><span class="aa">在线设备数</span></el-col>
                            <el-col :span="4" ><span class="aa">离线设备数</span></el-col>
                            <el-col :span="4" ><span class="aa">故障设备数</span></el-col>
                            <el-col :span="8" ><span class="aa">传感器数据</span></el-col>
                        </el-row>
                        <el-row :span="22">
                            <el-col :span="4" ><span class="bb">
                                <animated-number :number="normalState.length+offlineState.length+errorState.length" :time="1.5"></animated-number>
                            </span></el-col>
                            <el-col :span="4" ><span class="bb">
                                     <animated-number :number="normalState.length" :time="1.5"></animated-number>
                            </span></el-col>
                            <el-col :span="4" ><span class="bb">
                                     <animated-number :number="offlineState.length" :time="1.5"></animated-number>
                            </span></el-col>
                            <el-col :span="4" ><span class="bb">
                                     <animated-number :number="errorState.length" :time="1.5"></animated-number>
                            </span></el-col>
                             <el-col :span="8" ><span class="bb">{{animatedTotalData}}</span></el-col>

                        </el-row>
                    </el-col>


                </el-card>

            </el-col>

            <el-col :span="5" class="cc">
                <el-popover
                    placement="bottom"
                    width="600"
                    trigger="click"
                    visible-arrow="false"
                >

                    <el-table :data="currentPageData"  @row-click='handleErrorList'>
                        <el-table-column width="80" property="area" label="区域"></el-table-column>
                        <el-table-column width="120" property="name" label="设备号"></el-table-column>
                        <el-table-column width="250" property="error" label="故障信息"></el-table-column>
                        <el-table-column width="150" property="time" label="时间"></el-table-column>
                    </el-table>
                    <el-pagination
                        :current-page="currentPage"
                        @current-change="handleCurrentChange"
                        :page-size="pageSize"
                        :total="errorFramePageCount"
                        layout="total, prev, pager, next"
                    ></el-pagination>

                        <el-button  slot="reference" class="box-button">
                            <el-col :span="2" style="margin-top: 10px">
                                <el-badge  :hidden="badgeSeen" :value="badgeValue" class="item">
                                    <i class="el-icon-message-solid" ></i>
                                </el-badge>
                            </el-col>
                            <el-col :span="20" :offset="2" class="cc" >
                                <div class="fade" v-if="!badgeSeen">
                                <transition name="fade" >
                                    <p class="pp" v-if="show"  key="1">{{data1.area}}设备{{data1.name}} {{data1.error}}</p>
                                    <p class="pp" v-if="!show" key="2">{{data2.area}}设备{{data2.name}} {{data2.error}}</p>

                                </transition>
                                </div>
                                <div class="fade" v-if="badgeSeen">
                                    <p class="pp" >设备无异常</p>
                                </div>

                            </el-col>
                        </el-button>

                </el-popover>

            </el-col>
        </el-row>

    <el-row :gutter="20" style="margin:10px">
        <el-col :span="4">
            <el-container >
                <el-header height="30px" >设备列表</el-header>
                <el-main >

                    <el-scrollbar class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="default-scrollbar__view" :native="false" :onresize="true">
                        <el-form :inline="true"  :model="formInline" class="demo-form-inline" @submit.native.prevent >
                            <el-form-item >
                                <el-input v-model="formInline.device_id" placeholder="设备号" @keyup.enter.native="onSubmit" style="width:150px;margin-top: 10px;margin-left: 10px" ></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit" style="margin-top: 10px">查询</el-button>
                            </el-form-item>
                        </el-form>
                        <el-menu style="margin: 0" class="main-menu" :default-openeds="['1']" :default-active="defaultActive" @select="handleList">
                        <el-submenu index="1" style="width: 90%">
                            <template slot="title"><i class="el-icon-s-tools"></i>设备</template>
                            <el-col :span="12"></el-col>
                            <el-col  :offset="2">


                            <el-tree :data="areaData"
                                     :props="defaultProps"
                                     @node-click="handleNodeClick"
                                     node-key="id"
                                     :filter-node-method="filterNode"
                                     default-expand-all
                                     ref="tree"
                                     accordion
                            ></el-tree>


                            </el-col>
<!--                            <el-menu-item v-for="item in info"-->
<!--                                          :key="item.device_id"-->
<!--                                          :index="item.device_id+''"-->
<!--                            >设备{{item.device_id}}-->
<!--                            </el-menu-item>-->
                        </el-submenu>
                    </el-menu>
                    </el-scrollbar>
                </el-main>

            </el-container>

        </el-col>

        <el-col :span="20">
            <el-container >
                <el-header height="30px">
                    <div style="display: flex">
                        设备信息
                        <el-checkbox   style="margin-right: 20px;margin-left: 15px"  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-model="checkedStatus" @change="handleCheckedCitiesChange">
                            <el-checkbox  label="在线" style="margin-right: 20px"></el-checkbox>
                            <el-checkbox  label="离线" style="margin-right: 20px"></el-checkbox>
                            <el-checkbox  label="故障" style="margin-right: 20px"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-header>
                <el-main>
                    <el-row :gutter="0" >
                    <el-col :span="18">
                        <div id="map1" class="" style="width: 100%;height:710px;"></div>

<!--                        <el-button @click="adad"></el-button>-->
<!--                        <div class="amap-wrapper" style="width: 100%;height: 710px;">-->
<!--                            <el-amap class="amap-box" :vid="'amap-vue'" :events="events" :amap-manager="amapManager">-->
<!--                            </el-amap>-->
<!--                        </div>-->

<!--                        <baidu-map style="display: flex;flex-direction: column"-->
<!--                                   :center="{lng: this.center[0], lat: this.center[1]}"-->
<!--                                   :zoom="15"-->
<!--                                   :scroll-wheel-zoom="true"-->
<!--                                   :mapStyle="baidumapStyle"-->
<!--                                   @ready="mapHandler"-->
<!--                                   >-->
<!--                            {{center}}<el-button @click="points=[]"></el-button>-->

<!--                            <bm-view style="width: 100%; height:710px; flex: 1"></bm-view>-->
<!--                            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>-->
<!--                            <bm-info-window :position="{lng: 116.404, lat: 39.915}" title="Info Window Title"></bm-info-window>-->

<!--                            <bm-point-collection :points="points"-->
<!--                                                 shape="BMAP_POINT_SHAPE_CIRCLE"-->
<!--                                                 color="#2fffff"-->
<!--                                                 size="BMAP_POINT_SIZE_NORMAL"-->
<!--                                                 >34-->
<!--                            </bm-point-collection>-->
<!--                        </baidu-map>-->
                    </el-col>
                    <el-col :span="6" style="height: 100%">

                        <div style="height: 100%">
                            <el-scrollbar class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="default-scrollbar__view" :native="false" :onresize="true">

                            <el-card class="box-card3"  >
<!--                                多选框 未开发-->
<!--                                <div style="display: flex;flex-wrap: nowrap">-->
<!--                                <el-checkbox   style="margin-right: 20px;margin-left: 15px"  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
<!--                                <el-checkbox-group v-model="checkedStatus" @change="handleCheckedCitiesChange">-->
<!--                                    <el-checkbox  label="在线" style="margin-right: 20px"></el-checkbox>-->
<!--                                    <el-checkbox  label="离线" style="margin-right: 20px"></el-checkbox>-->
<!--                                    <el-checkbox  label="故障" style="margin-right: 20px"></el-checkbox>-->
<!--                                </el-checkbox-group>-->
<!--                                </div>-->
<!--                                <el-button v-on:click="sshow = !sshow">转换</el-button>-->

<!--                                <el-button v-on:click="change">转换</el-button>-->
<!--                                <el-button v-on:click="addLine">ADD</el-button>-->
<!--                                <el-button v-on:click="clear">Clear</el-button>-->
                                <el-button v-on:click="timeOrder">按时间排序</el-button>
                                <el-button v-on:click="typeOrder">按维修单状态排序</el-button>
<!--                                <el-button v-on:click="ws">ws</el-button>-->
<!--                                <el-button v-on:click="send">send</el-button>-->

                                <el-divider ></el-divider>
                                <transition-group  appear name="animated-line"
                                                   >
                                    <el-card v-if="sshow" :class="{cardLine:1===1,cardLineRed:error.bill.status==='未维修',cardLineGreen:error.bill.status==='维修中',cardGray: error.bill.status==='已维修'}"
                                             @mouseenter.native="move(error)"
                                             v-for="(error,index) in errorsCom"
                                             :key=error.error.name+error.error.error
                                             @click.native="errorClick(error.error.name)"
                                             >
                                        <p style="color:#ffffff;">{{error.error.area}}设备{{error.error.name}}{{error.error.error}}</p>
                                        <br><el-divider></el-divider>
                                        <p style="font-size: 16px;color: #ffffff;line-height:100%">{{error.error.time}}<br>维修状态：{{error.bill.status}}<br>维修员：{{error.bill.repairer}}<br>电话：{{error.bill.repairer}}</p>
                                    </el-card>
                                </transition-group>

                                <!--//---------------旧版状态-->
                                <div v-if="false">
                                    <el-divider > <span style="font-size: 18px;font-weight: bold">设备状态</span></el-divider>
                                    <div v-if="seen">
                                        <el-row >
                                            <!--//左框-->
                                            <el-col :span="9" style="text-align: right;font-weight: bold">
                                                <el-row >设备号</el-row>
                                                <el-row v-for="(value,name) in dynamicInfo" :key="name">
                                                    {{name}}
                                                </el-row>
                                            </el-col>
                                            <!--//右框-->
                                            <el-col :span="12" :offset = "0" style="text-align: left">
                                                <el-row ><span style="text-align: left;font-weight: bold">:</span> {{current_id}}</el-row>
                                                <el-row v-for="(value,name) in dynamicInfo" :key="name">
                                                    <span style="text-align: left;font-weight: bold">:</span> {{value}}
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </div>



                                    <!--//详情按钮-->
                                    <div v-if="seen">
                                        <el-divider></el-divider>
                                        <el-row >
                                            <el-col style="text-align: right">
                                                <el-button round @click="push" class="el-icon-info"> 详细信息</el-button>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>


                            </el-card>
                        </el-scrollbar>
                        </div>


                    </el-col>
                </el-row></el-main>

            </el-container>



        </el-col>
    </el-row>
    </div>
</template>

<script>
    import {testUrl,pushUrl} from '../config/env'
	import TweenLite from "gsap";
	import headTop from './headTop';
	import animatedNumber from './animatedNumber';
	import { getAllTree,getOneTree,getOrder,getErrorInfo,getArea,getDevSensors,
        getGPS,getDevCount} from '@/api/getData'
	import echarts from 'echarts/lib/echarts';
    import 'echarts/lib/chart/scatter'
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/component/title';
	import 'echarts/extension/bmap/bmap'
	import Stomp from "webstomp-client"
    import SockJS from "sockjs-client"

	import { AMapManager } from 'vue-amap';
	import VueAMap from 'vue-amap';
	const statusOptions = ['在线', '离线', '故障'];
	let amapManager = new VueAMap.AMapManager();
	export default {
		inject:['reload'],
		components:{
			headTop,animatedNumber
        },
		data(){
			return {
				showProgress:true,
				dev_num:0,
                dev_per:0,
				formInline:{
					device_id:null,
				},
				//////分区
                updateReady:false,
                updateCompeleted:false,
                ii:0,
                cc:0,
                defaultTemp:[1],
				defaultOpenKey:[1],
				areaData:[
					{
						id: '所有分区',
						area_name:'所有分区',
						children:[],
						isparent:true,
					},
                ],//完整树
                rootArea:[],//权限树
				defaultProps: {
					children: 'children',
					label: 'area_name',
					id:'id',
				},
				nodePointer:{},
				initFlag:false,
				//故障框滚动动画、数据、列表值
                errors:[
                    // {
                    // 	error:{name:"ns10001",area:"宝安区",error:"水浸异常 ",time:"2019.8.27 16:18:00"},
                    //     bill:{status:"未维修",repairer:"无",tel:""}
                    // },
					// {
					// 	error:{name:"ns10002",area:"宝安区",error:"重合闸故障 ",time:"2019.8.27 16:18:00"},
					// 	bill:{status:"维修中",repairer:"蔡徐坤",tel:""}
					// },
                    // {
					// 	error:{name:"ns10003",area:"宝安区",error:"重合闸故障 ",time:"2019.8.21 16:18:00"},
					// 	bill:{status:"已维修",repairer:"蔡徐坤",tel:""}
					// }
                ],
                errorsCom:[

                ],
                tt:0,
                orderFlag:false,
                sshow:true,
                gridOrder:0,
                centreData:{name:"",area:"",error:"",time:""},
				animate:false,
                show:true,
                data1:{name:"",area:"",error:"",time:""},
                data2:{name:"",area:"",error:"",time:""},
				gridData: [
					// {name:"ns122229",area:"宝安区",error:"error233 ",time:"2019.8.27 16:18:00"},
					// {name:"ns144449",area:"宝安区",error:"error233 ",time:"2019.8.27 16:18:00"},
					// {name:"ns1",area:"南山区",error:"error233 ",time:"2019.8.27 16:18:00"},
					// {name:"ns2",area:"南山区",error:"error2333 ",time:"2019.8.27 16:18:00"},
					// {name:"ba3",area:"宝安区",error:"error233 ",time:"2019.8.27 16:18:00"},
					// {name:"ft4",area:"福田区",error:"error233 ",time:"2019.8.27 16:18:00"},
					// {name:"lh5",area:"龙华区",error:"error233 ",time:"2019.8.27 16:18:00"},
					// {name:"ns6",area:"南山区",error:"error233 ",time:"2019.8.27 16:18:00"},
					// {name:"ns7",area:"南山区",error:"error2333 ",time:"2019.8.27 16:18:00"},
					// {name:"ba8",area:"宝安区",error:"error233 ",time:"2019.8.27 16:18:00"},
					// {name:"ft9",area:"福田区",error:"error233 ",time:"2019.8.27 16:18:00"},
					// {name:"lh10",area:"龙华区",error:"error233 ",time:"2019.8.27 16:18:00"},
				],
                currentPageData:[],
                ////分页
				currentPage: 1,
				pageSize:6,
                //设备总数
				testCount:null,
                totalData:0,
                //GPS信息
				info:[],
				center: [113.94117874959207,22.545135832607247],
				center2: [113.95,22.545135832607247],
                //动画数
				tweenedTotalData:0,
                //当前id
                current_id:"",
                //按钮可视
                seen:false,
                //设备状态信息
                dynamicInfo:{},
                //test
                ii:0,
				errorFrameTimer:"",
                timer:"",
				myChart:null,
                //mapFrame
                mapFrameId:'',
                mapFramecontent:'Loading',
                //newMap
				baidumapStyle:{
					styleJson: [
						{
							"featureType": "building",
							"elementType": "labels.text.fill",
							"stylers": {
								"visibility": "off"
							}
						},
						{
							"featureType": "manmade",
							"elementType": "all",
							"stylers": {
								"visibility": "off"
							}
						},
						{
							"featureType": "poilabel",
							"elementType": "all",
							"stylers": {
								"visibility": "off"
							}
						},
						{
							"featureType": "road",
							"elementType": "all",
							"stylers": {}
						}
					],
				},
				points: [],
                /////高德MAP
				amapManager,
				events: {
					init(o) {

					}
				},
                //queue
				normalState:[],
				offlineState:[],
				errorState:[],
                starState:[],
                frashActive:0,
                //多选框
				checkAll: true,
				isIndeterminate: false,
				checkedStatus:["在线","离线","故障"],
                status:statusOptions,
                //信息框
				opts : {
					width : 100,     // 信息窗口宽度
					height: 100,     // 信息窗口高度
					title : "<p style='font-size: 20px;text-align: center;margin-bottom: 5px'>设备状态</p>" , // 信息窗口标题
				},
                //监测离线
				connectCount:0,
                remoteCount:0,
            }
		},
        created(){
			this.initialData();

        },
		mounted(){
        //errorFrameTable第一页初始化
			for(var i=0;i<this.pageSize;i++){
				if(this.gridData[i]===null){console.log("break");break;}
				this.currentPageData[i]=this.gridData[i];
			}

			this.myChart = echarts.init(document.getElementById('map1'));
			this.initData(this.myChart);

		},
		methods: {
			format(percentage) {
				return `当前设备加载进度${percentage}%`;
			},
			handleCheckAllChange(val) {
				this.checkedStatus = val ? statusOptions : [];
				this.isIndeterminate = false;
				this.handldFrashActive(0);
			},
            handldFrashActive(bool){//地图未处于(0)/处于(1)轮询更新时，处理状态多选框,并更新地图
				if(this.frashActive===bool){
					//多选框显示
					var N=this.checkedStatus.indexOf("在线");
					var O=this.checkedStatus.indexOf("离线");
                    var E=this.checkedStatus.indexOf("故障");
					if(N!==-1){//正常点渲染
						this.Npoint.setPoints(this.normalState);
					}else{
						this.Npoint.clear();}
					if(O!==-1){//离线点渲染
						this.Opoint.setPoints(this.offlineState);
					}else{
						this.Opoint.clear();}
					if(E!==-1){//故障点渲染
						this.Epoint.setPoints(this.errorState);
                    }else{
						this.Epoint.clear();}

				}
            },
            handleStarRender(){
				var Star=this.starState.length;
				if(Star>0){//聚焦点渲染
					var Noptions = {
						size: BMAP_POINT_SIZE_HUGE,
						shape: BMAP_POINT_SHAPE_STAR,
						color: '#519be6'
					};
					var Ooptions = {
						size: BMAP_POINT_SIZE_HUGE,
						shape: BMAP_POINT_SHAPE_STAR,
						color: '#636563'
					};
					var Eoptions = {
						size: BMAP_POINT_SIZE_HUGE,
						shape: BMAP_POINT_SHAPE_STAR,
						color: '#dd0009'
					};

					this.Starpoint.setPoints(this.starState);
					if(this.starState[0].status==='在线'||this.starState[0].status==='正常'){
						this.Starpoint.setStyles(Noptions);
                    }else if(this.starState[0].status==='离线'){
						this.Starpoint.setStyles(Ooptions);
                    }else{
						this.Starpoint.setStyles(Eoptions);
                    }
				}else{
					this.Starpoint.clear();}
            },
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.status.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.status.length;
				this.handldFrashActive(0);
				},
			async adad(){
			    await this.getGPSs();
				let a=[];
				for(let i=0;i<this.info.length;i++){
					let b={};
					b.lnglat=[this.info[i].longitude,this.info[i].latitude];
					b.name="test";
					b.id=1;
					a.push(b);
				}
				let o = amapManager.getMap();

				var style = {
					url: '//vdata.amap.com/icons/b18/1/2.png',
					anchor: new AMap.Pixel(6, 6),
					size: new AMap.Size(11, 11)
				};

				var massMarks = new AMap.MassMarks(a, {
					opacity: 0.8,
					zIndex: 111,
					cursor: 'pointer',
					style: style
				});

				massMarks.setMap(o);


				// massMarks.setData(a);
				// massMarks.setMap(o);

            },
			errorClick(val){
				this.findInMap(val);
            },
			send(){
				console.log("fa送");
				this.client.send("/app/hello",JSON.stringify({name:"2323",content:"sdasdasd"}),{});
				console.log("成功");
            },
			async connectCounter(){
			    this.connectCount+=5;
				const One=await getOneTree();//访问并断开
				if(this.connectCount-this.remoteCount>=5){

					this.$store.dispatch('logout','注销成功');
					clearInterval(this.connectTimer);
					location.reload();
					this.tikTok(5000);
					this.$message({
						type: 'success',
						message: '该账号在另外的设备登录'
					});
                }
            },
			ws(){
				let path=testUrl+"/chat";
				this.socket = new SockJS(path);
				this.client=Stomp.over(this.socket);
				var self=this;
				this.connectTimer=setInterval(this.connectCounter,5000);
				this.client.connect({},function(frame){
					console.log("ws连接成功");
					self.client.subscribe('/topic/online',function(greeting){
						console.log(greeting.body);
						self.remoteCount+=5;
					});
					self.client.subscribe('/user/queue/order',function(greeting){
						const temp=JSON.parse(greeting.body);
						const orderStatus=temp["order_status"];
						const mstaffName=temp["mstaff_name"];
						const tel=temp["phoneNumber"];
						const id=temp['id'];
                        console.log(temp);
						for(var i=0;i<self.errorsCom.length;i++){
							if(self.errorsCom[i].bill.id===id){
								self.errorsCom[i].bill.status=orderStatus;
								self.errorsCom[i].bill.repairer=mstaffName;
								self.errorsCom[i].bill.tel=tel;

								break
							}
						}
					});
					self.client.subscribe('/user/queue/error/remove',function(greeting){
						console.log(greeting.body);
						const temp=JSON.parse(greeting.body);
                        const name=temp['device_id'];
                        const error=temp['description'];
                        for(var i=0;i<self.errorsCom.length;i++){
							if(self.errorsCom[i].error.name===name&&self.errorsCom[i].error.error===error){
								self.errorsCom.splice(i,1);break;
							}
                        }




					});
					self.client.subscribe('/user/queue/error/add',function(greeting){
						console.log(greeting.body);
                        const temp=JSON.parse(greeting.body);
						//故障
                        const a={};
						a.name=temp['device_id'];
						a.area=temp['area_name'];
						a.error=temp['description'];
						a.time=temp['create_time'];
						console.log(a);
						//订单
						getOrder({device_id:a.name}).then(result =>{
							console.log("result:",result);
							const Obj={};
							Obj.error=a;
							Obj.bill={};
							Obj.bill.status='无维修单';
							Obj.bill.repairer='无';
							Obj.bill.tel='无';
							Obj.bill.id="";
							result.msg.forEach(item =>{
								if(item.description===a.error){
									Obj.bill.status=item.order_status;
									Obj.bill.repairer=item.mstaff_name;
									Obj.bill.tel=item.phoneNumber;
									Obj.bill.id=item.id;
								}
							});
							self.errorsCom.splice(0,0,Obj);
							if(self.orderFlag){
								self.typeOrder();
							}
                        });



						// this.open();
					});
					self.client.subscribe('/topic/status',async function(greeting){
						console.log('change');
						let temp=JSON.parse(greeting.body);
						var str=temp.device_id;
						if(self.info2[str]!==undefined){
							if(self.starState.length>0){//聚焦点样式改变
								if(self.starState[0].device_id===temp.device_id){
									self.starState[0].status=temp.status;
                                }
                            }
							self.info2[str].status=temp.status;
							self.frashActive=1;
                        }

					});

				});
				this.mapTimer=setInterval(this.mapFrash,1000);

			},
			async mapFrash(){
				if(this.frashActive===1){
					console.log("frash");
					await this.statusConvert();
					//多选框切换显示、轮询显示、聚焦点(star)渲染
					this.handldFrashActive(1);
					this.handleStarRender();
					this.frashActive=0;
                }else{
					return
				}

			},
            open(){
				alert("连接成功");

            },
			change(){
				if(this.errorsCom[0].bill.status==="未维修"){
					this.errorsCom[0].bill.status="维修中";
				}else{
					this.errorsCom[0].bill.status="未维修";
                }
				if(this.orderFlag){
					this.typeOrder();
				}

            },
			timeOrder(){
				this.orderFlag=false;
				this.errorsCom.sort(function(a,b){
					if (a.error.time >= b.error.time) {
						return -1;
					} else {
						return 1;
					}
				});
            },
			timeStamp(time){
				var date = time.toString();
				date = date.substring(0,19);
				date = date.replace(/-/g,'/');
				var timestamp = new Date(date).getTime();
				return timestamp;
			},
            typeOrder(){
				this.orderFlag=true;
                this.errorsCom.sort(function(a,b){
                	var x=0;
                	var y=0;
                    if(a.bill.status==='已维修'){
                    	x=1;
                    }else if(a.bill.status==='未维修'){
                    	x=0;
                    }else{
                    	x=-1;
                    }
					if(b.bill.status==='已维修'){
						y=1;
					}else if(b.bill.status==='未维修'){
						y=0;
					}else{
						y=-1;
					}

					if(x===y){
						if(a.error.time>=b.error.time){
							return -1;
						}else{
							return 1;
						}
					}
                    if (x>y) {
							return -1;
						}else{
							return 1;
						}




                });
            },
			clear(){
				this.errorsCom.splice(2,1);
            },
			addLine(){
				let aa=this.tt++;
				let timea="2019.8.27 16:18:00";
				let tt=this.timeStamp(timea);tt+=(aa+1)*100000;console.log(tt);
				timea=new Date(tt).toLocaleString().replace(/:\d{1,2}$/,' ');console.log(timea);
				let random=Math.floor(Math.random()*2);
				let ss='';let rr='';
				if(random===1){ss= "未维修";rr="无"}else{ss="维修中";rr="蔡徐坤"}
				let ll={
					error:{name:aa,area:"宝安区",error:"水浸异常 ",time:timea},
					bill:{status:ss,repairer:"无",tel:""}
				};
			    this.errorsCom.splice(0,0,ll);
            },
			async move(val){
				//setTimeout回调输出loading或结果
				console.log(val);
            },
			testButt(){
				console.log('233');
            },
			async onSubmit() {
				if (this.formInline.device_id === null||this.formInline.device_id === "") {
                    return
				} else {
					let ff=this.info.find((ele) => (ele.device_id.toString()===this.formInline.device_id));
					if(ff){
						this.handleList(this.formInline.device_id);
					}else{
						this.$message({
							message: '未找到设备'+this.formInline.device_id,
							type: 'warning'
						});
                    }


				}
			},
			filterNode(value, data,node) {
				if(!this.initFlag){//数据初始化标志
					//搜索字段
					if(node.level===1){
						data.keyword=[];
					}else{
						data.keyword=[];
						for(const i of node.parent.data.keyword){
							data.keyword.push(i);
						}
						data.keyword.push(data.area_name);
					}

					if(this.rootArea.indexOf(node.key)!==-1){
						this.nodePointer[node.label]=node.data;

					}

				}else{//判断结点以及筛选
					if (!value) {//输入为空
						if(this.rootArea.indexOf(node.key)!==-1){
							return true;
						}
					}else{
						if(node.visible!==undefined ){
							for(const i of data.keyword)
								if(i.indexOf(value) !== -1){
									return true;
								}

						}
					}
				}
			},
			async getAreas(){//分区初始化
				//完整分区树
				const Tree=await getAllTree();
				this.areaData[0].children=Tree;
				//权限树
				const One=await getOneTree();
				this.rootArea=One;

				await this.$refs.tree.filter();//往分区树导入设备数据
				this.initFlag=true;
				this.$refs.tree.filter();//筛选权限树
				this.shrink(this.$refs.tree.getNode(this.areaData[0].id));//缩进区域
            },
            async getError(){//故障框

				//////故障初始化
				const errorInfo=await getErrorInfo({});
				let errorTemp=[];
				errorInfo.forEach(item => {
					let a={};
					a.name=item.device_id;
					a.area=item.area_name;
					a.error=item.description;
					a.time=item.create_time;
					errorTemp.push(a);
				});
				this.gridData=errorTemp;
                //获取故障订单
                let Etemp=[];
				for(var i=0;i<this.gridData.length;i++){
					var error=this.gridData[i];
					let order=await getOrder({device_id:error.name});
					console.log(order);
					let Obj={};
					Obj.error=error;
					Obj.bill={};
					Obj.bill.status='无维修单';
					Obj.bill.repairer='无';
					Obj.bill.tel='无';
					Obj.bill.id='';
					if(order.status!=='fail'){
						order.msg.forEach(item =>{
							if(item.description===error.error){
								Obj.bill.status=item.order_status;
								Obj.bill.repairer=item.mstaff_name;
								Obj.bill.tel=item.phoneNumber;
								Obj.bill.id=item.id;
							}
						});
                    }


					await Etemp.push(Obj);
				}
				this.errors=Etemp;
				console.log(Etemp);
				//errorFrameTable第一页初始化
				for(var i=0;i<this.pageSize;i++){
					if(this.gridData[i]===null){console.log("break");break;}
					this.currentPageData[i]=this.gridData[i];
				}
				//////故障框计时器
					this.errorFrameTimer=setInterval(this.scroll,3100);

            },
			async getGPSs(){////////获取GPS
				var GPS=await getGPS();
				this.info=GPS;

			},
			convertAreaData:function(){


					this.info.forEach(item => {
						if(this.nodePointer[item.area]){
							let temp={};
							temp.id=item.device_id;
							temp.area_name=item.device_id;
							this.nodePointer[item.area].children.push(temp)
                            console.log('233');
                        }
					});
                // if(this.$refs.tree.getNode(this.areaData[0].id).childNodes){//缩进
				// 	this.$refs.tree.getNode(this.areaData[0].id).childNodes.forEach(item =>{
				//         item.expanded=false;
				// 	});
				// }
                this.shrink(this.$refs.tree.getNode(this.areaData[0].id));


			},
            shrink(node){
				if(node.childNodes){
					if(node.level!==1)node.expanded=false;
					node.childNodes.forEach(item =>{
						this.shrink(item);
                    });
                }
            },
            async getTotalInfo(){
				const cc = await getDevCount({});
				this.totalData=cc.totalData;
            },
			async updateError(){
				//////故障初始化
				const errorInfo=await getErrorInfo({});
				let errorTemp=[];
				errorInfo.forEach(item => {
					let a={};
					a.name=item.device_id;
					a.area=item.area_name;
					a.error=item.description;
					a.time=item.create_time;
					errorTemp.push(a);
				});
				this.gridData=errorTemp;
				//故障表更新
				for(var i=0;i<this.pageSize;i++){
					if(this.gridData[i]===null){console.log("break");break;}
					this.currentPageData[i]=this.gridData[i];
				}
			},
            updateData(){
				console.log("DataUpdated");
				this.updateError();
				this.getTotalInfo();
				this.getGPSs();
			},
            test(){
				console.log("sfds");
            },
			setEventListener(Collection,bmap,isStar){
				var self=this;
				// 监听点击事件
				Collection.addEventListener('click', async function (e) {
					//聚焦点(star)坐标导入渲染
                    if(!isStar){
                    	self.starState[0]={lng: e.point.lng,lat:e.point.lat,status:e.point.status,device_id:e.point.device_id};
						self.handleStarRender();
                    }
					//单设备状态跳转URl
					var url = pushUrl + e.point.device_id;
					//获得信息框中心点
					var point = new BMap.Point(e.point.lng, e.point.lat);
					//信息框内容
					let left = '<div style="text-align: right;margin-left:30px;background: #f4f4f4" class="left"><div>设备号: </div><div>状态: </div></div>';
					let right= '<div ><div>' + e.point.device_id + '</div><div>' + e.point.status + '</div></div>';
                    let str  =  left+right;
                    //信息框实例
					var infoWindow = new BMap.InfoWindow(str, self.opts);
					if (e.point.status !== '离线') {
						//获取状态信息
						const device = await getDevSensors({device_id:e.point.device_id});
						const sensors=device.sensors;
						//编辑状态信息
						left = '<div style="text-align: right;margin-left:30px;background: #F4F4F4" class="left"><div>设备号: </div><div>状态: </div>';
						right= '<div ><div>' + e.point.device_id + '</div><div>' + e.point.status + '</div>';
						Object.keys(sensors).forEach(function (key) {
							left += '<div>' + key + ': </div>';
							right += '<div>' + sensors[key] + '</div>';
						});
						left += '</div>';
						right += '</div>';


						str  =  left+right;
						str += '<div class="right"><a href=' + url + ' style="border:1px  double;margin-top="5px"">详细信息</a></div>';
						infoWindow.setHeight(120+30*Object.keys(sensors).length);
						infoWindow.setContent(str);
					}


					bmap.openInfoWindow(infoWindow, point);
				});
            },
            statusConvert(){
				var Ntemp=[];
				var Otemp=[];
				var Etemp=[];
				for(var i in this.info2) {
                    if(this.info2[i].status==="正常"){//后台传‘正常’转换成‘在线’
                        let a={lng: this.info2[i].lng,lat:this.info2[i].lat,device_id:i,status:'在线'};
                        Ntemp.push(a);
                    }else if(this.info2[i].status==="离线"){
						let a={lng: this.info2[i].lng,lat:this.info2[i].lat,device_id:i,status:this.info2[i].status};
						Otemp.push(a);
					}else{
						let a={lng: this.info2[i].lng,lat:this.info2[i].lat,device_id:i,status:this.info2[i].status};
						Etemp.push(a);
					}
				}
                this.normalState=Ntemp;
				this.offlineState=Otemp;
				this.errorState=Etemp;
            },
			async initData(chart){
				////////初始化图表
				//GPS信息转化
				await this.getGPSs();
				this.updateReady=true;

				var self=this;
				this.CCtimer=setInterval(function(){
					if(self.updateReady&&!self.updateCompeleted){
						self.cc++;
						self.dev_per=Number(((self.dev_num/(self.normalState.length+self.offlineState.length+self.errorState.length))*100).toFixed(2));
					    if(self.dev_per>95){
					    	self.showProgress=false;
					    	if(self.showProgress===true){
								self.$message({
									message: '设备加载完成',
									type: 'success'
								});
                            }

					    }
					}else{
						clearInterval(self.CCtimer);
					}
				},450);

                //tooltip
				await chart.setOption({
					title: {
						text: '设备总览',
						subtext: '单击进入状态',
						// sublink: 'http://www.pm25.in',
						left: 'center',
						textStyle: {
							color: '#fff'
						}
					},
					bmap: {
						center: this.center,
						zoom: 15,
						roam: true,
						mapStyle: {
							styleJson: [
								{
									"featureType": "building",
									"elementType": "labels.text.fill",
									"stylers": {
										"visibility": "off"
									}
								},
								{
									"featureType": "manmade",
									"elementType": "all",
									"stylers": {
										"visibility": "off"
									}
								},
								{
									"featureType": "poilabel",
									"elementType": "all",
									"stylers": {
										"visibility": "off"
									}
								},
								{
									"featureType": "road",
									"elementType": "all",
									"stylers": {}
								}
								// 		// {
								// 		// 	"featureType": "water",
								// 		// 	"elementType": "all",
								// 		// 	"stylers": {
								// 		// 		"color": "#044161"
								// 		// 	}
								// 		// },
								// 		// {
								// 		// 	"featureType": "land",
								// 		// 	"elementType": "all",
								// 		// 	"stylers": {
								// 		// 		"color": "#004981"
								// 		// 	}
								// 		// },
								// 		// {
								// 		// 	"featureType": "boundary",
								// 		// 	"elementType": "geometry",
								// 		// 	"stylers": {
								// 		// 		"color": "#064f85"
								// 		// 	}
								// 		// },
								// {
								// 	"featureType": "railway",
								// 	"elementType": "all",
								// 	"stylers": {
								// 		"visibility": "off"
								// 	}
								// },
								// 		// {
								// 		// 	"featureType": "highway",
								// 		// 	"elementType": "geometry",
								// 		// 	"stylers": {
								// 		// 		"color": "#004981"
								// 		// 	}
								// 		// },
								// 		// {
								// 		// 	"featureType": "highway",
								// 		// 	"elementType": "geometry.fill",
								// 		// 	"stylers": {
								// 		// 		"color": "#005b96",
								// 		// 		"lightness": 1
								// 		// 	}
								// 		// },
								// 		// {
								// 		// 	"featureType": "highway",
								// 		// 	"elementType": "labels",
								// 		// 	"stylers": {
								// 		// 		"visibility": "off"
								// 		// 	}
								// 		// },
								// 		// {
								// 		// 	"featureType": "arterial",
								// 		// 	"elementType": "geometry",
								// 		// 	"stylers": {
								// 		// 		"color": "#004981"
								// 		// 	}
								// 		// },
								// 		// {
								// 		// 	"featureType": "arterial",
								// 		// 	"elementType": "geometry.fill",
								// 		// 	"stylers": {
								// 		// 		"color": "#00508b"
								// 		// 	}
								// 		// },
								// 		{
								// 			"featureType": "poi",
								// 			"elementType": "all",
								// 			"stylers": {
								// 				"visibility": "off"
								// 			}
								// 		},
								// 		// {
								// 		// 	"featureType": "green",
								// 		// 	"elementType": "all",
								// 		// 	"stylers": {
								// 		// 		"color": "#056197",
								// 		// 		"visibility": "off"
								// 		// 	}
								// 		// },
								// 		{
								// 			"featureType": "subway",
								// 			"elementType": "all",
								// 			"stylers": {
								// 				"visibility": "off"
								// 			}
								// 		},
								// 		{
								// 			"featureType": "manmade",
								// 			"elementType": "all",
								// 			"stylers": {
								// 				"visibility": "off"
								// 			}
								// 		},
								// 		// {
								// 		// 	"featureType": "local",
								// 		// 	"elementType": "all",
								// 		// 	"stylers": {
								// 		// 		"visibility": "off"
								// 		// 	}
								// 		// },
								// 		// {
								// 		// 	"featureType": "arterial",
								// 		// 	"elementType": "labels",
								// 		// 	"stylers": {
								// 		// 		"visibility": "off"
								// 		// 	}
								// 		// },
								// 		// {
								// 		// 	"featureType": "boundary",
								// 		// 	"elementType": "geometry.fill",
								// 		// 	"stylers": {
								// 		// 		"color": "#029fd4"
								// 		// 	}
								// 		// },
								// 		// {
								// 		// 	"featureType": "building",
								// 		// 	"elementType": "all",
								// 		// 	"stylers": {
								// 		// 		"color": "#1a5787"
								// 		// 	}
								// 		// },
								// 		{
								// 			"featureType": "label",
								// 			"elementType": "all",
								// 			"stylers": {
								// 				"visibility": "off"
								// 			}
								// 		}
							]
						}
					},
					/*tooltip : {
						trigger: 'item',
						triggerOn:'mousemove',
						formatter: function (params, ticket, callback) {
                            let res='<div style="text-align: right" class="left"><div>设备号: </div><div>状态: </div></div>'+'<div class="right"><div>'+params.name+'</div><div>'+params.seriesName+'</div></div>';
							if(params.seriesName==='离线'){
								return res;
                            }
                            if(self.mapFrameId!==params.name) {
								self.mapFrameId=params.name;
								getDevSensors({device_id: params.name}).then(Promise => {
									// console.log(Promise.sensors);
									// console.log('变');
									let left = '<div style="text-align: right" class="left"><div>设备号: </div><div>状态: </div>';
									let right = '<div class="right"><div>' + params.name + '</div><div>' + params.seriesName + '</div>';

									let temp = Promise.sensors;
									Object.keys(temp).forEach(function (key) {
										left += '<div>' + key + ': </div>';
										right += '<div>' + temp[key] + '</div>';
									});

									left += '</div>';
									right += '</div>';
									res = left + right;
									//回调函数更新框内信息
									callback(ticket, res);
									self.mapFramecontent=res;

								});
                            }
                            return self.mapFramecontent;

						}
					},
					series: [
						{//this.offlineState,
							name: '正常',
							type: 'scatter',
							coordinateSystem: 'bmap',
							symbol:normalUrl,
							data: this.normalState,
							symbolSize:20,
							itemStyle: {
								normal: {
									color: '#519be6'
								}
							}
						},
						{
							name: '故障',
							type: 'scatter',
							rippleEffect:{
								period:1,
							},
							coordinateSystem: 'bmap',
							data: this.errorState,
							symbol:errorUrl,
							symbolSize:20,
							itemStyle: {
								normal: {
									color: '#dd0009'
								}
							}
						},
						{
							name: '离线',
							type: 'scatter',
                            data:this.offlineState,
							coordinateSystem: 'bmap',
							symbolSize:15,
							symbol:offlineUrl,
							itemStyle: {
								normal: {
									color: '#373837'
								}
							}
						},
					]*/
				});
				//拿到bmap实例
				var ecModel = this.myChart._model;
				var bmap = null;
				ecModel.eachComponent('bmap', function (bmapModel) {
					if(bmap == null){
						bmap = bmapModel.__bmap;
					}
				});
				//设置不同状态点的样式
				var Noptions = {
					size: BMAP_POINT_SIZE_BIG,
					shape: BMAP_POINT_SHAPE_CIRCLE,
					color: '#519be6'
				};
				var Ooptions = {
					size: BMAP_POINT_SIZE_BIG,
					shape: BMAP_POINT_SHAPE_CIRCLE,
					color: '#636563'
				};
				var Eoptions = {
					size: BMAP_POINT_SIZE_BIG,
					shape: BMAP_POINT_SHAPE_CIRCLE,
					color: '#dd0009'
				};
				var Staroptions = {
					size: BMAP_POINT_SIZE_HUGE,
					shape: BMAP_POINT_SHAPE_STAR,
					color: '#dd0009'
				};

				// 初始化PointCollection实例
                await this.statusConvert();
				this.Npoint = new BMap.PointCollection(this.normalState, Noptions,false);
				this.Opoint = new BMap.PointCollection(this.offlineState, Ooptions,false);
                this.Epoint = new BMap.PointCollection(this.errorState, Eoptions,false);
				this.Starpoint = new BMap.PointCollection(this.starState, Staroptions,true);
                //注册监听事件
				this.setEventListener(this.Npoint,bmap);
				this.setEventListener(this.Opoint,bmap);
				this.setEventListener(this.Epoint,bmap);
				this.setEventListener(this.Starpoint,bmap);
				bmap.addOverlay(this.Npoint);
				bmap.addOverlay(this.Opoint);
				bmap.addOverlay(this.Epoint);
				await bmap.addOverlay(this.Starpoint);
					//建立WS连接
                this.ws();
				//设备列表分区数据
				// this.convertAreaData();
				//数据更新计时器
				// this.timer=setInterval(this.updateData, 5000);
			},
			async initialData(){
				console.log("数据初始化");
				//分区初始化
				this.getAreas();
				//故障框
                this.getError();
				//设备总信息
				this.getTotalInfo();


			},
			handleNodeClick(data,node) {
				if(data.children===undefined){
					this.handleList(node.label);
                }else{
					let temp=[];
					temp[0]=data.id;
					this.defaultTemp=temp;
                    // console.log(this.defaultTemp);
                }
			},
			scroll(){
                this.centreData=this.gridData[this.gridOrder];
                if((this.gridOrder+1)>=this.gridData.length){
					this.gridOrder=0;
                }else{
					this.gridOrder++;
                }


			},
			handleErrorList(val){
			    this.handleList(val.name);
            },
			/////////////////左侧设备框事件
			handleList(key){
				this.findInMap(key);
                this.shouwInList(key);
            },
            shouwInList(key){
                this.current_id=key;
            },
			async findInMap(key){
				//设置中心点
				let ff=this.info2[key];
				this.center=[ff.lng,ff.lat];
                //聚焦点(star)导入渲染
				this.starState[0]={lng: ff.lng,lat:ff.lat,status:ff.status,device_id:key};
				this.handleStarRender();
				//获取bmap实例
				var ecModel = this.myChart._model;
				var bmap = null;
				ecModel.eachComponent('bmap', function (bmapModel) {
					if(bmap == null){
						bmap = bmapModel.__bmap;
					}
				});
				this.myChart.setOption({
					bmap:{
						zoom:17
					}
				});
				///////信息框
                //单设备状态跳转URl
				var url = pushUrl + key;
				//获得信息框中心点
				var point = new BMap.Point(ff.lng, ff.lat);
				//移动到中心点
				bmap.panTo(point);
				//信息框内容
				let left = '<div style="text-align: right;margin-left:30px;background: #f4f4f4" class="left"><div>设备号: </div><div>状态: </div></div>';
				let right= '<div ><div>' + key + '</div><div>' + ff.status + '</div></div>';
				let str  =  left+right;
				//信息框实例
				var infoWindow = new BMap.InfoWindow(str, this.opts);
                if(ff.status !=='离线'){
					//获取状态信息
					const device = await getDevSensors({device_id:key});
					const sensors=device.sensors;
					//编辑状态信息
					left = '<div style="text-align: right;margin-left:30px;background: #F4F4F4" class="left"><div>设备号: </div><div>状态: </div>';
					right= '<div ><div>' + key + '</div><div>' + ff.status + '</div>';
					Object.keys(sensors).forEach(function (key) {
						left += '<div>' + key + ': </div>';
						right += '<div>' + sensors[key] + '</div>';
					});
					left += '</div>';
					right += '</div>';


					str  =  left+right;
					str += '<div class="right"><a href=' + url + ' style="border:1px  double;margin-top="5px"">详细信息</a></div>';
					infoWindow.setHeight(120+30*Object.keys(sensors).length);
					infoWindow.setContent(str);
                }
				bmap.openInfoWindow(infoWindow, point);
            },
            butt(val){
				this.current_id=val.name.toString();
            },
			push() {

				var a = {device_id: this.current_id};
				this.$router.push({path: '/singleStatus', query: a});
			},
            convert(val){//////////数据转换
			var res = [];
				for (var i = 0; i < val.length; i++) {
					var temp=[];
                    temp [0]= val[i].longitude;
					if(temp){
						res.push({
							name: val[i].device_id,
							value: temp.concat(val[i].latitude)
						});
					}
                }
				return res;
            },
            async getListData(devId){
				let ff=this.info.find((ele) => (ele.device_id.toString()===devId));
				if(ff.status==='离线'){
					let temp={'状态':'离线'};
					this.dynamicInfo=temp;
                    return ;
                }
                const sensors=await getDevSensors({device_id:devId});
                const ttemp=sensors.sensors;
                this.dynamicInfo=ttemp;
            },
			handleCurrentChange: function (val) {
				this.currentPage = val;
				this.currentPageData = [];
				for (var i = 0; i < this.pageSize; i++) {
					// if(this.gridData[i]===""){break;}
					this.currentPageData[i] = this.gridData[(val-1) * this.pageSize + i];
				}
			},
            tikTok(ms){
				return new Promise((resolve)=>setTimeout(resolve,ms));
            },

		},
        updated(){

				// console.log(this.updateReady,this.updateCompeleted);
				if(this.updateReady&&!this.updateCompeleted){
                    for(var i=0;i<100;i++){
                    	if(this.info[this.ii]!==undefined){
							if(this.nodePointer[this.info[this.ii].area]){
								this.dev_num++;
								let temp={};
								temp.id=this.info[this.ii].device_id;
								temp.area_name=this.info[this.ii].device_id;
								this.nodePointer[this.info[this.ii].area].children.push(temp);
								this.ii++;
								if(this.ii===this.info.length){
									this.updateCompeleted=true;
								}
								// console.log("haohaohao")
							}
                        }
                    }
				}



        },
		watch: {
			errorsCom(newval){//右上角框变化
				var temp=[];
			    	this.errorsCom.forEach(item =>{
			    		temp.push(item.error);
                    });
			    	this.gridData=temp;
            },
			'errors':{
				handler:async function(val){
					// this.errorsCom=[];
					for(let i=0;i<this.errors.length;i++){
						this.errorsCom.push(this.errors[i]);
						await this.tikTok(200);
					}
                },
				immediate: true,
            },
			defaultTemp(newval,oldval) {
                // console.log(newval[0],oldval[0]);
                if(newval[0]===oldval[0]){
					let temp=[];
                	if(this.defaultOpenKey[0]===0){
						temp[0]=newval[0];
                    }else{
						temp[0]=0;
                    }
					this.defaultOpenKey=temp;
                }else{
					let temp=[];
					temp[0]=newval[0];
					this.defaultOpenKey=temp;
					// console.log(this.defaultOpenKey);
                }
			},
			////////////动画组
            centreData:function(newValue){
				if(newValue==null){
					return;
                }
			    this.show=!this.show;
			    if(this.show){
			    	this.data1=newValue;
                }else{
					this.data2=newValue;
                }
            },
			totalData: function(newValue) {
				TweenLite.to(this.$data, 12, {
					tweenedTotalData: newValue});
			},
            //////////////////
            current_id:function(newval,oldval){

				if(oldval===""){
				    this.seen=true;
				}
				if(oldval!==newval){
					this.getListData(newval);
                }
            },
			$route:function(val,oldval){//切换页面//////////////????????????????????????????未完成
				const currentPath=val.path.replace('/', '');
				const oldPath =oldval.path.replace('/', '');
				console.log("new: ",currentPath," old ",oldPath);
				if(currentPath !== "HomeMap" && oldPath === "HomeMap") {

					clearInterval(this.errorFrameTimer);
					clearInterval(this.timer);
					console.log("Home AllTimer destroyed");

				}
				if(currentPath === "HomeMap" && oldPath !== "HomeMap")
				{
					this.errorFrameTimer=setInterval(this.scroll,3100);
					console.log("back to home");
				}
			},
            info2:function(newval,oldval){
			    	console.log('change');
            },
		},
		computed: {
			//故障框
			scrollDisabled:function(){
                return true;
            },
			//状态
            info2:function(){
			    let a={};
			    this.info.forEach(item => {
			    	a[item.device_id]={lng:item.longitude,lat:item.latitude,status:item.status};
                });
                return a;
            },
			////////////动画组
			animatedTotalData: function() {
				return this.tweenedTotalData.toFixed(0);
			},
            ////////////////////////

			defaultActive: function(){
				return this.current_id+"";
			},

			badgeValue:function(){
				if(this.gridData.length){
				return this.gridData.length;
				}
				if(this.gridData.length==="null"){
					return 0;
                }
            },
			badgeSeen:function () {
                if(this.gridData.length>0){
					return false;
                }else{
					return true;
                }
			},
            errorFramePageCount:function(){
				return this.gridData.length;
            }


		},
		beforeDestroy() {
			clearInterval(this.errorFrameTimer);
			clearInterval(this.timer);
			console.log("finally destroyed");
		}


	}
</script>

<style scoped>
    .box-card3{
        overflow:auto;
        min-height: 710px;
        /*  height: 100%;*/
        weight: 100%;
        padding: 0;
    }
    .cardLine {
        display: inline-block;
        border-radius: 10px;
        width: 100%;
        height: 80px;
        background-color: #e2e6ff;
        transition: all 1s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)

    }
    .cardLine:hover{
        height: 220px;
    }
    .cardGray{
        transition: all 1s ;
        /*background: linear-gradient(to right, #f54a49, #f99a9e);*/
        background:indianred;
        animation:myfirst 2s ease infinite;//cubic-bezier(0.1,0.25,1,0.25)
        animation-direction:normal;
    }
    @keyframes myfirst
    {

        /*0%  {background: #ff030b;}*/
        /*100% {background: #ff8b93;}*/
        0%  {background: #ff8b93;}
        50% {background: #ed030a;}
        100%{background: #ff8b93;}

        /*0%   {background:linear-gradient(to right, #f54a49, #f99a9e)}*/
        /*25%  {background:linear-gradient(to right, #f53b39, #f98689)}*/
        /*50%  {background:linear-gradient(to right, #f51e19, #f97070)}*/
        /*75%  {background:linear-gradient(to right, #e41c18, #f95454)}*/
        /*100% {background:linear-gradient(to right, #da1b17, #f93a39)}*/
    }
    .cardGray:hover{
        /*background: linear-gradient(to right, #6ba5ff, #b3ccff);*/
    }
    .cardLineRed{
        transition: all 1s ;
        background: linear-gradient(to right, #f54a49, #f99a9e);
    }
    .cardLineRed:hover{
        background: linear-gradient(to right, #ee2124, #f98486);
    }
    .cardLineGreen{
        transition: all 1s;
        background: linear-gradient(to right, #6ba5ff, #b3ccff);
    }
    .cardLineGreen:hover{
        background: linear-gradient(to right, #0c8dc2, #89b8d7);
    }

    .cardLine .el-divider--horizontal{
        margin-top: 0;
        margin-bottom: 10px;
    }
    /*.animated-line-move{*/
    /*    transition: transform 1s;*/
    /*}*/
    /*.animated-line-cardLine{*/
    /*    transition: all 5s;*/
    /*}*/
    .animated-line-enter-active {
        transition: all 0.6s ;
    }
    .animated-line-leave-active{
        transition: all 0.4s ;
        /*transition-delay: 2s ;*/
    }
    .animated-line-enter{
        transform: translateX(-80px);
        opacity: 0;
    }
    .animated-line-leave-to{
        transform: translateX(80px);
        opacity: 0;
    }
    .pp{
        position: absolute;
        width: 230px;
    }
    .fade{
        margin-top: 10px;
        margin-left: 20px;
        width: 230px;
        font-size: 20px;
        vertical-align: middle;
        white-space:normal;

    }
    .fade-enter-active {
        transition: all 1.5s ;
    }
    .fade-leave-active {
        transition: all 1.5s ;
    }
    .fade-enter
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateY(80px);
        opacity: 0;
    }
    .fade-leave-to{
        transform: translateY(-80px);
        opacity: 0;
    }
    .anim{
        transition: all 2s;
        margin-top: -95px;
    }
    #con1 li{
        margin-top: 15px;
        list-style: none;
        line-height: 20px;
        height: 80px;

    }
    .el-container{
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04),5px -4px 6px rgba(0, 0, 0, .1);
        /*height: 770px;*/
        height: 750px;
    }
    .el-col {
        border-radius: 4px;
    }
    .el-header {
        background-color: #ffffff;
        color: #333;
        text-align: center;
        vertical-align: middle;
        line-height: 30px;
        /*margin-bottom: 2px;*/
        text-align:left;
        border-bottom: 1px solid #e3e4e6;

    }
    .el-main {
        width: 100%;
        height: 100%;
        padding: 0;
        background-color:#ffffff;
        color: #333;
        /*text-align: center;*/
        line-height: 30px;
    }
    .el-icon-s-platform{
        font-size: 51px;
        color: #78c5ff;
    }
    .el-icon-message-solid{
        font-size: 51px;
        color: #ff9a7a;
    }
    .box-card1{
        background-color: #1e9fff;
        /*background: linear-gradient(to right,#1e9fff, #d0aeff);*/
        color: #ffffff;
        border-radius: 8px;
        height: 100px;
        text-align:left;

        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
    .box-card2{
        background-color: #ff5722;
        color: #ffffff;
        border-radius: 8px;
        height: 100px;
        text-align:left;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
    .box-button{
        /*background-color: #ff5722;*/
        background: linear-gradient(to right,#ff5722, #ff9357);
        color: #ffffff;
        border-radius: 8px;
        height: 100px;
        width: 100%;
        text-align:left;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
    .aa{
        font-size: 18px;
        vertical-align: top;
    }
    .bb{
        font-size: 22px;
        vertical-align: top;
    }
    .cc{

        font-size: 20px;
        vertical-align: middle;
        overflow: hidden;
        white-space:normal;
    }
    .back{
        /*background-color: #edeef0;*/
    }

    .default-scrollbar {
        width: 100%;
        height: 716px;
        overflow-x: hidden;
        /*background-color: #4db3ff;*/
    }
    .el-scrollbar__wrap.default-scrollbar__wrap {
        overflow-x: auto;
    }
    .el-scrollbar__view.p20-scrollbar__view {
        padding: 20px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        -o-box-sizing: border-box;
        -ms-box-sizing: border-box;
    }
</style>
<!--<style lang="less">-->
<!--    @import '../style/mixin';-->
<!--    .map1{-->
<!--        display: flex;-->
<!--        justify-content: center;-->
<!--    }-->
<!--</style>-->
