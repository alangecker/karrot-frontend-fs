<template>
  <div v-if="group">
    <QCard class="shadow-6">
      <div
        class="photo text-white relative-position row justify-center"
        :class="{ hasPhoto: group.hasPhoto }"
      >
        <img
          v-if="group.hasPhoto"
          :src="group.photoUrls.fullSize"
        >
        <RandomArt
          v-else
          :seed="group.id"
          type="circles"
          class="full-height"
        />
        <div class="absolute-bottom k-media-overlay q-pa-md">
          <div
            class="ellipsis"
          >
            <span class="row group items-start text-h6">
              {{ group.name }}
              <QIcon
                v-if="group.isPlayground"
                name="fas fa-child"
              />
            </span>
            <span class="text-subtitle2">
              {{ group.members.length }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.members.length) }}
            </span>
          </div>
        </div>
      </div>
      <QCardSection>
        <div
          v-if="group.publicDescription"
        >
          <Markdown :source="group.publicDescription" />
        </div>
        <span
          v-else
          class="text-italic"
        >
          {{ $t('JOINGROUP.NO_PUBLIC_DESCRIPTION') }}
        </span>
      </QCardSection>
      <QSeparator />
      <QCardActions>
        <div style="width: 100%">
          <template v-if="isLoggedIn">
            <template v-if="!group.isMember">
              <QBanner
                v-if="!application"
                class="bg-info"
              >
                {{ $t('JOINGROUP.PROFILE_NOTE' ) }}
                <template v-slot:avatar>
                  <QIcon
                    name="info"
                    style="font-size: 24px"
                  />
                </template>
              </QBanner>
              <QBanner
                v-if="application"
                class="bg-blue text-white"
                inline-actions
              >
                {{ $t('JOINGROUP.APPLICATION_PENDING' ) }}
                <template v-slot:avatar>
                  <QIcon
                    name="info"
                    color="white"
                    style="font-size: 24px"
                  />
                </template>
                <template v-slot:action>
                  <QBtn
                    flat
                    dense
                    :label="$t('BUTTON.OPEN')"
                    icon="fas fa-fw fa-comments"
                    @click="$emit('openChat', application)"
                  />
                  <QBtn
                    flat
                    dense
                    :label="$t('BUTTON.WITHDRAW')"
                    icon="fas fa-fw fa-trash-alt"
                    @click="withdraw"
                  />
                </template>
              </QBanner>
              <QBtn
                v-if="group.isOpen"
                color="secondary"
                class="float-right q-ma-xs"
                :loading="isPending"
                @click="$emit('join', group.id)"
              >
                {{ $t('BUTTON.JOIN') }}
              </QBtn>

              <QBtn
                v-if="!group.isOpen && user && !user.mailVerified"
                color="secondary"
                class="float-right q-ma-xs"
                :loading="isPending"
                @click="$emit('goSettings')"
              >
                {{ $t('JOINGROUP.VERIFY_EMAIL_ADDRESS') }}
              </QBtn>
              <QBtn
                v-if="!group.isOpen && user && user.mailVerified && !application"
                color="secondary"
                class="float-right q-ma-xs"
                :loading="isPending"
                @click="$emit('goApply', group.id)"
              >
                {{ $t('BUTTON.APPLY') }}
              </QBtn>
            </template>
            <QBtn
              v-else
              flat
              @click="$emit('goVisit', group.id)"
            >
              <QIcon name="fas fa-home" />
              <QTooltip>
                {{ $t('GROUPINFO.MEMBER_VIEW') }}
              </QTooltip>
            </QBtn>
          </template>

          <QBtn
            v-else
            color="secondary"
            class="float-right q-ma-xs"
            :loading="isPending"
            @click="$emit('goSignup', group)"
          >
            {{ $t('JOINGROUP.SIGNUP_OR_LOGIN') }}
          </QBtn>
        </div>
      </QCardActions>
    </QCard>
  </div>
</template>

<script>
import {
  Dialog,
  QTooltip,
  QCard,
  QCardSection,
  QSeparator,
  QCardActions,
  QBtn,
  QIcon,
  QBanner,
} from 'quasar'
import Markdown from '@/utils/components/Markdown'
import statusMixin from '@/utils/mixins/statusMixin'
import RandomArt from '@/utils/components/RandomArt'

export default {
  components: {
    QCard,
    QCardSection,
    QSeparator,
    QCardActions,
    QBtn,
    QIcon,
    QTooltip,
    QBanner,
    Markdown,
    RandomArt,
  },
  props: {
    group: {
      default: null,
      type: Object,
    },
    isLoggedIn: {
      default: false,
      type: Boolean,
    },
    user: {
      default: null,
      type: Object,
    },
    application: {
      default: null,
      type: Object,
    },
  },
  computed: {
    status () {
      return this.group && this.group.joinStatus
    },
    ...statusMixin.computed,
  },
  methods: {
    withdraw () {
      Dialog.create({
        title: this.$t('JOINGROUP.WITHDRAW_CONFIRMATION_HEADER'),
        message: this.$t('JOINGROUP.WITHDRAW_CONFIRMATION_TEXT', { groupName: this.group.name }),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .onOk(() => this.$emit('withdraw', this.application.id))
    },
  },
}
</script>

<style scoped lang="stylus">
.q-card *
  overflow hidden

.photo
  &.hasPhoto
    height 350px

  &:not(.hasPhoto)
    height 140px

  img
    width auto
    max-width 100%
    max-height 100%
    margin 0 auto

  .k-media-overlay
    background-color rgba(0, 0, 0, 0.47)
</style>
