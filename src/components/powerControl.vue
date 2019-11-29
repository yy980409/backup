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
                                     <p style="font-weight: bold;font-size: 20px">重合闸设备</p>
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
                            <p >重合闸状态</p>
                        </span>
                            <span style="display: flex;margin-top: 15px;">
                                <el-col :span="6" :offset="3">
                                    <p style="">该分区设备数 :</p>
                                </el-col>
                                <el-col :span="6" >
                                    <p style="">{{devList.length}}</p>
                                </el-col>



                        </span>

                        </div>
                        <el-scrollbar class="default-scrollbar2" wrap-class="default-scrollbar__wrap" view-class="default-scrollbar__view" :native="false" :onresize="true">

                            <el-row style="margin-top: 15px">
                                <el-col :span="6" :offset="4">
                                    <el-checkbox-group v-model="checkedList"  >
                                        <el-checkbox v-for="i in devList"
                                                     :label="i.device_id"
                                                     :key="i.device_id">
                                            <span >{{i.device_id}}</span>


                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-col>
                                <el-col :span="6" :offset="8">
                                    <p v-for="i in devList"
                                       :key="i.device_id"
                                       style="font-size: 14px"
                                       :class="{open:i.status==='合',close:i.status==='分'}">
                                        {{i.status}}
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
                    <div class="ctrlTitle" >重合闸开关</div>
                    <div >
                        <el-switch
                            style="margin-top: 60px"
                            v-model="powerSwitch"
                            active-text="合闸"
                            inactive-text="分闸"
                            @change="handlePowerSwitch"
                        >
                        </el-switch><br>
                        <el-button @click="rebootPower"style="margin-top: 50px">
                            重启
                        </el-button>

                    </div>
                </div>




                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script

>
    import {getAllTree,getOneTree,getProtectorStatus,powerOff,powerOn,reStartPower} from '@/api/getData';
	export default {
		name: "powerControl",
		data(){
			return{
				powerSwitch:false,
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
                //更新数据后刷新表
                refreshData:null,
                refreshNode:null,
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
					this.refreshData=val;
					this.refreshNode=node;
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
			async handlePowerSwitch(val){
				console.log(val);
				if(val===true){//关=>开
					for(var i=0;i<this.checkedList.length;i++){
						await powerOn({device_id:this.checkedList[i]});
                    }
				}else{
					for(var i=0;i<this.checkedList.length;i++){
						await powerOff({device_id:this.checkedList[i]});
					}
				}
				// if(this.refreshData!==null){//更新后刷新
				// 	const protector=await getProtectorStatus();
				// 	this.deviceStatus=[];
				// 	protector.forEach(item =>{
				// 		const temp={};
				// 		temp.device_id=item.device_id;
				// 		temp.area=item.area_id;
				// 		temp.status=item.sta_H;
				// 		this.deviceStatus.push(temp);
				// 	});
				// 	this.handleNodeClick(this.refreshData,this.refreshNode);
				// }
            },
			async rebootPower(){
				for(var i=0;i<this.checkedList.length;i++){
					await reStartPower({device_id:this.checkedList[i]});
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
				const protector=await getProtectorStatus();
				protector.forEach(item =>{
					const temp={};
					temp.device_id=item.device_id;
					temp.area=item.area_id;
					temp.status=item.sta_H;
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
                console.log(protector);
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
        height: 250px;
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
