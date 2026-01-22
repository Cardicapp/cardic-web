'use client';
import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getPaymentsOverviewData } from "@/services/charts.services";
import { PaymentsOverviewChart } from "./chart";
// import { cookies } from "next/headers";
import axios from "axios";
import routes from "@/lib/network/routes";
import React, { useEffect } from "react";
import axiosExtended from "@/lib/network/axios-extended";
import { get } from "http";

type PropsType = {
  className?: string;
};

export function PaymentsOverview({
  className,
}: PropsType) {
  // const data = await getPaymentsOverviewData(timeFrame);
  const [timeFrame, setTimeFrame] = React.useState<string | undefined>('weekly');
  // const cookieStore = cookies();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<{ cards: { x: string; y: number }[]; crypto: { x: string; y: number }[] }>({
    cards: [],
    crypto: [],
  });

  useEffect(() => {
    getChartData('weekly');
  }, [])

  const getChartData = async (timeFrame: string) => {
    try {
      setLoading(true);
      const res = await axiosExtended.get(`${routes.home}/charts/overview?time_frame=${timeFrame}`);
      setLoading(false);
      if (res.status === 200) {
        let data = {
          cards: [] as { x: string; y: number }[],
          crypto: [] as { x: string; y: number }[],
        };
        data.cards = res.data.cards.map((item: any) => ({ x: item.x, y: parseInt(item.y) }));
        data.crypto = res.data.crypto.map((item: any) => ({ x: item.x, y: parseInt(item.y) }));
        setData(data)
      }
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };


  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Trades Overview
        </h2>

        <PeriodPicker items={["all", "weekly", "monthly", "3-months", "yearly"]} defaultValue={timeFrame} sectionKey="payments_overview"
          onChange={(val) => {
            getChartData(val);
            setTimeFrame(val);
          }}
        />
      </div>
      {
        loading ? <p>Loading...</p> : <PaymentsOverviewChart data={data} />
      }


      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
            {data.cards.reduce((acc, { y }) => acc + y, 0)}
          </dt>
          <dd className="font-medium dark:text-dark-6">Cards</dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            {data.crypto.reduce((acc, { y }) => acc + y, 0)}
          </dt>
          <dd className="font-medium dark:text-dark-6">Crypto</dd>
        </div>
      </dl>
    </div>
  );
}
