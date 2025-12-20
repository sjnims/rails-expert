# Chat Room Channel Example
#
# Real-time chat with room subscriptions, typing indicators, and presence

# app/channels/chat_channel.rb
class ChatChannel < ApplicationCable::Channel
  def subscribed
    @room = Room.find(params[:room_id])

    # Authorize access
    reject unless @room.accessible_by?(current_user)

    # Subscribe to room broadcasts
    stream_from "chat_room_#{@room.id}"

    # Notify others user joined
    broadcast_presence("joined")
  end

  def unsubscribed
    broadcast_presence("left") if @room
  end

  def speak(data)
    message = @room.messages.create!(
      user: current_user,
      content: sanitize_content(data['message'])
    )
    # Message broadcasts itself via after_create_commit callback
  end

  def typing(data)
    # Ephemeral typing indicator (not persisted)
    ActionCable.server.broadcast(
      "chat_room_#{@room.id}_typing",
      {
        user_id: current_user.id,
        username: current_user.name,
        typing: data['typing']
      }
    )
  end

  private

  def broadcast_presence(action)
    ActionCable.server.broadcast(
      "chat_room_#{@room.id}_presence",
      {
        user_id: current_user.id,
        username: current_user.name,
        action: action,
        timestamp: Time.current.to_i
      }
    )
  end

  def sanitize_content(content)
    ActionController::Base.helpers.sanitize(content)
  end
end

# app/models/message.rb
class Message < ApplicationRecord
  belongs_to :room
  belongs_to :user

  validates :content, presence: true, length: { maximum: 500 }

  # Broadcast after creation
  after_create_commit :broadcast_message

  private

  def broadcast_message
    ActionCable.server.broadcast(
      "chat_room_#{room_id}",
      {
        type: 'new_message',
        id: id,
        html: ApplicationController.render(
          partial: 'messages/message',
          locals: { message: self }
        ),
        user_id: user_id,
        timestamp: created_at.to_i
      }
    )
  end
end
