# Multi-Room Chat with Private Messages Example
#
# Subscribe to multiple rooms and handle direct messages

# app/channels/multi_chat_channel.rb
class MultiChatChannel < ApplicationCable::Channel
  def subscribed
    # Can subscribe to multiple rooms
    room_ids = params[:room_ids] || []

    room_ids.each do |room_id|
      room = Room.find_by(id: room_id)
      next unless room&.accessible_by?(current_user)

      stream_from "chat_room_#{room_id}"
    end

    # Also subscribe to private messages
    stream_for current_user
  end

  def speak(data)
    room = Room.find(data['room_id'])
    return unless room.accessible_by?(current_user)

    message = room.messages.create!(
      user: current_user,
      content: data['message']
    )
  end

  def send_private_message(data)
    recipient = User.find(data['recipient_id'])

    # Broadcast to recipient only
    MultiChatChannel.broadcast_to(
      recipient,
      {
        type: 'private_message',
        from: current_user.name,
        message: data['message'],
        html: render_private_message(data['message'])
      }
    )
  end

  private

  def render_private_message(content)
    ApplicationController.render(
      partial: 'messages/private',
      locals: { content: content, from: current_user }
    )
  end
end
