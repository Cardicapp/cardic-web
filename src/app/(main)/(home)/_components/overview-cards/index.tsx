import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { DashboardType, OverviewData } from "../../(admin)/admin/dashboard/page";

interface OverviewCardsGroupProps {
  data: OverviewData;
};
export async function OverviewCardsGroup(props: OverviewCardsGroupProps) {
  // const { views, profit, products, users } = await getOverviewData();

  const { adminsCount, newTradesCount, totalCryptoTransactions, completedTradesCount} = props.data;
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Admins"
        data={{
          value: compactFormat(adminsCount),
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Total Card Trades"
        data={{
          value: compactFormat(completedTradesCount || 0),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Crypto Transactions"
        data={{
          value: compactFormat(totalCryptoTransactions),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="New Card Trades"
        data={{
          value: compactFormat(newTradesCount),
        }}
        Icon={icons.Product}
      />
    </div>
  );
}
