<template>
    <div>
        <el-row style="padding-top: 0">
            <el-col  :span="7">
                <el-card class="box-card"
                         v-loading="loading"
                         element-loading-text="分区加载中">
                    <div slot="header">
                        <span></span><!--{{checkedList}}-->
                        <span class="custom-tree-node">
                                     <p style="font-weight: bold;font-size: 20px">风扇设备</p>
                                     <p>设备总数: {{deviceStatus.length}}</p>
                            <!--                                     <p>筛选后: {{leaf}}</p>-->
                                     <p style="color: #ff213f">已选择: {{checkedList.length}}</p>
                                 </span>
                        <el-input
                            style="margin-top: 20px"
                            placeholder="输入关键字进行过滤"
                            v-model="filterText">
                        </el-input>
                    </div>
                    <el-scrollbar class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="default-scrollbar__view" :native="false" :onresize="true">

                        <el-tree
                            v-show="!loading"
                            :data="devices"
                            :props="defaultProps"
                            show-checkbox
                            node-key="id"
                            @check-change="handleCheck"
                            @node-click="handleNodeClick"
                            :filter-node-method="filterNode"
                            default-expand-all
                            ref="tree">
                            <!--                    <span class="custom-tree-node" slot-scope="{ node, data }">-->
                            <!--                            <span>{{ node.label }}</span>-->
                            <!--                            <span v-if="node.level===1">-->
                            <!--                            <p style="font-weight: bold">重合闸状态</p>-->
                            <!--                            </span>-->
                            <!--                            <span v-if="node.isLeaf===true">-->
                            <!--                                <p :class="{open:data.switch==='开',close:data.switch==='关'}">{{data.switch}}</p>-->
                            <!--                            </span>-->
                            <!--                     </span>-->
                        </el-tree>


                    </el-scrollbar>
                </el-card>




            </el-col>
            <el-col :offset="0" :span="2" >
                <div  style="display: flex;justify-content:center" >
                    <i class="el-icon-d-arrow-right" :class="{arrowRight:0===0}"></i>
                </div>
            </el-col>
            <el-col :span="8" :offset="0">
                <div v-loading="devloading"
                     element-loading-text="设备加载中">
                    <el-card v-loading="beforedevloading"
                             element-loading-text='请点击最下层分区'
                             class="box-card-low"
                             element-loading-spinner="el-icon-s-home">
                        <div slot="header">
                        <span style="display: flex;justify-content: space-around">
                            <p style="font-weight: bold">{{curArea}} 设备号</p>
                            <p >开关</p>
                            <p >自动控制开关</p>
                            <p >风扇转速</p>
                        </span>
                            <span style="display: flex;margin-top: 15px;">
                                <el-col :span="6" :offset="1">
                                    <p style="">该分区设备数 :</p>
                                </el-col>
                                <el-col :span="6" >
                                    <p style="">{{devList.length}}</p>
                                </el-col>



                        </span>

                        </div>
                        <el-scrollbar class="default-scrollbar2" wrap-class="default-scrollbar__wrap" view-class="default-scrollbar__view" :native="false" :onresize="true">

                            <el-row style="margin-top: 15px">
                                <el-col :span="3" :offset="2">
                                    <el-checkbox-group v-model="checkedList"  >
                                        <el-checkbox v-for="i in devList"
                                                     :label="i.device_id"
                                                     :key="i.device_id">
                                            <span >{{i.device_id}}</span>


                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-col>
                                <el-col :span="2" :offset="4">
                                    <span v-for="i in devList"
                                       :key="i.device_id"
                                       style="font-size: 14px">
                                        <p v-if="i.fan_state===1" class="open">开</p>
                                        <p v-if="i.fan_state===0" class="close">关</p>
                                    </span>
                                </el-col>
                                <el-col :span="2" :offset="4">
                                    <span v-for="i in devList"
                                       :key="i.device_id"
                                       style="font-size: 14px">
                                    <p v-if="i.auto_flag===1" class="open">开</p>
                                    <p v-if="i.auto_flag===0" class="close">关</p>
                                    </span>
                                </el-col>
                                <el-col :span="2" :offset="4">
                                    <p v-for="i in devList"
                                       :key="i.device_id"
                                       style="font-size: 14px">
                                        {{i.fan_speed}}
                                    </p>
                                </el-col>
                            </el-row>
                        </el-scrollbar>
                    </el-card></div>

            </el-col>
            <el-col :offset="0" :span="2" >
                <div  style="display: flex;justify-content:center" >
                    <i class="el-icon-d-arrow-right" :class="{arrowRight:!beforedevloading}"></i>
                </div>
            </el-col>
            <el-col :offset="0" :span="4">
                <el-card
                    class="box-card2"
                    v-loading="checkedList.length===0"
                    element-loading-text="请选择设备"
                    element-loading-spinner="el-icon-setting"
                >
                    <div   style="text-align: center;font-size: 20px;">
                        <span class="ctrlTitle" >风扇控制</span><br>
                        <el-switch
                            v-model="autoOpen"
                            active-text="手动控制"
                            inactive-text="自动控制"
                            inactive-color="#409EFF"
                            @change="handleFanAuto">
                        </el-switch><br>
                        <el-switch
                            style="margin-top: 40px"
                            v-if="autoOpen"
                            v-model="sliderOpen"
                            active-text="开"
                            inactive-text="关"
                            @change="handleFanSwitch">
                        </el-switch>
                        <el-slider
                            style="margin-top: 40px"
                            v-if="andOpen"
                            class="FanDefalut"
                            v-model="fanSpeed"
                            @change="handleFanSpeed" ></el-slider>
                    </div>




                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script

>
	import {getAllTree,getOneTree,getFanStatus,fanOpen,fanClose,fanAutoOn,fanAutoOff,fanSpeed} from '@/api/getData';
	export default {
		name: "fanControl",
		data(){
			return{
				autoOpen:true,//初始值，后续值不由他控制
				sliderOpen:true,//初始值，后续值不由他控制
				fanSpeed:20,
				filterText:'',
				info:[],//权限树
				checkedList:[],
				devList:[],
				defaultProps: {
					children: 'children',
					label: 'area_name',
					id:'id',
				},

				devices:[
					{
						id: '全选',
						area_name:'全选',
						children:[],
						isparent:true,
					},
				],

				leaf:0,//筛选后的数目
				deviceStatus:[],
				curArea:' ',
				initFlag:false,
				//loading
				loading:true,
				beforedevloading:true,
				devloading:false,
			}
		},
		methods:{
			test(aa,num){
				if(num===1){//node
					console.log(this.$refs.tree.getNode(aa.key));
				}else if(num===2){//data
					console.log(this.$refs.tree.getNode(aa.id).key);
				}

			},
			async handleNodeClick(val,node){//分区框最低级分区按钮事件
				if(node.isLeaf){
					//boxcard-low数据
					this.curArea=val.area_name;
					this.beforedevloading=false;
					this.devloading=true;
					await this.tikTok(500);
					//导入设备
					if(this.centerData[val.id]){//若分区有设备
						this.devList=this.centerData[val.id];
					}else{
						this.devList=[];
					}
					this.devloading=false;
				}





			},
			handleCheck(data,checked){//分区框全选事件
				if(!data.isparent){
					if(checked){//全选添加
						if(this.centerDataPure[data.id]){//分区中存在设备
							this.checkedList=this.checkedList.concat(this.centerDataPure[data.id]);
						}

					}else{//全选删除
						if(this.centerDataPure[data.id]){ //若分区有设备
							let i=0;
							while(i<this.checkedList.length){
								if(this.centerDataPure[data.id].indexOf(this.checkedList[i])!==-1){//检索并删除
									this.checkedList.splice(i,1);
								}else{
									i++;
								}
							}
						}
					}
				}

			},
            async handleFanSwitch(val){
				if(val===true){//关=>开
					for(var i=0;i<this.checkedList.length;i++){
						await fanOpen({device_id:this.checkedList[i]});
					}
				}else{
					for(var i=0;i<this.checkedList.length;i++){
						await fanClose({device_id:this.checkedList[i]});
					}
				}
            },
            async handleFanAuto(val){
				if(val===true){//关=>开,
					for(var i=0;i<this.checkedList.length;i++){
						await fanAutoOn({device_id:this.checkedList[i]});
					}
				}else{
					for(var i=0;i<this.checkedList.length;i++){
						await fanAutoOff({device_id:this.checkedList[i]});
					}
				}
            },
            async handleFanSpeed(){
				for(var i=0;i<this.checkedList.length;i++){
					await fanSpeed({device_id:this.checkedList[i],fan_speed:this.fanSpeed});
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

				}else{//判断结点以及筛选
					if (!value) {//输入为空
						if(this.info.indexOf(node.key)!==-1){
							console.log(node);
							// if(node.isLeaf)this.leaf++;
							return true;
						}
					}else{
						if(node.visible!==undefined ){
							for(const i of data.keyword)
								if(i.indexOf(value) !== -1){
									// if(node.isLeaf)this.leaf++;
									return true;
								}

						}
					}
				}



			},
			async getStatus(){
				//设备状态
				const fan=await getFanStatus();
				console.log(fan);
				fan.forEach(item =>{
					const temp={};
					temp.device_id=item.device_id;
					temp.area=item.area_id;
					temp.auto_flag=item.auto_flag;
					temp.fan_state=item.fan_state;
					temp.fan_speed=item.fan_speed;
					this.deviceStatus.push(temp);
				});
				//完整分区树
				const Tree=await getAllTree();
				this.devices[0].children=Tree;
				//权限树
				const One=await getOneTree();
				this.info=One;

				console.log(Tree);
				console.log(One);
			},
			async init(){

				await this.getStatus();
				await this.$refs.tree.filter();//往分区树导入设备数据


				this.initFlag=true;
				this.$refs.tree.filter();//筛选权限树



				this.loading=false;

				console.log(this.$refs.tree.getNode(0));
			},
			tikTok(ms){
				return new Promise((resolve)=>setTimeout(resolve,ms));
			},

		},
		mounted(){
			this.init();


			// console.log(this.$refs.tree.getNode(0));
		},
		watch: {
			filterText(val) {
				// console.log(this.tree)
				this.leaf=0;
				this.$refs.tree.filter(val);
			}
		},
		computed:{
			andOpen:function(){
			    if(this.autoOpen&&this.sliderOpen){
			    	return true;
                }else{
			    	return false;
                }
            },
			centerData(){//将deviceStatus转换为以区域为key的对象数组----用于显示设备框
				let temp={};
				this.deviceStatus.forEach(item =>{
					if(temp[item.area]===undefined){
						temp[item.area]=[];
						temp[item.area].push(item);
					}else{
						temp[item.area].push(item);
					}
				});
				return temp;
			},
			centerDataPure(){//centerData的纯净版 只有设备号-----用于分区框的全选
				let temp={};
				this.deviceStatus.forEach(item =>{
					if(temp[item.area]===undefined){
						temp[item.area]=[];
						temp[item.area].push(item.device_id);
					}else{
						temp[item.area].push(item.device_id);
					}
				});
				return temp;
			}
		}
	}
</script>

<style scoped>

    .ctrlTitle{
        display: flex;
        justify-content:center;
        font-weight: bold;
    }
    .box-card{
        width: 100%;
        height: 720px;
        overflow:scroll;
    }
    .box-card2{
        width: 100%;
        height: 280px;
        overflow:scroll;
        margin-top: 200px;
    }
    .box-card-low{
        width: 100%;
        height: 720px;
    }
    .item {
        margin-bottom: 18px;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    p.open{
        color: #00c000;
    }
    p.close{
        color:red;
    }
    .el-icon-d-arrow-right{
        font-size: 50px;
        padding-top: 300px;
        color: #ffffff;
        transition: all 0.5s;
    }
    .arrowRight{
        color: #4db3ff;
    }
    .el-container{
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04),5px -4px 6px rgba(0, 0, 0, .1);
        /*height: 680px;*/
    }
    .el-header{
        margin-top: 20px;
        border-bottom: 1px solid #e3e4e6;
    }
    .default-scrollbar {
        width: 100%;
        height: 530px;
        overflow-x: hidden;


    }
    .default-scrollbar2 {
        width: 100%;
        height: 600px;
        overflow-x: hidden;
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


<!--<template>-->
<!--    <div>-->
<!--        <el-row style="padding-top: 0">-->
<!--            <el-col :offset="2" :span="8">-->
<!--                <el-card class="box-card">-->
<!--                    <div slot="header">-->
<!--                        <span></span>&lt;!&ndash;{{checkedList}}&ndash;&gt;-->
<!--                        <span class="custom-tree-node">-->
<!--                        <p style="font-weight: bold;font-size: 20px">风扇设备</p>-->
<!--                        <p>设备总数: {{totalDev}}</p>-->
<!--                        <p>筛选后: {{leaf}}</p>-->
<!--                        <p style="color: #ff213f">已选择: {{checkedList.length}}</p></span>-->
<!--                    </div>-->
<!--                    <el-input-->
<!--                        placeholder="输入关键字进行过滤"-->
<!--                        v-model="filterText">-->
<!--                    </el-input>-->
<!--                    <el-tree-->
<!--                        :data="devices"-->
<!--                        show-checkbox-->
<!--                        node-key="id"-->
<!--                        default-expand-all-->
<!--                        @check="handleCheck"-->
<!--                        :filter-node-method="filterNode"-->
<!--                        ref="tree">-->
<!--                    <span class="custom-tree-node" slot-scope="{ node, data }">-->
<!--                         <span>{{ node.label }}</span>-->
<!--                        <div v-if="node.level===1" >-->
<!--                            <span style="font-weight: bold">自动控制</span>-->
<!--                            <span style="font-weight: bold">风扇开关</span>-->
<!--                            <span style="font-weight: bold">转速</span>-->
<!--                        </div>-->
<!--                         <div v-if="node.isLeaf===true" >-->
<!--                             <span style="margin-right: 35px" :class="{open:data.fan.auto==='开',close:data.fan.auto==='关'}">-->
<!--                                 {{data.fan.auto}}</span>-->
<!--                             <span style="margin-right: 35px" :class="{open:data.fan.switch==='开',close:data.fan.switch==='关'}">-->
<!--                                 {{data.fan.switch}}</span>-->
<!--                             <span>{{data.fan.speed}}</span>-->



<!--                        </div>-->
<!--                     </span>-->

<!--                    </el-tree>-->
<!--                </el-card>-->

<!--            </el-col>-->
<!--            <el-col :offset="0" :span="3" >-->
<!--                <div  style="display: flex;justify-content:center" >-->
<!--                    <i class="el-icon-d-arrow-right" :class="{arrowRight:checkedList.length!==0}"></i>-->
<!--                </div>-->
<!--            </el-col>-->
<!--            <el-col :offset="0" :span="8">-->
<!--                <el-card-->
<!--                    class="box-card2"-->
<!--                    v-loading="checkedList.length===0"-->
<!--                    element-loading-text="请选择设备"-->
<!--                    element-loading-spinner="el-icon-setting"-->
<!--                >-->
<!--                    <div   style="text-align: center;font-size: 20px;">-->
<!--                        <span class="ctrlTitle" >风扇控制</span><br>-->
<!--                        <el-switch-->
<!--                            v-model="autoOpen"-->
<!--                            active-text="手动控制"-->
<!--                            inactive-text="自动控制"-->
<!--                            inactive-color="#409EFF"-->
<!--                            @change="handleFanAuto"-->

<!--                        >-->
<!--                        </el-switch><br>-->
<!--                        <el-switch-->
<!--                            style="margin-top: 40px"-->
<!--                            v-if="autoOpen"-->
<!--                            v-model="sliderOpen"-->
<!--                            active-text="开"-->
<!--                            inactive-text="关"-->
<!--                            @change="handleFanSwitch"-->

<!--                        >-->
<!--                        </el-switch>-->
<!--                        <el-slider-->
<!--                            style="margin-top: 40px"-->
<!--                            v-if="andOpen"-->
<!--                            class="FanDefalut"-->
<!--                            v-model="fanSpeed"-->
<!--                            @change="handleFanSpeed" ></el-slider>-->
<!--                    </div>-->




<!--                </el-card>-->
<!--            </el-col>-->
<!--        </el-row>-->

<!--    </div>-->
<!--</template>-->

<!--<script>-->
<!--	export default {-->
<!--		name: "fanControl",-->
<!--		data(){-->
<!--			return{-->
<!--				autoOpen:true,//初始值，后续值不由他控制-->
<!--				sliderOpen:true,//初始值，后续值不由他控制-->
<!--				fanSpeed:56,-->
<!--				filterText:'',-->
<!--				info:[36,37,38,39],-->
<!--				checkedList:[],-->
<!--				devices:[-->
<!--					{-->
<!--						id: 0,-->
<!--						label:'全选',-->
<!--						children:[{-->
<!--							id: 1,-->
<!--							label: '南山区',-->
<!--							children: [{-->
<!--								id: 34,-->
<!--								label: '粤海社区',-->
<!--								children: [{-->
<!--									id: 35,-->
<!--									label: '深圳大学',-->
<!--									children:[-->
<!--										{-->
<!--											id: 37,-->
<!--											label: '羽毛球场',-->
<!--											children:[-->
<!--												{-->
<!--													id: 105,-->
<!--													label: '二级 2-1',-->
<!--													fan:{-->
<!--														switch:'关',-->
<!--														auto:'开',-->
<!--														speed:'30'-->
<!--													}-->
<!--												}, {-->
<!--													id: 108,-->
<!--													label: '二级 2-1',-->
<!--													fan:{-->
<!--														switch:'开',-->
<!--														auto:'开',-->
<!--														speed:'30'-->
<!--													}-->
<!--												}-->
<!--											]-->
<!--										},-->
<!--										{-->
<!--											id: 38,-->
<!--											label: '师院A座',-->
<!--											children:[-->
<!--												{-->
<!--													id: 106,-->
<!--													label: '二级 2-1',-->
<!--													fan:{-->
<!--														switch:'关',-->
<!--														auto:'开',-->
<!--														speed:'30'-->
<!--													}-->
<!--												}-->
<!--											]-->
<!--										},-->
<!--										{-->
<!--											id: 39,-->
<!--											label: '图书馆',-->
<!--											children:[-->
<!--												{-->
<!--													id: 107,-->
<!--													label: '二级 2-1',-->
<!--													fan:{-->
<!--														switch:'开',-->
<!--														auto:'关',-->
<!--														speed:'80'-->
<!--													}-->
<!--												}-->
<!--											]-->
<!--										}-->
<!--									],-->
<!--								}]-->
<!--							}]-->
<!--						}, {-->
<!--							id: 2,-->
<!--							label: '福田区',-->
<!--							children: [{-->
<!--								id: 104,-->
<!--								label: '二级 2-1',-->
<!--								fan:{-->
<!--									switch:'开',-->
<!--									auto:'开',-->
<!--									speed:'30'-->
<!--								}-->
<!--							}, {-->
<!--								id: 103,-->
<!--								label: '二级 2-2',-->
<!--								fan:{-->
<!--									switch:'开',-->
<!--									auto:'开',-->
<!--									speed:'30'-->
<!--								}-->
<!--							}]-->
<!--						}, {-->
<!--							id: 3,-->
<!--							label: '宝安区',-->
<!--							children: [{-->
<!--								id: 102,-->
<!--								label: '二级 3-1',-->
<!--								fan:{-->
<!--									switch:'开',-->
<!--									auto:'开',-->
<!--									speed:'30'-->
<!--								}-->
<!--							}, {-->
<!--								id: 101,-->
<!--								label: '二级 3-2',-->
<!--								fan:{-->
<!--									switch:'开',-->
<!--									auto:'开',-->
<!--									speed:'30'-->
<!--								}-->
<!--							}]-->
<!--						},{-->
<!--							id: 4,-->
<!--							label: '罗湖区',-->
<!--							children: [{-->
<!--								id: 36,-->
<!--								label: '罗湖小学',-->
<!--								children: [{-->
<!--									id: 100,-->
<!--									label: '二级 3-2',-->
<!--									fan:{-->
<!--										switch:'开',-->
<!--                                        auto:'开',-->
<!--                                        speed:'30'-->
<!--                                    }-->
<!--								}]-->
<!--							}]-->
<!--						},-->

<!--						]-->
<!--					},],-->
<!--				leaf:0,//筛选后的数目-->
<!--				totalDev:0,//设备总数-->
<!--			}-->
<!--		},-->
<!--		methods:{-->
<!--			test(aa,num){-->
<!--				if(num===1){//node-->
<!--					console.log(this.$refs.tree.getNode(aa.key));-->
<!--				}else if(num===2){//data-->
<!--					console.log(this.$refs.tree.getNode(aa.id).key);-->
<!--				}-->

<!--			},-->
<!--			handleCheck(){-->
<!--				this.checkedList = [];-->
<!--				let temp = this.$refs.tree.getCheckedNodes(true);-->
<!--				for( const i of temp){-->
<!--					if(this.info.indexOf(this.$refs.tree.getNode(i.id).parent.key)!==-1)-->
<!--						this.checkedList.push(i.label);-->
<!--				}-->

<!--			},-->
<!--			handleFanSwitch(val){-->
<!--				console.log(val);-->
<!--			},-->
<!--			handleFanAuto(){-->
<!--				console.log('weikaifa');-->
<!--			},-->
<!--			handleFanSpeed(){-->
<!--				console.log('weikaifa');-->
<!--            },-->
<!--			filterNode(value, data) {-->

<!--				// if(this.$refs.tree.getNode(data.id).isLeaf&&this.$refs.tree.getNode(data.id).visible)this.leaf++;-->
<!--				if (!value) {//输入为空-->
<!--					if(this.info.indexOf(this.$refs.tree.getNode(data.id).parent.key)!==-1){-->
<!--						// this.$refs.tree.getNode(data.id).visible=false;-->
<!--						if(this.$refs.tree.getNode(data.id).isLeaf)this.leaf++;-->
<!--						return true;-->
<!--					}-->
<!--				}else{-->
<!--					if(this.info.indexOf(this.$refs.tree.getNode(data.id).parent.key)!==-1 && data.label.indexOf(value) !== -1){-->
<!--						if(this.$refs.tree.getNode(data.id).isLeaf)this.leaf++;-->
<!--						return true;-->
<!--					}-->

<!--				}-->
<!--				// if (!value) return this.info.indexOf(data.id)!==-1;-->
<!--				// this.leaf++;-->
<!--				// return this.info.indexOf(data.id) !== -1 && data.label.indexOf(value) !== -1;-->
<!--			}-->
<!--		},-->
<!--		mounted(){-->
<!--			this.$refs.tree.filter();-->
<!--			this.totalDev=this.leaf;-->
<!--		},-->
<!--		watch: {-->
<!--			filterText(val) {-->
<!--				// console.log(this.tree)-->
<!--				this.leaf=0;-->
<!--				this.$refs.tree.filter(val);-->
<!--			}-->
<!--		},-->
<!--        computed:{-->
<!--			andOpen:function(){-->
<!--				if(this.autoOpen&&this.sliderOpen){-->
<!--					return true-->
<!--				}else{-->
<!--					return false-->
<!--				}-->
<!--			}-->
<!--        }-->
<!--	}-->
<!--</script>-->

<!--<style scoped>-->

<!--    .ctrlTitle{-->
<!--        display: flex;-->
<!--        justify-content:center;-->
<!--        font-weight: bold;-->
<!--    }-->
<!--    .box-card{-->
<!--        width: 100%;-->
<!--        height: 680px;-->
<!--        overflow:scroll;-->
<!--    }-->
<!--    .box-card2{-->
<!--        width: 100%;-->
<!--        height: 300px;-->
<!--        overflow:scroll;-->
<!--        margin-top: 150px;-->
<!--    }-->
<!--    .item {-->
<!--        margin-bottom: 18px;-->
<!--    }-->
<!--    .custom-tree-node {-->
<!--        flex: 1;-->
<!--        display: flex;-->
<!--        align-items: center;-->
<!--        justify-content: space-between;-->
<!--        font-size: 14px;-->
<!--        padding-right: 8px;-->
<!--    }-->
<!--    span.open{-->
<!--        color: #00c000;-->
<!--    }-->
<!--    span.close{-->
<!--        color:red;-->
<!--    }-->
<!--    .el-icon-d-arrow-right{-->
<!--        font-size: 50px;-->
<!--        padding-top: 300px;-->
<!--        color: #ffffff;-->
<!--        transition: all 0.5s;-->
<!--    }-->
<!--    .arrowRight{-->
<!--        color: #4db3ff;-->
<!--    }-->
<!--</style>-->
