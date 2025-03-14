<template>
  <div
    class="wrapper"
    :class="{showOverlay}"
  >
    <QBtn
      v-if="showOverlay"
      class="absolute-center"
      style="z-index: 1"
      color="primary"
      @click="$emit('input', 0)"
    >
      {{ $t('PICKUP_FEEDBACK.SET_AMOUNT') }}
    </QBtn>
    <div class="content">
      <div class="row no-wrap">
        <AmountBox
          class="amount"
          :amount="value"
        />
        <div
          style="margin-left: .6em"
          class="col"
        >
          <div
            v-t="'PICKUP_FEEDBACK.AMOUNT'"
            class="q-pb-sm"
          />
          <AmountViewer
            v-if="!$q.platform.is.mobile"
            :amount="value"
          />
        </div>
        <QBtn
          v-if="!showOverlay"
          round
          flat
          color="red"
          class="self-start"
          :title="$t('PICKUP_FEEDBACK.DELETE_AMOUNT')"
          @click="$emit('input', null)"
        >
          <QIcon name="fas fa-times" />
        </QBtn>
      </div>
      <div class="row no-wrap">
        <QSlider
          :value="limitedValue"
          :min="0"
          :max="70"
          :step="0.5"
          label
          class="self-center q-mx-md"
          @input="$emit('input', arguments[0])"
        />
        <!-- don't use type="number" here because browsers might enforce different decimal setting
        depending on browser locale-->
        <QInput
          v-model="valueToNumber"
          size="4"
          class="q-mr-md"
        >
          <template v-slot:append>
            <span class="text-caption">kg</span>
          </template>
        </QInput>
      </div>
    </div>
  </div>
</template>

<script>
import {
  QInput,
  QSlider,
  QBtn,
  QIcon,
} from 'quasar'

import AmountViewer from './AmountViewer'
import AmountBox from './AmountBox'

export default {
  components: {
    QInput,
    QSlider,
    QBtn,
    QIcon,
    AmountViewer,
    AmountBox,
  },
  props: {
    value: {
      default: null,
      type: Number,
    },
  },
  computed: {
    showOverlay () {
      return this.value === null
    },
    limitedValue: {
      get () {
        return Math.min(70, this.value)
      },
      set (v) {
        this.$emit('input', v)
      },
    },
    valueToNumber: {
      get () {
        return this.value
      },
      set (v) {
        let value = parseFloat(v, 10)
        value = isNaN(value) ? 0 : Math.max(0, value)
        this.$emit('input', value)
      },
    },
  },
}
</script>

<style scoped lang="stylus">
.wrapper
  position relative

.showOverlay .content
  filter blur(3px)
  opacity 0.3
</style>
