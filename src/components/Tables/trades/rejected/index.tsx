'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Image from "next/image";
import routes from "@/lib/network/routes";
import axiosExtended from "@/lib/network/axios-extended";
import { useEffect, useState } from "react";
import { Trade } from "@/models/trade";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/store/authSlice";

interface ListProps {
  className?: string;
  onClick?: (category: Trade) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
}

export function RejectedTradeList({ className, onClick, onLoadStart, onLoadEnd }: ListProps) {
  const {user} = useSelector(selectAuthState);
  const [trades, setTrades] = useState<Trade[]>([])
  const getTrades = async () => {
    onLoadStart && onLoadStart();
  const rejectedTradeListURL = `${process.env.NEXT_PUBLIC_API_URL}${routes.trade}/rejected/${user?.id}` || ''
    try {
      const res = await axiosExtended.get(rejectedTradeListURL);
      onLoadEnd && onLoadEnd();
      if (res.status === 200) {
        setTrades(res.data.data)
      }
    } catch (e) {
      onLoadEnd && onLoadEnd();
      console.error(e);
    }
  };

  useEffect(() => {
    getTrades();
  }, [])

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-4 flex flex-row justify-start items-center">
        <h2 className=" text-body-2xlg font-bold text-dark dark:text-white">
          Rejected Trades
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="">Trade ID</TableHead>
            <TableHead className="">Category</TableHead>
            <TableHead>Sub-Category</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white cursor-pointer"
              key={trade.id}
            >
              <TableCell>{trade.id}</TableCell>
              <TableCell className="flex min-w-fit items-center gap-3"
                onClick={() => {
                  onClick && onClick(trade)
                }}>
                <Image
                  src={{ src: trade.subCategory.category.photo.path, width: 40, height: 40 }}
                  className="size-8 rounded-full object-cover"
                  width={40}
                  height={40}
                  alt={trade.subCategory.category.name + " Logo"}
                  role="presentation"
                />
                <div className="">{trade.subCategory.category.name}</div>
              </TableCell>

              <TableCell>{trade.subCategory.name}</TableCell>

              <TableCell>{trade.amount}</TableCell>

              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
