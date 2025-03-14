<template>
  <div class="Detail">
    <KSpinner v-show="isPending" />
    <ChatConversation
      v-if="conversation"
      :conversation="conversationWithMaybeReversedMessages"
      :away="away"
      :current-user="currentUser"
      :start-at-bottom="Boolean(user) || Boolean(pickup)"
      :inline="inline"
      compose
      @send="$emit('send', arguments[0])"
      @mark="$emit('mark', arguments[0])"
      @toggleReaction="$emit('toggleReaction', arguments[0])"
      @saveMessage="$emit('saveMessage', arguments[0])"
      @fetchPast="$emit('fetchPast', arguments[0])"
      @fetchFuture="$emit('fetchFuture')"
    >
      <template v-slot:before-chat-messages>
        <QExpansionItem
          v-if="application"
          default-opened
          class="bg-grey-2"
          :label="$t('APPLICATION.INITIAL')"
          header-class="text-bold"
        >
          <div class="q-pb-sm bg-grey-2">
            <div class="q-ma-sm q-pa-sm bg-white">
              <span class="text-bold text-secondary text-uppercase">{{ application.group.name }}</span>
              <span class="message-date">
                <small class="text-weight-light">
                  <DateAsWords :date="application.createdAt" />
                </small>
              </span>
              <Markdown :source="application.questions" />
            </div>
            <div class="q-ma-sm q-pa-sm bg-white">
              <span class="text-bold text-secondary text-uppercase">{{ application.user.displayName }}</span>
              <span class="message-date">
                <small class="text-weight-light">
                  <DateAsWords :date="application.createdAt" />
                </small>
              </span>
              <Markdown :source="application.answers" />
            </div>
          </div>
        </QExpansionItem>
      </template>
      <template v-slot:after-chat-messages>
        <QList
          v-if="pickup && pickup.isDisabled"
          class="bg-grey-2"
        >
          <QItem>
            <QItemSection>
              <QItemLabel>
                <b class="text-negative">{{ $t('PICKUPLIST.PICKUP_DISABLED') }}</b>
              </QItemLabel>
            </QItemSection>
          </QItem>
        </QList>
      </template>
    </ChatConversation>
  </div>
</template>

<script>
import ChatConversation from '@/messages/components/ChatConversation'
import Markdown from '@/utils/components/Markdown'
import DateAsWords from '@/utils/components/DateAsWords'
import KSpinner from '@/utils/components/KSpinner'

import {
  QExpansionItem,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'

export default {
  components: {
    ChatConversation,
    Markdown,
    DateAsWords,
    KSpinner,
    QExpansionItem,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
  },
  props: {
    inline: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: null,
    },
    pickup: {
      type: Object,
      default: null,
    },
    application: {
      type: Object,
      default: null,
    },
    conversation: {
      type: Object,
      default: null,
    },
    away: {
      type: Boolean,
      default: false,
    },
    currentUser: {
      type: Object,
      default: null,
    },
  },
  computed: {
    isPending () {
      if (!this.conversation) return false
      return this.conversation.fetchStatus.pending
    },
    conversationWithMaybeReversedMessages () {
      if (!this.conversation) return
      // TODO reverse message on server
      const messages = this.conversation.thread ? this.conversation.messages : this.conversation.messages.slice().reverse()
      return {
        ...this.conversation,
        messages,
      }
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.Detail
  background-color white

.message-date
  display inline-block
  margin-left 2px
</style>
