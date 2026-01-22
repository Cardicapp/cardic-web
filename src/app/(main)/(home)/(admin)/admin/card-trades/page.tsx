'use client'
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense, SyntheticEvent, useEffect, useState } from "react";
import { ChatsCard } from "../../../_components/chats-card";
import { OverviewCardsGroup } from "../../../_components/overview-cards";
import { OverviewCardsSkeleton } from "../../../_components/overview-cards/skeleton";
import { RegionLabels } from "../../../_components/region-labels";
import axiosExtended from "@/lib/network/axios-extended";
import routes from "@/lib/network/routes";
import { AdminRoleEnum } from "@/types/role";
import { checkHasPermission, currencyFormat } from "@/lib/utils";
import { Permission, PermissionFeatureEnum, PermissionModuleEnum, PermissionSubModuleEnum } from "@/types/module";
import axios from "axios";
import { OverviewOne } from "../../../_components/overview-cards/overview-one";
import { DollarSign, StarIcon } from "../../../_components/overview-cards/icons";
import styles from './page.module.css';
import { PeriodPicker } from "@/components/period-picker";
import { GeneralOverview } from "./components/general-overview";
import { compactFormat } from "@/lib/format-number";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useSelector } from "react-redux";
import { selectAdminState } from "@/store/adminSlice";
import { AllGiftCards } from "@/components/Tables/all-cards";
import CustomModal from "@/components/Modal/CustomModal";
import InputGroup from "@/components/FormElements/InputGroup";
import { Button } from "@/components/ui-elements/button";
import { Category } from "@/models/category";
import Spinner from "@/components/Spinner";
import IconSpinner from "@/components/Spinner";
import { selectAuthState } from "@/store/authSlice";
import { CategoryTypeEnum, StatusEnum } from "@/types/enums";
import { getPermissions } from "@/lib/serverProps";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/ConfirmationModal/ConfirmationModal";
import LoadingModal from "@/components/Modal/LoadingModal";
import { InfoModal } from "@/components/InfoModal/InfoModal";

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



export default function Giftcards({ searchParams }: PropsType) {

  const { overview } = useSelector(selectAdminState);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateImageModalOpen, setIsUpdateImageModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const { user } = useSelector(selectAuthState);
  const [loading, setLoading] = useState(false);

  const [addForm, setAddForm] = useState({
    name: '',
    image: undefined,
    description: '',
  })

  const [updateImageForm, setUpdateImageForm] = useState<{
    id: number;
    image: File | undefined;
  }>({
    id: 0,
    image: undefined
  })
  const [editForm, setEditForm] = useState({
    id: 0,
    name: '',
    image: undefined,
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [nameValidation, setNameValidation] = useState({
    isValid: false,
    isValidated: false,
  })
  const [imageValidation, setImageValidation] = useState({
    isValid: false,
    isValidated: false,
  })

  const [editNameValidation, setEditNameValidation] = useState({
    isValid: false,
    isValidated: false,
  })
  const [editImageValidation, setEditImageValidation] = useState({
    isValid: false,
    isValidated: false,
  })


  const createFormData = () => {
    const data = new FormData()

    if (addForm?.image) {
      data.append('photo', addForm?.image)
    }
    data.append('name', addForm.name)
    data.append('description', addForm.description)
    data.append('type', CategoryTypeEnum.card.toString())
    return data
  }

  const createUpdateImageFormData = () => {
    const data = new FormData()

    if (updateImageForm?.image) {
      data.append('photo', updateImageForm?.image)
    }
    return data;
  }

  const createEditFormData = () => {
    const data = new FormData()

    if (editForm?.image) {
      data.append('photo', editForm?.image)
    }
    data.append('name', editForm.name)
    data.append('type', CategoryTypeEnum.card.toString())
    data.append('description', editForm.description)
    return data
  }

  const validate = () => {
    let isValid = true
    if (!addForm.name || addForm.name.length < 3) {
      setNameValidation({
        isValid: false,
        isValidated: true,
      })
      isValid = false
    }
    if (!addForm.image) {
      setImageValidation({
        isValid: false,
        isValidated: true,
      })
      isValid = false
    }
    return isValid
  }

  const addCategory = async (e: SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (validate()) {
      setSubmitting(true)
      const payload = createFormData()
      const res = await axiosExtended.post(routes.categories, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.status === 201) {
        setIsAddModalOpen(false)
        location.reload()
      }
      setSubmitting(false)
    }
  }

  const proceedUpdateImage = async (e: SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (validateUploadImage()) {
      setSubmitting(true)
      const payload = createUpdateImageFormData()
      const res = await axiosExtended.post(`${routes.categories}/image/${updateImageForm.id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.status === 200) {
        setIsUpdateImageModalOpen(false)
        location.reload()
      }
      setSubmitting(false)
    }
  }

  const validateUploadImage = () => {
    let isValid = true;
    if (!updateImageForm.image) {
      setImageValidation({
        isValid: false,
        isValidated: true,
      })
      isValid = false
    }
    return isValid
  }

  const validateEdit = () => {
    let isValid = true
    if (!editForm.name || editForm.name.length < 3) {
      setNameValidation({
        isValid: false,
        isValidated: true,
      })
      isValid = false
    }
    if (!editForm.image) {
      setImageValidation({
        isValid: false,
        isValidated: true,
      })
      isValid = false
    }
    return isValid
  }

  const editCategory = async (e: SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (validateEdit()) {
      setSubmitting(true)
      const payload = createEditFormData()
      const res = await axiosExtended.patch(`${routes.categories}/${editForm.id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.status === 200) {
        setIsEditModalOpen(false)
        location.reload()
      }
      setSubmitting(false)
    }
  }

  const disableCategory = async () => {
    try {
      setSubmitting(true)
      const payload = {
        ...currentCard,
        status: {
          id: StatusEnum.inactive,
        },
      }
      const res = await axiosExtended.patch(`${routes.categories}/${currentCard?.id}`, payload)
      if (res.status === 200) {
        setShowDisableModal(false)
        location.reload()
      }
      setSubmitting(false)
    } catch (e) {
      setShowDisableModal(false)
      console.log(JSON.stringify(e, null, 5))
    }
  }

  const deleteCategory = async () => {
    try {
      setSubmitting(true)
      const res = await axiosExtended.delete(`${routes.categories}/${currentCard?.id}`)
      if (res.status === 200) {
        setShowDeleteModal(false)
        location.reload()
      }
      setSubmitting(false)
    } catch (e) {
      setShowDeleteModal(false)
      console.log(JSON.stringify(e, null, 5))
    }
  }
  const [currentCard, setCurrentCard] = useState<Category>();
  const {
    completedTradesCount,
    usersCount,
    rejectedTradesCount,
  } = overview;

  const fetchPermisions = async () => {
    const res = await axios.get('/api/permissions');
    if (res.status == 200)
      setPermissions(res.data)
  }

  useEffect(() => {
    fetchPermisions();
  }, []);
  // @ts-ignore
  const canRead = permissions.length ? checkHasPermission({ id: user?.adminRole?.id }, { id: PermissionFeatureEnum.readCategories }, permissions) : false;
  // @ts-ignore
  const canWrite = permissions.length ? checkHasPermission({ id: user?.adminRole?.id }, { id: PermissionFeatureEnum.writeCategories }, permissions) : false;
  // @ts-ignore
  const canDelete = permissions.length ? checkHasPermission({ id: user?.adminRole?.id }, { id: PermissionFeatureEnum.deleteCategories }, permissions) : false;

  const router = useRouter();
  if (!canRead && permissions.length) return router.replace("/error/unauthorized");
  return (
    <>
      <div className="">
        <Breadcrumb pageName="Cards" />
        <GeneralOverview overviewData={overview} overviewTitle="Card Trades">
          <div className="flex flex-col md:flex-row gap-4">
            <OverviewOne
              title="Open Trades"
              containerClassName="flex-1"
              value={`${usersCount}`}
              icon={<StarIcon className={styles.icon} />}
            />
            <OverviewOne
              title="Completed Trades"
              containerClassName="flex-1"
              value={`${completedTradesCount}`}
              icon={<StarIcon className={styles.icon} />}
            />
            <OverviewOne
              title="Rejected Trades"
              containerClassName="flex-1"
              value={`${rejectedTradesCount || 0}`}
              icon={<StarIcon className={styles.icon} />}
            />
          </div>
        </GeneralOverview>
      </div>

      <div className="mt- md:mt-6 2xl:mt-9" />

      <div className="col-span-12 grid xl:col-span-8">
        <Suspense fallback={<TopChannelsSkeleton />}>
          <AllGiftCards
            onDelete={(card) => {
              setCurrentCard(card)
              setShowDeleteModal(true)
            }}
            onEdit={(card) => {
              setCurrentCard(card)
              setIsEditModalOpen(true)
            }}

            onDisable={(card) => {
              setCurrentCard(card)
              setShowDisableModal(true)
            }}

            onAdd={() => setIsAddModalOpen(true)}
          />
        </Suspense>
      </div>
      <CustomModal
        onClose={() => setIsAddModalOpen(false)}
        isOpen={isAddModalOpen}>
        <div
          className="flex flex-col items-start">
          <h3 className="pb-4 text-xl font-bold text-dark dark:text-white sm:text-2xl">Add Card</h3>
          <InputGroup
            label="Card Name"
            placeholder="eg. Apple Itunes"
            type="text"
            className="w-full text-left mt-4"
            handleChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
          />
          <div className="mt-2" />
          <InputGroup
            label="Image"
            className="w-full text-left"
            type="file"
            fileStyleVariant="style1"
            placeholder="Attach file"
          />
          <div className="mt-4" />
          <Button className="self-end" label="Save" variant="green" shape="rounded"
            icon={
              submitting ? <IconSpinner color="text-white-500" speed="animate-spin" /> : <div />
            }
            onClick={addCategory}
          />

        </div>
      </CustomModal>

      <CustomModal
        onClose={() => {
          setIsEditModalOpen(false)
          setEditForm({
            name: '',
            image: undefined,
            id: 0,
            description: '',
          })
        }}
        isOpen={isEditModalOpen}>
        <div
          className="flex flex-col items-start">
          <h3 className="pb-4 text-xl font-bold text-dark dark:text-white sm:text-2xl">Edit Card</h3>
          <InputGroup
            label="Card Name"
            placeholder="What is the card name?"
            type="text"
            className="w-full text-left mt-4"
            defaultValue={currentCard?.name}
            handleChange={(e) => {
              setEditForm({ ...editForm, name: e.target.value })
            }}
          />
          <div className="mt-2" />
          <InputGroup
            label="Description"
            placeholder="What is the card name?"
            type="text"
            className="w-full text-left mt-4"
            defaultValue={currentCard?.name}
            handleChange={(e) => {
              setEditForm({ ...editForm, description: e.target.value })
            }}
          />
          <div className="mt-4" />
          <Button
            onClick={editCategory}
            className="self-end"
            label="Save" variant="green" shape="rounded"
            icon={
              submitting ? <IconSpinner color="text-white-500" speed="animate-spin" /> : <div />
            }
          />

        </div>
      </CustomModal>

      <CustomModal
        onClose={() => {
          setIsUpdateImageModalOpen(false)
        }}
        isOpen={isUpdateImageModalOpen}>
        <div
          className="flex flex-col items-start">
          <h3 className="pb-4 text-xl font-bold text-dark dark:text-white sm:text-2xl">Change Image</h3>
          <div className="mt-2" />
          <InputGroup
            label="Change Image"
            className="w-full text-left"
            type="file"
            fileStyleVariant="style1"
            placeholder="Attach file"
            handleChange={(e) => {
              const file = e.target.files ? e.target.files[0] : undefined
              setUpdateImageForm({
                ...updateImageForm,
                image: file
              });
            }}
          />
          <div className="mt-4" />
          <Button
            onClick={proceedUpdateImage}
            className="self-end"
            label="Save" variant="green" shape="rounded"
            icon={
              submitting ? <IconSpinner color="text-white-500" speed="animate-spin" /> : <div />
            }
          />

        </div>
      </CustomModal>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title={"Delete Card"}
        message={"Are you sure you want to delete card?"}
        onConfirm={() => {

        }}
        onCancel={() => {
          setShowDeleteModal(false)
        }}
        isDangerous
      />

      <ConfirmationModal
        isOpen={showDisableModal}
        title={"Disable Card"}
        message={"Are you sure you want to disable card?"}
        onConfirm={() => {

        }}
        onCancel={() => {
          setShowDisableModal(false)
        }}
      />

      <LoadingModal
        isOpen={false}
      />
      <InfoModal
        isOpen={false}
        title={"Congratulations!"}
        message={"You have successfully added a new card"}
        onConfirm={() => {
          location.reload();
        }}
      />

      <InfoModal
        isOpen={false}
        title={"Congratulations!"}
        message={"Card updated successfully"}
        onConfirm={() => {
          location.reload();
        }}
      />
      <InfoModal
        isOpen={false}
        title={"Congratulations!"}
        message={"Card deleted successfully"}
        onConfirm={() => {
          location.reload();
        }}
      />
    </>
  );
}
