<template>
  <transition name="fade">
    <div
      v-if="show"
      id="splashScreen"
      class="splash-screen d-flex justify-content-center align-items-center"
      ref="splashScreen"
    >
      <div class="d-flex flex-column align-items-center">
        <div class="d-flex justify-content-center align-items-center" style="margin-bottom: 2.2rem">
          <img
            v-if="darkTheme"
            class="logo"
            src="../../public/img/weektodo-isologo-white.svg"
            alt="WeekToDo Logo"
            style="display: inline"
          />
          <img
            v-else
            class="logo"
            src="../../public/img/weektodo-isologo-color.svg"
            alt="WeekToDo Logo"
            style="display: inline"
          />
        </div>
        <div style="height: 25px; width: 200px"></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "splashScreen",
  data() {
    return {
      show: true,
      darkTheme: this.$store.getters.config.darkTheme,
    };
  },
  methods: {
    hideSplash: function () {
      this.show = false;
    },
  },
};
</script>

<style scoped>
.splash-screen {
  width: 100%;
  height: 100%;
  z-index: 1060;
  position: absolute;
  background-color: #fcfcfc;
}

.dark-theme .splash-screen {
  background-color: #13171d;
}

.logo {
  margin-right: 15px;
  width: 25rem;
}

.splash-screen h1 {
  color: #3f0e81;
}

.dark-theme .splash-screen h1 {
  color: #5329a3;
}

.splash-screen h1 {
  letter-spacing: 3px;
  font-size: 3rem;
  margin-bottom: 10px;
}

.splash-screen span {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.4rem;
  color: #79606b;
  margin-bottom: 20px;
}

.sponsor {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #bababa;
}

.dark-theme .splash-screen span {
  color: #c9d1d9;
}

.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
