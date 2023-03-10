<template>
  <svg aria-hidden="true" :class="[$attrs.class, 'svg-icon']" :style="getStyle" @mouseenter="color = hover">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>
<script lang="ts" setup>
import { onMounted, ref, computed, toRefs } from "vue";
import type { CSSProperties } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon'
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 16
  },
  normal: {
    type: String,
    default: ''
  },
  hover: {
    type: String,
    default: ''
  }
})
const { normal, hover } = toRefs(props)
const color = ref('')
onMounted(() => {
  color.value = normal.value
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
const getStyle = computed((): CSSProperties => {
  const { size } = props
  let s = `${size}`
  s = `${s.replace('px', '')}px`
  return {
    width: s,
    height: s
  }
})
// import type { CSSProperties } from 'vue';
// import { defineComponent, computed } from 'vue';
// // import { useDesign } from '/@/hooks/web/useDesign';

// export default defineComponent({
//   name: 'SvgIcon',
//   props: {
//     prefix: {
//       type: String,
//       default: 'icon',
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     spin: {
//       type: Boolean,
//       default: false,
//     },
//     size: {
//       type: [Number, String],
//       default: 16
//     },
//   },
//   setup(props) {
//     const color = ref('')
//     // const { prefixCls } = useDesign('svg-icon');
//     const symbolId = computed(() => `#${props.prefix}-${props.name}`);

//     const getStyle = computed((): CSSProperties => {
//       const { size } = props;
//       let s = `${size}`;
//       s = `${s.replace('px', '')}px`;
//       return {
//         width: s,
//         height: s,
//       };
//     });
//     return { symbolId };
//   },
// });
</script>
<style lang="less" scoped>
.svg-icon {
  display: inline-block;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentColor;
}

// @prefix-cls: ~'@{namespace}-svg-icon';

// .@{prefix-cls} {
//   display: inline-block;
//   overflow: hidden;
//   vertical-align: -0.15em;
//   fill: currentColor;
// }

// .svg-icon-spin {
//   animation: loadingCircle 1s infinite linear;
// }
</style>
