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
import { getTopChannels } from "../fetch";
import axios from "axios";
import routes from "@/lib/network/routes";
import { redirect } from 'next/navigation';
import { getPermissions } from "@/lib/serverProps";
import { Category } from "@/models/category";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/store/authSlice";
import axiosExtended from "@/lib/network/axios-extended";
import { useEffect, useState } from "react";
import EllipsisDropdown from "@/components/EllipsisDropdown";
import { ArrowLeft, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui-elements/button";
import { SubCategory } from "@/models/sub-category";
import { StatusEnum } from "@/types/enums";

interface SubCategoryListProps {
  className?: string;
  onEdit?: (category: SubCategory) => void;
  onDisable?: (category: SubCategory) => void;
  onAdd?: () => void;
  onBack?: () => void;
  onClick?: (category: SubCategory) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onEnable?: (category: SubCategory) => void;
  cardId: number;
}

export function SubCategoryList({ className, onEdit, onDisable, onAdd, onBack, onLoadStart, onLoadEnd, onEnable, onClick, cardId }: SubCategoryListProps) {

  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const getSubCategories = async () => {
    onLoadStart && onLoadStart();

    const subCategoryListURL = `${process.env.NEXT_PUBLIC_API_URL}${routes.allSubCategories}/${cardId}` || ''
    try {
      const res = await axiosExtended.get(subCategoryListURL);
      onLoadEnd && onLoadEnd();
      if (res.status === 200) {
        setSubcategories(res.data.data)
      }
    } catch (e) {
      onLoadEnd && onLoadEnd();
      console.error(e);
    }
  };

  useEffect(() => {
    getSubCategories();
  }, [])

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-4 flex flex-row justify-between">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Sub Categories
        </h2>
        <div>
          {/* <Button
            onClick={() => onBack && onBack()}
            className="self-end mr-2"
            label="Back" variant="outlineDark" shape="rounded"
            icon={
              <ArrowLeft color="black"  />
            }
          /> */}
          {
            onAdd && (
              <Button
                onClick={() => onAdd && onAdd()}
                className="self-end"
                label="Add New" variant="green" shape="rounded"
                icon={
                  <PlusIcon color="white" />
                }
              />
            )
          }
        </div>


      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left"></TableHead>
            <TableHead className="!text-right">Rate (NGN per USD)</TableHead>
            <TableHead>Min Amount ($)</TableHead>
            <TableHead>Max Amount ($)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>

          </TableRow>
        </TableHeader>

        <TableBody>
          {subcategories.map((sub, i) => {

            const isEnabled = sub.status.id === StatusEnum.active;
            return (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white"
                key={sub.name + i}
                onClick={() => {
                  onClick && onClick(sub)
                }}
              >
                <TableCell className="flex min-w-fit items-center gap-3">
                  <Image
                    src={{ src: sub.category.photo.path, width: 40, height: 40 }}
                    className="size-8 rounded-full object-cover"
                    width={40}
                    height={40}
                    alt={sub.name + " Logo"}
                    role="presentation"
                  />
                  <div className="">{sub.name}</div>
                </TableCell>

                <TableCell>{sub.nairaRate}</TableCell>

                <TableCell
                // className="!text-right text-green-light-1"
                > {sub.minAmount}
                </TableCell>

                <TableCell>{sub.maxAmount}</TableCell>
                <TableCell>{sub.status.name}</TableCell>
                <TableCell></TableCell>


                <TableCell>
                  <EllipsisDropdown
                    // title=""
                    items={[
                      {
                        label: 'Edit', onClick: () => {
                          onEdit && onEdit(sub)
                        }
                      },
                      {
                        label: isEnabled ? "Disable" : "Enable", onClick: () => {
                          if (isEnabled)
                            onDisable && onDisable(sub)
                          else
                            onEnable && onEnable(sub)
                        }
                      },
                    ]}
                  />
                  {/* <div className="mb-4 flex items-start justify-between"><h2 className="text-body-2xlg font-bold text-dark dark:text-white">Top Channels</h2><div className="relative"><button className="hover:text-primary" aria-expanded="false" aria-haspopup="menu" data-state="closed"><span className="sr-only">Open menu</span><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 10C3.10457 10 4 9.10457 4 8C4 6.89543 3.10457 6 2 6C0.89543 6 0 6.89543 0 8C0 9.10457 0.89543 10 2 10Z"></path><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"></path><path d="M14 10C15.1046 10 16 9.10457 16 8C16 6.89543 15.1046 6 14 6C12.8954 6 12 6.89543 12 8C12 9.10457 12.8954 10 14 10Z"></path></svg></button></div></div> */}
                </TableCell>
              </TableRow>
            );
          }
          )}
        </TableBody>
      </Table>
    </div>
  );
}
