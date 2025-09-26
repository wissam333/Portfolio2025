<template>
  <div class="mountains-wrapper">
    <img class="sky" src="/mountains2.jpeg" alt="mountains" />
    <img class="mountains" src="/onlyMountains3.png" alt="mountains" />
  </div>
</template>

<style lang="scss" scoped>
.mountains-wrapper {
  .sky,
  .mountains {
    position: absolute;
    bottom: 0;
    inset-inline-start: 0;
    object-fit: cover;
    width: 100vw;
  }

  .sky {
    z-index: 11;
    -webkit-mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 65%
    );
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: top;
    -webkit-mask-size: 100% 100%;

    mask-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 1) 65%
    );
    mask-repeat: no-repeat;
    mask-position: top;
    mask-size: 100% 100%;
  }

  .mountains {
    z-index: 13;
  }
}
</style>
