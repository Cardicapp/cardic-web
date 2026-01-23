'use client'
import {
  Table,
  TableBody,
  TableCell,
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
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui-elements/button";

interface AllGiftCardsProps {
  className?: string;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onDisable?: (category: Category) => void;
  onAdd?: () => void;
  onChangeImage?: (category: Category) => void;
  onClick?: (category: Category) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
}

export function AllGiftCardsList({ className, onDelete, onEdit, onDisable, onAdd, onChangeImage, onClick, onLoadStart, onLoadEnd }: AllGiftCardsProps) {

  const [cards, setCards] = useState<Category[]>([])
  const getGiftCards = async () => {
    onLoadStart && onLoadStart();
    const categoryListURL = `${process.env.NEXT_PUBLIC_API_URL}${routes.categories}` || ''
    try {
      const res = await axiosExtended.get(categoryListURL);
      onLoadEnd && onLoadEnd();
      if (res.status === 200) {
        setCards(res.data.data)
      }
    } catch (e) {
      onLoadEnd && onLoadEnd();
      console.error(e);
    }
  };

  useEffect(() => {
    getGiftCards();
  }, [])

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-4 flex flex-row justify-between items-center">
        <h2 className=" text-body-2xlg font-bold text-dark dark:text-white">
          All Giftcards
        </h2>
        {
          onAdd && (
            <Button
              onClick={() => onAdd && onAdd()}
              className="self-end text-sm md:text-base  px-2 py-1"
              label="Add New" variant="green" shape="rounded"
              icon={
                <PlusIcon color="white" speed="animate-spin" />
              }
            />
          )
        }

      </div>

      <Table>

        <TableBody>
          {cards.map((card, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white cursor-pointer"
              key={card.name + i}
            >
              <TableCell className="flex min-w-fit items-center gap-3"
              onClick={() => {
                onClick && onClick(card)
              }}>
                <Image
                  src={{ src: card.photo.path, width: 40, height: 40 }}
                  className="size-8 rounded-full object-cover"
                  width={40}
                  height={40}
                  alt={card.name + " Logo"}
                  role="presentation"
                />
                <div className="">{card.name}</div>
              </TableCell>

              <TableCell></TableCell>

              <TableCell
              // className="!text-right text-green-light-1"
              >
              </TableCell>

              <TableCell> </TableCell>

              <TableCell>
                <EllipsisDropdown
                  // title=""
                  items={[
                    {
                      label: 'Edit', onClick: () => {
                        onEdit && onEdit(card)
                      }
                    },
                    {
                      label: 'Delete', onClick: () => {
                        onDelete && onDelete(card)
                      }
                    },
                    {
                      label: "Disable", onClick: () => {
                        onDisable && onDisable(card)
                      }
                    },
                    {
                      label: "Update Image", onClick: () => {
                        onChangeImage && onChangeImage(card)
                      }
                    }
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
