<template>
  <span class="conversation-reactions">
    <span class="reactions">
      <EmojiButton
        v-for="reaction in reactions"
        :key="reaction.name"
        v-touch-hold="toggleDetail"
        :name="reaction.name"
        class="reaction-box"
        :class="{ 'user-reacted': reaction.reacted }"
        :title="reaction.message"
        @click="$emit('toggle', reaction.name)"
      >
        <span class="reactions-number">{{ reaction.users.length }}</span>
      </EmojiButton>
    </span>
    <ConversationAddReaction
      class="add-button reaction-box"
      :reacted="currentUserReactions"
      :opacity="0.5"
      @toggle="$emit('toggle', arguments[0])"
    />
    <QDialog
      v-if="$q.platform.has.touch"
      v-model="showDetail"
      content-class="bg-grey-10 text-grey-1 q-pa-md"
    >
      <template>
        <QItem
          v-for="reaction in reactions"
          :key="reaction.name"
          @click="toggleDetail"
        >
          <QItemSection avatar>
            <EmojiButton
              :name="reaction.name"
              class="big"
            />
          </QItemSection>
          <QItemSection>
            <QItemLabel>{{ reaction.users.map(u => u.displayName).join(', ') }}</QItemLabel>
            <QItemLabel caption>{{ `:${reaction.name}:` }}</QItemLabel>
          </QItemSection>
        </QItem>
        <QBtn
          v-t="'BUTTON.CLOSE'"
          outline
          @click="toggleDetail"
        />
      </template>
    </QDialog>
  </span>
</template>

<script>
import ConversationAddReaction from './ConversationAddReaction'
import EmojiButton from './EmojiButton'

import {
  QDialog,
  QItem,
  QItemSection,
  QItemLabel,
  QBtn,
} from 'quasar'

export default {
  name: 'ConversationReactions',
  components: {
    ConversationAddReaction,
    EmojiButton,
    QDialog,
    QItem,
    QItemSection,
    QItemLabel,
    QBtn,
  },
  props: {
    reactions: {
      type: Array,
      default: () => [],
    },
    currentUserReactions: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      showDetail: false,
    }
  },
  methods: {
    toggleDetail () {
      this.showDetail = !this.showDetail
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
@import './reactionBox'

.add-button
  margin-left -4px
  transition none

.desktop .conversation-reactions
  .add-button
    visibility hidden

  &:hover .add-button
    visibility visible

.user-reacted
  border-color $secondary !important

.reactions-number
  padding-left 3px
  font-size .8em
  opacity .7

.big
  font-size 1.6em
</style>
