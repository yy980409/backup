<template>
    <div>
        <headtop></headtop>
        <div style="width: 70%">
            <Area-Tree :init="[]" :change="true"></Area-Tree>
        </div>


    </div>
</template>

<script>
    import AreaTree from '../components/area.vue'
    import headtop from '../components/headTop.vue'
	export default {
        data(){
            return {

            }
        },
        components:{
            AreaTree,headtop
        }
	}
</script>

<style scoped>

</style>
