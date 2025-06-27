<style scoped>
div {
  margin: 2em;
}
.add-scroll-shadow {
  --plain-color: var(--background, rgb(255, 255, 255));
  --shadow-color: var(--shadow, rgba(0, 0, 0, 0.4));
  --thickness: var(--shadow-thickness, 5px);
  background-color: white;
  overflow: auto;

  background:
    linear-gradient(var(--plain-color) 30%, transparent) center top,
    linear-gradient(transparent, var(--plain-color) 70%) center bottom,
    radial-gradient(farthest-side at 20% 0%, var(--shadow-color), transparent) center top,
    radial-gradient(farthest-side at 80% 0%, var(--shadow-color), transparent) center top,
    radial-gradient(farthest-side at 20% 100%, var(--shadow-color), transparent) center bottom,
    radial-gradient(farthest-side at 80% 100%, var(--shadow-color), transparent) center bottom,
    var(--plain-color);
  background-repeat: no-repeat;
  background-size:
    100% calc(3 * var(--thickness)),
    100% calc(3 * var(--thickness)),
    100% var(--thickness),
    100% var(--thickness),
    100% var(--thickness),
    100% var(--thickness),
    100% 100%;
  background-attachment: local, local, scroll, scroll, scroll, scroll, scroll;
}
.example {
  width: 400px;
}
</style>

<template>
  <div style="background: hsl(0, 20%, 90%); padding: 2em">
    <div class="add-scroll-shadow" style="max-height: 10em; --background: white">
      <ul class="example">
        <li v-for="i in 30" :key="i">{{ i }}</li>
      </ul>
    </div>
    <div
      class="add-scroll-shadow"
      style="
        max-height: 10em;
        --background: white;
        --shadow-thickness: 20px;
        --shadow-color: rgba(0, 0, 0, 0.2);
      "
    >
      <ul class="example">
        <li v-for="i in 30" :key="i">{{ i }}</li>
      </ul>
    </div>
    <div
      class="add-scroll-shadow"
      style="
        max-height: 10em;
        --background: yellow;
        --shadow-thickness: 3px;
        --shadow-color: rgba(100, 0, 0, 0.8);
      "
    >
      <ul class="example">
        <li v-for="i in 30" :key="i">{{ i }}</li>
      </ul>
    </div>
  </div>
</template>
