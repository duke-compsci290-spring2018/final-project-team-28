<template>
    <div id="player">
        <button id="button-prev"></button>
        <button id="button-play"></button>
        <button id="button-next"></button>
    </div>
</template>

<script>
    export default {
        name:"PlayerControl",
        props:[''],
    }
</script>

<style scoped>

#button-prev {
    background-image:url(../assets/left-arrow.png);
    background-position: center;
    border-radius: 50%;
    height: 50px;
    width: 50px;
}

#button-play {
    background-image:url(../assets/play.png);
    background-position: center;
    border-radius: 50%;
    height: 80px;
    width: 80px;
}

#button-next {
    background-image:url(../assets/right-arrow.png);
    background-position: center;
    border-radius: 50%;
    height: 50px;
    width: 50px;
}

</style>