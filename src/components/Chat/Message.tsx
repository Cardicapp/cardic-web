import { TradeChat } from '@/models/chat';
import { TradeChatTypeEnum } from '@/types/enums';
import * as React from 'react'

interface Props {
  chat: TradeChat;
  isMine: boolean;
  onClickImage?: (chat: TradeChat, index: number) => void;
}

const Message = (props: Props) => {
  const {
    chat, isMine, onClickImage
  } = props
  const radius = 40
  return (
    <div
      style={{
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderTopLeftRadius: isMine ? radius : 0,
        borderTopRightRadius: isMine ? 0 : radius,
        borderBottomRightRadius: radius,
        borderBottomLeftRadius: radius,
        marginBottom: 10,
        background: '#ccc',
        maxWidth: '60%',
        display: 'table',
        marginLeft: isMine ? 'auto' : 0,
        marginRight: isMine ? 0 : 'auto',
        textAlign: 'start',
        cursor: 'pointer',
        ...(chat.type.id == TradeChatTypeEnum.image ? { display: 'flex', flexDirection: 'column' } : {}),
      }}
    >
      {
        chat.type.id == TradeChatTypeEnum.text
          ? chat.message
          : chat.images?.map((im, index) => (
            <img
            onClick={() => onClickImage && onClickImage(chat, index)}
              style={{
                marginBottom: 10,
                width: '100%',
              }}
              src={im.path}
            />
          ))

      }
    </div>
  )
}

export default Message
