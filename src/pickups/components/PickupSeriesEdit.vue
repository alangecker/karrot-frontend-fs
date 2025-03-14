<template>
  <div
    class="edit-box"
    :class="{ changed: hasChanged }"
  >
    <form
      class="q-gutter-y-lg"
      style="max-width: 700px"
      @submit.prevent="maybeSave"
    >
      <QField
        stack-label
        borderless
        :label="$t('CREATEPICKUP.FREQUENCY')"
        hide-bottom-space
      >
        <template v-slot:before>
          <QIcon name="fas fa-redo" />
        </template>
        <template v-slot:control>
          <QOptionGroup
            v-model="edit.rule.isCustom"
            inline
            type="radio"
            :options="[
              { label: $t('CREATEPICKUP.WEEKLY'), value: false },
              { label: $t('CREATEPICKUP.CUSTOM'), value: true },
            ]"
          />
        </template>
      </QField>

      <div class="row q-mt-xs">
        <QInput
          v-if="edit.rule.isCustom"
          ref="qStartDate"
          v-model="startDate"
          mask="####-##-##"
          :error="hasError('startDate')"
          size="9"
          hide-bottom-space
          class="q-mr-sm"
          @focus="$refs.qStartDateProxy.show()"
          @blur="$refs.qStartDateProxy.hide()"
        >
          <template v-slot:before>
            <QIcon name="access_time" />
          </template>
          <Component
            :is="smallScreen ? 'QDialog' : 'QMenu'"
            ref="qStartDateProxy"
            no-focus
            no-refocus
            no-parent-event
            @hide="$refs.qStartDate.blur()"
          >
            <QDate
              v-model="startDate"
              mask="YYYY-MM-DD"
            />
          </Component>
        </QInput>
        <QInput
          ref="qStartTime"
          v-model="startTime"
          mask="time"
          :rules="['time']"
          size="3"
          :error="hasError('startDate')"
          hide-bottom-space
          @blur="$refs.qStartTimeProxy.hide()"
          @focus="$refs.qStartTimeProxy.show()"
        >
          <Component
            :is="smallScreen ? 'QDialog' : 'QMenu'"
            ref="qStartTimeProxy"
            no-focus
            no-refocus
            no-parent-event
            @hide="$refs.qStartTime.blur()"
          >
            <QTime
              v-model="startTime"
              mask="HH:mm"
              format24h
              @input="() => smallScreen && $refs.qStartTimeProxy.hide()"
            />
          </Component>
          <template
            v-if="!edit.rule.isCustom"
            v-slot:before
          >
            <QIcon name="access_time" />
          </template>
          <template v-slot:after>
            <QBtn
              v-if="!hasDuration"
              size="xs"
              round
              flat
              icon="fas fa-plus"
              class="q-ml-xs"
              @click.stop.prevent="toggleDuration"
            />
          </template>
        </QInput>
        <template v-if="hasDuration">
          <div
            v-t="'TO'"
            class="q-px-md self-center"
          />
          <QInput
            ref="qEndTime"
            v-model="endTime"
            mask="time"
            :rules="['time']"
            size="3"
            :error="hasError('startDate')"
            hide-bottom-space
            @blur="$refs.qEndTimeProxy.hide()"
            @focus="$refs.qEndTimeProxy.show()"
          >
            <Component
              :is="smallScreen ? 'QDialog' : 'QMenu'"
              ref="qEndTimeProxy"
              no-focus
              no-refocus
              no-parent-event
              @hide="$refs.qEndTime.blur()"
            >
              <QTime
                v-model="endTime"
                mask="HH:mm"
                format24h
                @input="() => smallScreen && $refs.qEndTimeProxy.hide()"
              />
            </Component>
            <template v-slot:after>
              <QIcon
                color="grey"
                name="cancel"
                class="cursor-pointer"
                @click="toggleDuration"
              />
              <div class="text-caption q-ml-xs">
                ({{ formattedDuration }})
              </div>
            </template>
          </QInput>
        </template>
        <div class="q-ml-lg col-12 q-field__bottom">
          <div
            v-if="hasError('startDate')"
            class="text-negative"
          >
            {{ firstError('startDate') }}
          </div>
          <div
            v-else
          >
            {{ edit.rule.isCustom ? $t('CREATEPICKUP.STARTDATE_HELPER') : $t('CREATEPICKUP.TIME_HELPER') }}
          </div>
        </div>
      </div>

      <QSelect
        v-if="!edit.rule.isCustom"
        v-model="byDay"
        multiple
        :options="dayOptions"
        :label="$t('CREATEPICKUP.WEEKDAYS')"
        :hint="$t('CREATEPICKUP.WEEKDAYS_HELPER')"
        :error="hasError('rule')"
        :error-message="firstError('rule')"
        emit-value
        map-options
      >
        <template v-slot:before>
          <QIcon name="today" />
        </template>
        <template v-slot:option="scope">
          <QItem
            :key="scope.index"
            dense
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
          >
            <QItemSection>
              <QItemLabel>{{ scope.opt.label }}</QItemLabel>
            </QItemSection>
            <QItemSection side>
              <QToggle
                :value="scope.selected"
                @input="scope.toggleOption(scope.opt)"
              />
            </QItemSection>
          </QItem>
        </template>
      </QSelect>

      <QInput
        v-if="edit.rule.isCustom"
        v-model="edit.rule.custom"
        type="textarea"
        :label="$t('CREATEPICKUP.RRULE')"
        :error="hasError('rule')"
        :error-message="firstError('rule')"
        autogrow
        @keyup.ctrl.enter="maybeSave"
      >
        <template v-slot:before>
          <QIcon name="code" />
        </template>
        <template v-slot:hint>
          <i18n path="CREATEPICKUP.RRULE_HELPER">
            <a
              slot="ruleHelper"
              v-t="'CREATEPICKUP.RRULE_HELPER_URL'"
              href="https://www.kanzaki.com/docs/ical/rrule.html"
              target="_blank"
              rel="noopener nofollow noreferrer"
              style="text-decoration: underline"
            />
            <a
              slot="ruleExample"
              v-t="'CREATEPICKUP.RRULE_EXAMPLE'"
              href="https://jakubroztocil.github.io/rrule/#/rfc/FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1"
              target="_blank"
              rel="noopener nofollow noreferrer"
              style="text-decoration: underline"
            />
            <a
              slot="ruleExample2"
              v-t="'CREATEPICKUP.RRULE_EXAMPLE2'"
              href="https://jakubroztocil.github.io/rrule/#/rfc/FREQ=WEEKLY;INTERVAL=2;BYDAY=MO"
              target="_blank"
              rel="noopener nofollow noreferrer"
              style="text-decoration: underline"
            />
          </i18n>
        </template>
      </QInput>

      <QInput
        v-model.number="edit.maxCollectors"
        type="number"
        stack-label
        :label="$t('CREATEPICKUP.MAX_COLLECTORS')"
        :hint="$t('CREATEPICKUP.MAX_COLLECTORS_HELPER')"
        :placeholder="$t('CREATEPICKUP.UNLIMITED')"
        :error="hasError('maxCollectors')"
        :error-message="firstError('maxCollectors')"
        input-style="max-width: 100px"
      >
        <template v-slot:before>
          <QIcon name="group" />
        </template>
        <QSlider
          v-if="edit.maxCollectors > 0 && edit.maxCollectors <= 10"
          v-model="edit.maxCollectors"
          :min="1"
          :max="10"
          label
          markers
          class="q-mx-sm self-end"
          style="min-width: 60px"
        />
      </QInput>

      <QInput
        v-model="edit.description"
        :error="hasError('description')"
        :error-message="firstError('description')"
        :label="$t('CREATEPICKUP.COMMENT')"
        :hint="$t('CREATEPICKUP.COMMENT_HELPER')"
        type="textarea"
        maxlength="500"
        autogrow
        @keyup.ctrl.enter="maybeSave"
      >
        <template v-slot:before>
          <QIcon name="info" />
        </template>
      </QInput>

      <div
        v-if="hasNonFieldError"
        class="text-negative"
      >
        {{ firstNonFieldError }}
      </div>

      <div class="row justify-end q-gutter-sm q-mt-lg">
        <QBtn
          v-if="isNew"
          type="button"
          @click="$emit('cancel')"
        >
          {{ $t('BUTTON.CANCEL') }}
        </QBtn>
        <QBtn
          type="button"
          :disable="!hasChanged"
          @click="reset"
        >
          {{ $t('BUTTON.RESET') }}
        </QBtn>
        <QBtn
          v-if="!isNew"
          type="button"
          color="red"
          @click="destroy"
        >
          {{ $t('BUTTON.DELETE') }}
        </QBtn>
        <QBtn
          type="submit"
          color="primary"
          :disable="!canSave"
          :loading="isPending"
        >
          {{ $t(isNew ? 'BUTTON.CREATE' : 'BUTTON.SAVE_CHANGES') }}
        </QBtn>
      </div>
    </form>
  </div>
</template>

<script>
import {
  QTime,
  QField,
  QSlider,
  QInput,
  QBtn,
  QSelect,
  QIcon,
  QOptionGroup,
  QSeparator,
  QDialog,
  QMenu,
  QItem,
  QItemSection,
  QItemLabel,
  QToggle,
  QDate,
  Dialog,
  date,
} from 'quasar'
import editMixin from '@/utils/mixins/editMixin'
import statusMixin from '@/utils/mixins/statusMixin'

import { dayOptions } from '@/base/i18n'

import { defaultDuration } from '@/pickups/settings'
import { formatSeconds } from '@/pickups/utils'

import addSeconds from 'date-fns/addSeconds'
import addDays from 'date-fns/addDays'
import differenceInSeconds from 'date-fns/differenceInSeconds'

export default {
  components: {
    QTime,
    QField,
    QSlider,
    QInput,
    QBtn,
    QSelect,
    QIcon,
    QOptionGroup,
    QItem,
    QItemSection,
    QItemLabel,
    QSeparator,
    QDialog,
    QMenu,
    QToggle,
    QDate,
  },
  mixins: [editMixin, statusMixin],
  computed: {
    dayOptions,
    canSave () {
      if (!this.isNew && !this.hasChanged) {
        return false
      }
      return true
    },
    ruleMode: {
      get () {
        return this.edit.rule.isCustom ? 'custom' : 'weekly'
      },
      set (v) {
        this.edit.rule.isCustom = v === 'custom'
      },
    },
    byDay: {
      get () {
        return this.edit.rule.byDay
      },
      set (v) {
        // enforce having at least one day selected
        if (v.length > 0) this.edit.rule.byDay = v
      },
    },
    hasDuration: {
      get () {
        return Boolean(this.edit.duration)
      },
      set (val) {
        if (val) {
          if (!this.edit.duration) this.edit.duration = defaultDuration
        }
        else {
          this.edit.duration = null
        }
      },
    },
    startDate: {
      get () {
        return date.formatDate(this.edit.startDate, 'YYYY-MM-DD')
      },
      set (val) {
        val = date.extractDate(val, 'YYYY-MM-DD')
        val = date.adjustDate(this.edit.startDate, { year: val.getFullYear(), month: val.getMonth() + 1, date: val.getDate() })
        this.edit.startDate = val
      },
    },
    startTime: {
      get () {
        return date.formatDate(this.edit.startDate, 'HH:mm')
      },
      set (val) {
        val = date.extractDate(val, 'HH:mm')
        val = date.adjustDate(this.edit.startDate, { hours: val.getHours(), minutes: val.getMinutes() })
        this.edit.startDate = val
      },
    },
    endTime: {
      get () {
        const endDate = addSeconds(this.edit.startDate, this.edit.duration)
        return date.formatDate(endDate, 'HH:mm')
      },
      set (val) {
        val = date.extractDate(val, 'HH:mm')
        val = date.adjustDate(this.edit.startDate, { hours: val.getHours(), minutes: val.getMinutes() })
        if (val < this.edit.startDate) {
          // if the value is in the past add a day (allows pickups over midnight)
          val = addDays(val, 1)
        }
        this.edit.duration = differenceInSeconds(val, this.edit.startDate)
      },
    },
    formattedDuration () {
      return this.edit.duration && formatSeconds(this.edit.duration)
    },
    smallScreen () {
      return this.$q.screen.width < 450 || this.$q.screen.height < 450
    },
  },
  watch: {
    isPending (val) {
      const hasExceptions = () => {
        const { pickups } = this.edit
        return pickups.some(({ seriesMeta }) => seriesMeta.isDescriptionChanged || seriesMeta.isMaxCollectorsChanged || !seriesMeta.matchesRule)
      }
      if (!val && !this.hasAnyError && hasExceptions()) {
        Dialog.create({
          title: this.$t('CREATEPICKUP.EXCEPTIONS_TITLE'),
          message: this.$t('CREATEPICKUP.EXCEPTIONS_MESSAGE', { upcomingLabel: this.$t('PICKUPMANAGE.UPCOMING_PICKUPS_IN_SERIES') }),
          ok: this.$t('BUTTON.YES'),
        })
      }
    },
  },
  methods: {
    toggleDuration () {
      this.hasDuration = !this.hasDuration
    },
    maybeSave () {
      if (!this.canSave) return
      this.save()
    },
    destroy (event) {
      Dialog.create({
        title: this.$t('PICKUPDELETE.DELETE_SERIES_TITLE'),
        message: this.$t('PICKUPDELETE.DELETE_SERIES_TEXT'),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('BUTTON.YES'),
      })
        .onOk(() => this.$emit('destroy', this.value.id, event))
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
