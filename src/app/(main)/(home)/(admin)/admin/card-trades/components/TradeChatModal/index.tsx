'use client';
import CustomModal from '@/components/Modal/CustomModal';
import React, { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import { Trade } from '@/models/trade';
import { TradeChatTypeEnum, TradeEvents, TradeStatusEnum } from '@/types/enums';
import { Button } from '@/components/ui-elements/button';
import { Dots } from 'react-activity'
import { Values } from '@/lib';
import { TradeChat } from '@/models/chat';
import { checkHasPermission, compare, currencyFormat, uniqueBy } from '@/lib/utils';
import axiosExtended from '@/lib/network/axios-extended';
import Message from '@/components/Chat/Message';
import routes from '@/lib/network/routes';
import ImageViewer from 'react-simple-image-viewer';
import { io } from 'socket.io-client'
import { selectAuthState } from '@/store/authSlice';
import { useSelector } from 'react-redux';
import queryString from 'query-string'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles/trade-chat.module.css'
import { Permission, PermissionFeatureEnum } from '@/types/module';
import { faFileImage, faEllipsisV } from '@fortawesome/free-solid-svg-icons';


const baseURL: string = process.env.NEXT_PUBLIC_API_URL || '';



interface TradeChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    trade?: Trade;
    permissions: Permission[];
}

export const TradeChatModal: React.FC<TradeChatModalProps> = ({
    isOpen,
    onClose,
    trade,
    permissions = []
}) => {

    const [message, setMessage] = useState({
        text: '',
        images: [],
    })
    const [submitting, setSubmitting] = useState(false)
    const [fetchingMessage, setFetchingMessage] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const createFormData = (type: TradeChatTypeEnum, images: FileList) => {
        const data = new FormData()

        if (images && images.length) {
            for (let i = 0; i < images.length; i++) {
                data.append('images', images[i])
            }
        }
        data.append('message', message.text)
        data.append('tradeId', (trade?.id || "").toString())
        data.append('typeId', type.toString())
        return data
    }
    const sendMessage = async (type: TradeChatTypeEnum = TradeChatTypeEnum.text, images?: FileList) => {
        setSubmitting(true)
        // @ts-ignore
        const payload = createFormData(type, images)
        try {
            const res = await axiosExtended.post(`${routes.trade}/chat`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            console.log('Res', res)
            if (res.status === 201) {
                setMessage({ images: [], text: '' })
                fetchMessages(() => {
                    setTimeout(scrollToBottom, 500)
                })
            }
        } catch (e) {
            console.log(e)
        } finally {
            setSubmitting(false)
        }
    }
    const [messages, setMessages] = useState<Array<TradeChat>>([])
    const pageIndex = useRef(1);


    const fetchMessages = async (fn: any = undefined, optionalParams?: any) => {
        setFetchingMessage(true)
        const payload = {
            page: pageIndex.current,
            limit: 20,
            ...optionalParams,
        }
        try {
            const res = await axiosExtended.get(`${routes.trade}/chat/${trade?.id}?${queryString.stringify(payload)}`)
            // console.log("Res", res)
            if (res.status === 200) {
                const newChats: TradeChat[] = res.data?.data
                let chats: TradeChat[] = [...messages, ...newChats].map((c) => ({ ...c, createdAt: new Date(c.createdAt), updatedAt: new Date(c.updatedAt) }))
                chats = uniqueBy<TradeChat>(chats, (chat) => chat.id.toString())
                chats = chats.sort((a, b) => compare<TradeChat>(a, b, 'createdAt'))
                setMessages(chats)
                fn && fn(chats)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setFetchingMessage(false)
        }
    }


    const pickImage = () => {
        // @ts-ignore
        pictureBtnRef.current.click()
    }
    // @ts-ignore
    const scrollRef = useRef()
    // @ts-ignore
    const pictureBtnRef = useRef()

    const { user } = useSelector(selectAuthState)

    const scrollToBottom = () => {
        // @ts-ignore
        setTimeout(() => scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight), 0)
    }

    const resetMessages = () => {
        setMessages([]);
        setImages([]);
    }

    useEffect(() => {
        if (isOpen) {
            resetMessages();
            fetchMessages(() => {
                scrollToBottom()
            })
            const socketRes = setupWebsocket()
            return () => {
                socketRes && socketRes()
            }
        }

    }, [isOpen])

    const setupWebsocket = () => {
        const socket = io(baseURL, { transports: ['websocket'] })
        socket.on(`${TradeEvents.chatAdded}:${trade?.id}`, onMessageAdded)
        return () => {
            socket.off(`${TradeEvents.chatAdded}:${trade?.id}`, onMessageAdded)
            socket.removeAllListeners(`${TradeEvents.chatAdded}:${trade?.id}`)
        }
    }

    const onMessageAdded = (chat: TradeChat) => {
        if (chat.from?.id != user?.id) {
            fetchMessages(() => {
                setTimeout(() => scrollToBottom(), 500)
            })
        }
    }


    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
    };
    // @ts-ignore
    const canAcceptTrade = checkHasPermission({ id: user?.adminRole?.id }, { id: PermissionFeatureEnum.acceptTrades }, permissions);
    // @ts-ignore
    const canRejectTrade = checkHasPermission({ id: user?.adminRole?.id }, { id: PermissionFeatureEnum.rejectTrades }, permissions);
    // @ts-ignore
    const canSendMessage = checkHasPermission({ id: user?.adminRole?.id }, { id: PermissionFeatureEnum.sendMessage }, permissions);

    return (
        <>
            <CustomModal
                onClose={onClose}
                isOpen={isOpen}>
                <div
                    className="">
                    <h3 className="pb-2 text-lg mt-[-5] font-bold text-dark dark:text-white sm:text-2xl">Trade Chat</h3>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            // marginBottom: 5,
                            paddingRight: 20,
                        }}
                    >
                        <div>
                            Customer:
                            {` ${trade?.user?.firstName}`}
                            {' '}
                            {trade?.user?.lastName}
                        </div>
                        <div>
                            Trade Amount:
                            {Values.NairaSymbol}{currencyFormat(trade?.amount || 0, 0)}
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 5,
                            paddingRight: 20,
                        }}
                    >
                        <div>
                            Rate:
                            {` ${Values.NairaSymbol}${currencyFormat(trade?.currentRate ?? 0, 0)}/${Values.DollarSymbol}`}
                        </div>
                        <div>
                            Card Amount:
                            {` ${Values.NairaSymbol}`}{`${currencyFormat(trade?.cardAmount || 0, 0)}`}
                        </div>
                    </div>
                    <div
                        // @ts-ignore
                        ref={scrollRef}
                        onScroll={(el) => {
                            // @ts-ignore
                            if (scrollRef.current.scrollTop == 0) {
                                fetchMessages((chats: TradeChat[]) => {
                                    if (chats.length > 0) {
                                        pageIndex.current += 1
                                    }
                                }, {
                                    page: pageIndex.current + 1,
                                })
                            }
                        }}
                        style={{
                            height: 350,
                            background: '#eee',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 10,
                            padding: 15,
                            overflow: 'scroll',
                        }}
                    >
                        {

                        }
                        {
                            messages?.length > 0 && messages.map((m) => (
                                <Message
                                    chat={m}
                                    isMine={m.from?.id == user?.id}
                                    onClickImage={(chat, index) => {
                                        setCurrentImage(index)
                                        setImages(chat.images?.map(i => i.path) ?? [])

                                        setIsViewerOpen(true)
                                    }}
                                />
                            ))
                        }
                    </div>

                    {
                        canSendMessage ?
                            <div
                                style={{
                                    height: 50,
                                    width: '100%',
                                    borderRadius: 10,
                                    // position: 'fixed',
                                    // bottom: 20,
                                    // left: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                                className='mt-5'
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >

                                    <div
                                        onClick={() => {
                                            !submitting && pickImage()
                                        }}
                                        className={styles.sendPictureBtn}
                                    >
                                        <FontAwesomeIcon className="sendPictureIcon" icon={faFileImage} />
                                        <div className={styles.wrapper}>
                                            {/* @ts-ignore */}
                                            <input
                                                // @ts-ignore
                                                ref={pictureBtnRef}
                                                type="file"
                                                id="uploadfile"
                                                accept="image/png, image/jpeg, image/jpg"
                                                multiple
                                                onChange={(e) => {
                                                    // @ts-ignore
                                                    setTimeout(() => !submitting && sendMessage(TradeChatTypeEnum.image, e.target.files), 50)
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <textarea
                                        value={message.text}
                                        onChange={(e) => {
                                            setMessage({
                                                ...message,
                                                text: e.target.value,
                                            })
                                        }}
                                        style={{
                                            width: 1000,
                                            borderRadius: 10,
                                            borderWidth: 0.5,
                                            borderColor: 'rgba(0, 0, 0, 0.175)',
                                            padding: 10,
                                        }}
                                        className=''
                                    />
                                    <div
                                        onClick={() => {
                                            message.text && sendMessage(TradeChatTypeEnum.text)
                                        }}
                                        className={`${styles.sendBtn} px-10`}
                                    >
                                        {
                                            submitting
                                                ? <Dots />
                                                : (
                                                    <div>
                                                        Send
                                                    </div>
                                                )
                                        }
                                    </div>
                                    {/* {
                                        trade?.status.id == TradeStatusEnum.active ? (
                                            <div
                                                onClick={() => pickImage()}
                                                className={styles.sendPictureBtn}
                                            >
                                                <FontAwesomeIcon className="sendPictureIcon" icon={faEllipsisV} />
                                            </div>
                                        ) : undefined
                                    } */}

                                </div>
                            </div>
                            : undefined
                    }

                    <div className='flex justify-end'>
                        {
                        trade?.status.id == TradeStatusEnum.active && (
                            <Button className="self-end mt-10" label="Accept" variant="green" shape="rounded"
                                onClick={() => {

                                }}
                            />
                        )
                    }

                    {
                        trade?.status.id == TradeStatusEnum.active && (
                            <Button className="self-end mt-10 ml-2" label="Reject" variant="danger" shape="rounded"
                                onClick={() => {

                                }}
                            />
                        )
                    }
                    </div>
                </div>

            </CustomModal>
            {isViewerOpen && (
                <ImageViewer
                    src={images}
                    currentIndex={currentImage}
                    disableScroll={false}
                    closeOnClickOutside={true}
                    onClose={closeImageViewer}
                    backgroundStyle={{
                        zIndex: 200
                    }}
                />
            )}
        </>

    );
};

export default TradeChatModal;