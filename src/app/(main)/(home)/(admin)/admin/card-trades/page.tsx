'use client'
import { Suspense, SyntheticEvent, useEffect, useState } from "react";
import { formatDistance, subDays } from 'date-fns';
import { checkHasPermission, currencyFormat } from "@/lib/utils";
import { Permission, PermissionFeatureEnum, PermissionModuleEnum, PermissionSubModuleEnum } from "@/types/module";
import { OverviewOne } from "../../../_components/overview-cards/overview-one";
import { StarIcon } from "../../../_components/overview-cards/icons";
import styles from './page.module.css';
import { GeneralOverview } from "./components/general-overview";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useSelector } from "react-redux";
import { selectAdminState } from "@/store/adminSlice";
import CustomModal from "@/components/Modal/CustomModal";
import Image from "next/image";
import { selectAuthState } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import LoadingModal from "@/components/Modal/LoadingModal";
import { AllCardsSkeleton } from "@/components/Tables/all-cards/skeleton";
import { OpenTradeList } from "@/components/Tables/trades/open";
import { Trade } from "@/models/trade";
import { AssignedTradeList } from "@/components/Tables/trades/assigned";
import { CompletedTradeList } from "@/components/Tables/trades/completed";
import { RejectedTradeList } from "@/components/Tables/trades/rejected";
import { TradeStatusEnum } from "@/types/enums";
import moment from "moment";
import { Button } from "@/components/ui-elements/button";
import IconSpinner from "@/components/Spinner";
import axiosExtended from "@/lib/network/axios-extended";
import routes from "@/lib/network/routes";
import { InfoModal } from "@/components/InfoModal/InfoModal";
import TradeChatModal from "./components/TradeChatModal";
import axios from "axios";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export interface DashboardType {
  usersCount: number;
  adminsCount: number;
  overview: OverviewData,
  analytics: AnalyticsType,
};

export interface AnalyticsType {
  newAccounts: number,
  completedCardTrades: number,
  totalWithdrawals: number,
  totalCryptoSwaps: number,
  totalNewAccounts: number,
  totalInactiveAccounts: number,
  groupedUsers: [string, number][],
};

export interface OverviewData {
  activeTradesCount: number;
  newTradesCount: number;
  rejectedTradesCount: number;
  completedTradesCount: number;
  completedTradesAmount: number;
  totalCryptoTransactions: number;
  usersCount: number;
  adminsCount: number;
  completedCardTradesCount: number;
  totalWalletWithdrawals: number;
  totalCryptoSwaps: number;
  totalNewAccountsCount: number;
  totalInactiveAccountsCount: number;
}



export default function CardTrades({ searchParams }: PropsType) {

  const { overview } = useSelector(selectAdminState);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const { user } = useSelector(selectAuthState);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [currentTab, setCurrentTab] = useState('open');
  const [currentTrade, setCurrentTrade] = useState<Trade>();
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  // if (!canRead && permissions.length) return router.replace("/error/unauthorized");
  const { newTradesCount, completedTradesCount, rejectedTradesCount, assignedTradesCount} = overview;
  const cardClass = 'flex-1 cursor-pointer hover:border-green hover:bg-[#F7FFDF]';

  const getStatusBgColor = (id: any) => {
    if (id == TradeStatusEnum.created) {
      return '#f53AFF80';
    } else if (id == TradeStatusEnum.active) {
      return '#FC451380';
    } else if (id == TradeStatusEnum.accepted) {
      return '#06990580';
    } else if (id == TradeStatusEnum.rejected) {
      return '#FF000080';
    } else return 'grey'
  }
  const fetchPermisions = async () => {
    const res = await axios.get('/api/permissions');
    if (res.status == 200)
      setPermissions(res.data)
  }
  useEffect(() => {
    fetchPermisions();
  }, []);
  const date = currentTrade ? currentTrade.createdAt : subDays(new Date(), 3); // A date 3 days ago
  const timeAgo = formatDistance(date, new Date(), { addSuffix: true });
  const [assigning, setAssigning] = useState(false);
  const [showAssignSuccessModal, setShowAssignSuccessModal] = useState(false);
  const [showTradeChatModal, setShowTradeChatModal] = useState(false);
  const assignToTrade = async () => {
    try {
      setAssigning(true)
      const res = await axiosExtended.patch(`${routes.assignTrades}`, {
        trade: {
          id: currentTrade?.id,
        },
      })
      setAssigning(false)
      if (res.status === 200) {
        setShowDetailModal(false)
        setShowAssignSuccessModal(true);
      }
      setAssigning(false)
    } catch (e) {
      setAssigning(false)
      console.log(JSON.stringify(e, null, 5))
    }
  }

  return (
    <>
      <div className="">
        {/* {
          currentTab == 'subcategories' && (
            <Button
              onClick={() => {
                setCurrentTab('cards')
              }}
              className="self-end mr-2 mb-3 mt-[-5]"
              variant="outlineDark" shape="rounded"
              icon={
                <ArrowLeft color="black" />
              }
            />
          )
        } */}

        {
          currentTab == 'subcategories' ? <Breadcrumb pageName="Sub-Categories" /> : <Breadcrumb pageName="Cards" />

        }

        <GeneralOverview overviewData={overview} overviewTitle="Card Trades">
          <div className="flex flex-col md:flex-row gap-4">
            <OverviewOne
              title="Open Trades"
              containerClassName={cardClass}
              value={`${newTradesCount}`}
              icon={<StarIcon className={styles.icon} />}
              onClick={() => {
                setCurrentTab('open')
              }}
            />
            <OverviewOne
              title="Assigned Trades"
              containerClassName={cardClass}
              value={`${assignedTradesCount || 0}`}
              icon={<StarIcon className={styles.icon} />}
              onClick={() => {
                setCurrentTab('assigned')
              }}
            />
            <OverviewOne
              title="Completed Trades"
              containerClassName={cardClass}
              value={`${completedTradesCount}`}
              icon={<StarIcon className={styles.icon} />}
              onClick={() => {
                setCurrentTab('completed')
              }}
            />
            <OverviewOne
              title="Rejected Trades"
              containerClassName={cardClass}
              value={`${rejectedTradesCount || 0}`}
              icon={<StarIcon className={styles.icon} />}
              onClick={() => {
                setCurrentTab('rejected')
              }}
            />

          </div>
        </GeneralOverview>
      </div>

      <div className="mt- md:mt-6 2xl:mt-9" />

      <div className="col-span-12 grid xl:col-span-8">
        <Suspense fallback={<AllCardsSkeleton />}>
          {
            currentTab == 'open' ?
              <OpenTradeList
                onClick={(trade) => {
                  setCurrentTrade(trade);
                  setShowDetailModal(true);
                }}
                onLoadStart={() => setShowLoadingModal(true)}
                onLoadEnd={() => setShowLoadingModal(false)}
              /> : undefined
          }
          {
            currentTab == 'assigned' ?
              <AssignedTradeList
                onClick={(trade) => {
                  setCurrentTrade(trade);
                  setShowDetailModal(true);
                }}
                onLoadStart={() => setShowLoadingModal(true)}
                onLoadEnd={() => setShowLoadingModal(false)}
                onChat={(trade) => {
                  setCurrentTrade(trade);
                  setShowTradeChatModal(true);
                }}
              /> : undefined
          }
          {
            currentTab == 'completed' ?
              <CompletedTradeList
                onClick={(trade) => {
                  setCurrentTrade(trade);
                  setShowDetailModal(true);
                }}
                onLoadStart={() => setShowLoadingModal(true)}
                onLoadEnd={() => setShowLoadingModal(false)}
              /> : undefined
          }
          {
            currentTab == 'rejected' ?
              <RejectedTradeList
                onClick={(trade) => {
                  setCurrentTrade(trade);
                  setShowDetailModal(true);
                }}
                onLoadStart={() => setShowLoadingModal(true)}
                onLoadEnd={() => setShowLoadingModal(false)}
              /> : undefined
          }
        </Suspense>
      </div>
      <CustomModal
        onClose={() => setShowDetailModal(false)}
        isOpen={showDetailModal}>
        <div
          className="flex flex-col items-start">
          <h3 className="pb-4 text-lg mt-[-5] font-bold text-dark dark:text-white sm:text-2xl">Trade Info</h3>

          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row w-full justify-be tween">
              <div className="flex flex-1 flex-row gap-3">
                <Image
                  src={{ src: currentTrade?.subCategory.category.photo.path || '', width: 40, height: 40 }}
                  className="size-8 rounded-full object-cover"
                  width={40}
                  height={40}
                  alt={currentTrade?.subCategory.category.name + " Logo"}
                  role="presentation"
                />
                <div className="font-bold text-lg">{currentTrade?.subCategory.category.name}</div>
              </div>

              <div className="flex flex-1 flex-col text-left">
                <div className="text-sm">
                  Sub-category:
                </div>
                <div className="font-bold text-lg">{currentTrade?.subCategory.name}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full mt-2">
            <div className="flex flex-row w-full justify-between">
              <div className="flex flex-1 flex-row gap-3 items-center">
                <div className="text-sm">Status: </div>
                <div
                  style={{
                    backgroundColor: getStatusBgColor(currentTrade?.status.id || 0)
                  }}
                  className={`text-sm text-white px-4 py-2 rounded-full`}>{currentTrade?.status.name}</div>
              </div>

              <div className="flex flex-1 flex-col text-left">
                <div className="text-sm ">
                  Amount:
                </div>
                <div className="font-bold text-lg">${currencyFormat(currentTrade?.cardAmount || 0, 0)} <span className="font-medium text-sm ml-4">Rate: {currentTrade?.currentRate}</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full mt-2">
            <div className="flex flex-row w-full justify-between">
              <div className="flex flex-1 flex-col items-start">
                <div className="text-sm">Customer: </div>
                <div className={`font-bold text-lg`}>{`${currentTrade?.user?.firstName} ${currentTrade?.user?.lastName}`}</div>
                <div className={`font-medium text-sm`}>{`${currentTrade?.user?.email}`}</div>

              </div>

              <div className="flex flex-1 flex-col text-left">
                <div className="text-sm ">
                  Date & Time:
                </div>
                <div className="text-medium">
                  {
                    moment(currentTrade?.createdAt).format('MMM D YYYY, H:mm')
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between w-full mt-2">
            <div className="flex flex-row w-full justify-between">
              {
                currentTrade?.assignee ? (
                  <div className="flex flex-1 flex-col items-start">
                    <div className="text-sm">Assigned Staff: </div>
                    <div className={`font-bold text-lg`}>{`${currentTrade?.assignee?.firstName} ${currentTrade?.assignee?.lastName}`}</div>
                  </div>
                ) : (<div className="flex-1"> </div>)
              }


              <div className="flex flex-1 flex-col text-left">
                <div className="text-sm ">
                  Open Since:
                </div>
                <div className="text-medium">
                  {
                    timeAgo
                  }
                </div>
              </div>
            </div>
          </div>
          {
            currentTrade?.status.id == TradeStatusEnum.created && (
              <Button className="self-end mt-10" label="Assign To Me" variant="green" shape="rounded"
                icon={
                  assigning ? <IconSpinner color="text-white-500" speed="animate-spin" /> : undefined
                }
                onClick={assignToTrade}
              />
            )
          }
          {
            [TradeStatusEnum.active, TradeStatusEnum.accepted, TradeStatusEnum.rejected, TradeStatusEnum.closed].includes(currentTrade?.status.id) && (
              <Button className="self-end mt-10" label="Open Chat" variant="green" shape="rounded"
                onClick={() => {
                  setShowDetailModal(false)
                  setShowTradeChatModal(true)
                }}
              />
            )
          }
        </div>
      </CustomModal>

      <TradeChatModal
        isOpen={showTradeChatModal}
        onClose={() => setShowTradeChatModal(false)}
        // @ts-ignore
        trade={currentTrade}
        permissions={permissions}
      />


      {/* <ConfirmationModal
        isOpen={showDisableSubModal}
        title={"Disable Sub Category"}
        message={"Are you sure you want to disable sub-category?"}
        onConfirm={disableSubcategory}
        onCancel={() => {
          setShowDisableSubModal(false)
        }}
      /> */}

      <LoadingModal
        isOpen={showLoadingModal}
      />
      <InfoModal
        isOpen={showAssignSuccessModal}
        title={"Congratulations!"}
        message={"You have been assigned to the trade"}
        onConfirm={() => {
          location.reload();
        }}
      />

    </>
  );
}


// TODO: Add prembly redirect url page
// URL: https://cardicapp.com/document-verification-complete