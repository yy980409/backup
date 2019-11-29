<template>
    <div id="app" class="fillcontain">
<!--        <HelloWorld></HelloWorld>-->
		    <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>

<script>
	import HelloWorld from './components/HelloWorld';
    export default {
		provide () {
			return {
				reload: this.reload
			}
		},
		data(){
			return {
				isRouterAlive: true
			}
		},
		methods: {
			reload () {
				this.isRouterAlive = false
				this.$nextTick(function () {
					this.isRouterAlive = true
				})
			}
		},
		components: {
			HelloWorld
		},
    }
</script>

<style lang="less">
	@import './style/common';
</style>
