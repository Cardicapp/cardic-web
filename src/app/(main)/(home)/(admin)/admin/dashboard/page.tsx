import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { ChatsCard } from "../../../_components/chats-card";
import { OverviewCardsGroup } from "../../../_components/overview-cards";
import { OverviewCardsSkeleton } from "../../../_components/overview-cards/skeleton";
import { RegionLabels } from "../../../_components/region-labels";
import axiosExtended from "@/lib/network/axios-extended";
import routes from "@/lib/network/routes";
import { cookies } from 'next/headers';
import { AdminRoleEnum } from "@/types/role";
import { checkHasPermission, currencyFormat } from "@/lib/utils";
import { PermissionModuleEnum, PermissionSubModuleEnum } from "@/types/module";
import axios from "axios";
import { OverviewOne } from "../../../_components/overview-cards/overview-one";
import { DollarSign, StarIcon } from "../../../_components/overview-cards/icons";
import styles from './page.module.css';
import { PeriodPicker } from "@/components/period-picker";
import { GeneralOverview } from "./components/general-overview";
import { compactFormat } from "@/lib/format-number";
import AdminOverviewClientDataWrapper from "@/components/ClientDataWrapper/AdminOverviewClientDataWrapper";

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
  assignedTradesCount: number;
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



export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const cookiesStore = await cookies();
  const user = JSON.parse(cookiesStore.get('user')?.value || '{}');
  // const { user } = useSelector(selectAuthState);
  // const [isLoading, setIsLoading] = useState(false);
  // const [dashboard, setDashboard] = useState({
  //   "usersCount": 0,
  //   "adminsCount": 0,
  //   "cards": {
  //     "activeTradesCount": 0,
  //     "newTradesCount": 0,
  //     "rejectedTradesCount": 0,
  //     "completedTradesCount": 0,
  //     "completedTradesAmount": 0,
  //   },
  //   "crypto": {
  //     "activeTradesCount": 0,
  //     "newTradesCount": 0,
  //     "rejectedTradesCount": 0,
  //     "completedTradesCount": 0,
  //     "completedTradesAmount": 0,
  //   },
  // });


  // const getDashboard = async () => {
  //   const authToken = cookiesStore.get('auth')?.value || '';
  //   const baseURL = process.env.NEXT_PUBLIC_API_URL;
  //   try {
  //     const res = await axios.get(`${baseURL}${routes.home}/dashboard`,
  //       { headers: { Authorization: `Bearer ${authToken}` } }
  //     )
  //     console.log("DASHBOARD DATA ======>", res);
  //     if (res.status === 200) {
  //       return res.data;
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     return null;
  //   }
  // };

  const getOverviewData = async () => {
    const authToken = cookiesStore.get('auth')?.value || '';
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    try {
      const res = await axios.get(`${baseURL}${routes.home}/overview`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      // console.log("OVERVIEW DATA ======>", res.data);
      if (res.status === 200) {
        return res.data;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  };


  // const dashboardData: DashboardType = await getDashboard();
  const overviewData: OverviewData = await getOverviewData();

  const {
    completedTradesAmount,
    usersCount,
    totalWalletWithdrawals,
    totalCryptoSwaps
  } = overviewData;
  return (
    <>
      <AdminOverviewClientDataWrapper data={overviewData} />
      <div className="">
        <GeneralOverview overviewData={overviewData} overviewTitle="">
          <div className="flex flex-col md:flex-row gap-4">
            <OverviewOne
              title="Total Users"
              containerClassName="flex-1"
              icon={<StarIcon className={styles.icon} />}
              value={`${usersCount || 0}`} />
            <OverviewOne
              title="Total Card Transactions"
              containerClassName="flex-1"
              icon={<StarIcon className={styles.icon} />}
              value={`₦${currencyFormat(completedTradesAmount || 0, 0)}`}
            />
            <OverviewOne
              title="Total Withdrawals"
              containerClassName="flex-1"
              icon={<StarIcon className={styles.icon} />}
              value={`₦${currencyFormat(totalWalletWithdrawals || 0, 0)}`}
            />
            <OverviewOne
              title="Total Cryto Swaps"
              containerClassName="flex-1"
              icon={<StarIcon className={styles.icon} />}
              value={`${totalCryptoSwaps || 0}`}
            />
          </div>
        </GeneralOverview>
      </div>

      <div className="mt- md:mt-6 2xl:mt-9" />

      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup data={overviewData} />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <PaymentsOverview
          className="col-span-12 xl:col-span-7"
          key={extractTimeFrame("payments_overview")}
        // timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        />

        <WeeksProfit
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-5"
        />

        {/* <UsedDevices
          className="col-span-12 xl:col-span-5"
          key={extractTimeFrame("used_devices")}
          timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
        /> */}

        {/* <RegionLabels /> */}

        <div className="col-span-12 grid xl:col-span-8">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <TopChannels />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <ChatsCard />
        </Suspense>
      </div>
    </>
  );
}
