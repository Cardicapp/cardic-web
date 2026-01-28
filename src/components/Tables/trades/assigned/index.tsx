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
import EllipsisDropdown from "@/components/EllipsisDropdown";

interface ListProps {
  className?: string;
  onClick?: (trade: Trade) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onChat?: (trade: Trade) => void;
}

export function AssignedTradeList({ className, onClick, onLoadStart, onLoadEnd, onChat }: ListProps) {
  const { user } = useSelector(selectAuthState);
  const [trades, setTrades] = useState<Trade[]>([])
  const getTrades = async () => {
    onLoadStart && onLoadStart();
    const assignedTradeListURL = `${process.env.NEXT_PUBLIC_API_URL}${routes.assignedTrades}/${user?.id}` || ''
    try {
      const res = await axiosExtended.get(assignedTradeListURL);
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
          Assigned Trades
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
              <TableCell>
                <EllipsisDropdown
                  // title=""
                  items={[
                    {
                      label: 'Open Chat', onClick: () => {
                        onChat && onChat(trade)
                      }
                    },
                    {
                      label: 'View Details', onClick: () => {
                        onClick && onClick(trade)
                      }
                    },
                  ]}
                />
                {/* <div className="mb-4 flex items-start justify-between"><h2 className="text-body-2xlg font-bold text-dark dark:text-white">Top Channels</h2><div className="relative"><button className="hover:text-primary" aria-expanded="false" aria-haspopup="menu" data-state="closed"><span className="sr-only">Open menu</span><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 10C3.10457 10 4 9.10457 4 8C4 6.89543 3.10457 6 2 6C0.89543 6 0 6.89543 0 8C0 9.10457 0.89543 10 2 10Z"></path><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"></path><path d="M14 10C15.1046 10 16 9.10457 16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10Z"></path></svg></button></div></div> */}
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
