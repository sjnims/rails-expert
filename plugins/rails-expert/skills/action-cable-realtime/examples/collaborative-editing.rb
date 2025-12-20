# Collaborative Document Editing Example
#
# Real-time document editing with cursor positions and selections

# app/channels/document_channel.rb
class DocumentChannel < ApplicationCable::Channel
  def subscribed
    @document = Document.find(params[:document_id])
    reject unless @document.editable_by?(current_user)

    stream_from "document_#{@document.id}"
    stream_from "document_#{@document.id}_cursors"

    broadcast_editor_joined
  end

  def unsubscribed
    broadcast_editor_left if @document
  end

  def update_content(data)
    @document.update_column(:content, data['content'])

    ActionCable.server.broadcast(
      "document_#{@document.id}",
      {
        type: 'content_update',
        content: data['content'],
        user_id: current_user.id,
        version: @document.version
      }
    )
  end

  def cursor_position(data)
    ActionCable.server.broadcast(
      "document_#{@document.id}_cursors",
      {
        user_id: current_user.id,
        username: current_user.name,
        color: user_color,
        position: data['position']
      }
    )
  end

  def selection(data)
    ActionCable.server.broadcast(
      "document_#{@document.id}_cursors",
      {
        user_id: current_user.id,
        username: current_user.name,
        selection: data['range']
      }
    )
  end

  private

  def broadcast_editor_joined
    ActionCable.server.broadcast("document_#{@document.id}", {
      type: 'editor_joined',
      user_id: current_user.id,
      username: current_user.name
    })
  end

  def broadcast_editor_left
    ActionCable.server.broadcast("document_#{@document.id}", {
      type: 'editor_left',
      user_id: current_user.id
    })
  end

  def user_color
    # Consistent color per user
    colors = %w[#FF6B6B #4ECDC4 #45B7D1 #FFA07A #98D8C8]
    colors[current_user.id % colors.length]
  end
end
