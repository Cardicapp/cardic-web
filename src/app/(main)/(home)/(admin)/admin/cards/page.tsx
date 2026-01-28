'use client'
import { Suspense, SyntheticEvent, useEffect, useState } from "react";
import axiosExtended from "@/lib/network/axios-extended";
import routes from "@/lib/network/routes";
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
import { AllGiftCardsList } from "@/components/Tables/all-cards";
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
import { AllCardsSkeleton } from "@/components/Tables/all-cards/skeleton";
import { SubCategoryList } from "@/components/Tables/sub-categories";
import { SubCategory } from "@/models/sub-category";
import { ArrowLeft } from "lucide-react";

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



export default function GiftCards({ searchParams }: PropsType) {

  const { overview } = useSelector(selectAdminState);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateImageModalOpen, setIsUpdateImageModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  // Sub Start
  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false)
  const [isEditSubModalOpen, setIsEditSubModalOpen] = useState(false)
  const [showDisableSubModal, setShowDisableSubModal] = useState(false)
  const [showEnableSubModal, setShowEnableSubModal] = useState(false)
  // Sub End
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const { user } = useSelector(selectAuthState);
  const [currentTab, setCurrentTab] = useState('cards');
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    image: undefined,
    description: '',
  })

  const [addSubForm, setAddSubForm] = useState({
    name: '',
    nairaRate: '',
    minAmount: '',
    maxAmount: '',
    // amount: '',
  })

  const [editSubForm, setEditSubForm] = useState({
    id: 0,
    name: '',
    nairaRate: '',
    // amount: '',
    minAmount: '',
    maxAmount: '',
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
    image: '',
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

  const [rateValidation, setRateValidation] = useState({
    isValid: false,
    isValidated: false,
  })

  // const [amountValidation, setAmountValidation] = useState({
  //   isValid: false,
  //   isValidated: false,
  // })

  const [minAmountValidation, setMinAmountValidation] = useState({
    isValid: false,
    isValidated: false,
  })

  const [maxAmountValidation, setMaxAmountValidation] = useState({
    isValid: false,
    isValidated: false,
  })

  const [editRateValidation, setEditRateValidation] = useState({
    isValid: false,
    isValidated: false,
  })
  // const [editAmountValidation, setEditAmountValidation] = useState({
  //   isValid: false,
  //   isValidated: false,
  // })

  const [editMinAmountValidation, setEditMinAmountValidation] = useState({
    isValid: false,
    isValidated: false,
  })

  const [editMaxAmountValidation, setEditMaxAmountValidation] = useState({
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

  const validateCategory = () => {
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
    if (validateCategory()) {
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

  const validateEditCategory = () => {
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
  const [currentSub, setCurrentSub] = useState<SubCategory>();

  const {
    completedTradesCount,
    usersCount,
    rejectedTradesCount,
    newTradesCount
  } = overview;

  const fetchPermisions = async () => {
    const res = await axios.get('/api/permissions');
    if (res.status == 200)
      setPermissions(res.data)
  }

  // Sub Categories Start


  const validateSubCategory = () => {
    let isValid = true
    if (!addSubForm.name || addSubForm.name.length < 3) {
      setNameValidation({
        isValid: false,
        isValidated: true,
      })
      isValid = false
    }
    // if (!addSubForm.amount || parseInt(addSubForm.amount) < 1) {
    //   setAmountValidation({
    //     isValid: false,
    //     isValidated: true
    //   })
    // }
    if (!addSubForm.minAmount || parseInt(addSubForm.minAmount) < 1) {
      setMinAmountValidation({
        isValid: false,
        isValidated: true
      })
    }

    if (!addSubForm.maxAmount || parseInt(addSubForm.maxAmount) < 1) {
      setMaxAmountValidation({
        isValid: false,
        isValidated: true
      })
    }

    if (!addSubForm.nairaRate || parseInt(addSubForm.nairaRate) < 1) {
      setRateValidation({
        isValid: false,
        isValidated: true,
      })
      isValid = false
    }
    return isValid
  }

  const validateEdit = () => {
    let isValid = true
    if (!editSubForm.name || editSubForm.name.length < 3) {
      setEditNameValidation({
        isValid: false,
        isValidated: true,
      })
      isValid = false
    }
    // if (!editSubForm.amount || parseInt(editSubForm.amount) < 1) {
    //   setEditAmountValidation({
    //     isValid: false,
    //     isValidated: true
    //   })
    // }
    if (!editSubForm.minAmount || parseInt(editSubForm.minAmount) < 1) {
      setEditMinAmountValidation({
        isValid: false,
        isValidated: true
      })
    }
    if (!editSubForm.maxAmount || parseInt(editSubForm.maxAmount) < 1) {
      setEditMaxAmountValidation({
        isValid: false,
        isValidated: true
      })
    }
    if (!editSubForm.nairaRate || parseInt(editSubForm.nairaRate) < 1) {
      setEditRateValidation({
        isValid: false,
        isValidated: true,
      })
      isValid = false
    }
    return isValid
  }

  const addSubCategory = async (e: SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (validateSubCategory()) {
      setSubmitting(true)
      const payload = {
        name: addSubForm.name,
        nairaRate: parseInt(addSubForm.nairaRate),
        category: {
          id: currentCard?.id,
        },
        minAmount: parseInt(addSubForm.minAmount),
        maxAmount: parseInt(addSubForm.maxAmount)
      }
      try {
        const res = await axiosExtended.post(routes.subCategories, payload)
        console.log('Res', res)
        if (res.status === 201) {
          setIsAddModalOpen(false)
          setAddSubForm({
            name: '',
            nairaRate: '',
            minAmount: '',
            maxAmount: '',
          })
          location.reload()
        }
      } catch (e) {
        console.log(e)
      }

      setSubmitting(false)
    }
  }

  const enableSubcategory = async () => {
    try {
      setSubmitting(true)
      const payload = {
        ...currentSub,
        status: {
          id: StatusEnum.active,
        },
      }
      const res = await axiosExtended.patch(`${routes.subCategories}/${currentSub?.id}`, payload)
      if (res.status === 200) {
        setShowEnableSubModal(false)
        location.reload()
      }
      setSubmitting(false)
    } catch (e) {
      setShowEnableSubModal(false)
      console.log(JSON.stringify(e, null, 5))
    }
  }

  const disableSubcategory = async () => {
    try {
      setSubmitting(true)
      const payload = {
        ...currentSub,
        status: {
          id: StatusEnum.inactive,
        },
      }
      const res = await axiosExtended.patch(`${routes.subCategories}/${currentSub?.id}`, payload)
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

  const editSubCategory = async (e: SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (validateEdit()) {
      setSubmitting(true)
      const payload = {
        name: editSubForm.name,
        nairaRate: parseInt(editSubForm.nairaRate),
        category: {
          id: currentCard?.id,
        },
        minAmount: parseInt(editSubForm.minAmount),
        maxAmount: parseInt(editSubForm.maxAmount),
      }

      try {
        const res = await axiosExtended.patch(`${routes.subCategories}/${editSubForm.id}`, payload)
        if (res.status === 200) {
          setIsEditModalOpen(false)
          location.reload()
        }
      } catch (e) {
        console.log(e)
      }
      setSubmitting(false)
    }
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

  const updateCardEditForm = (c: Category) => {
    setEditForm({
      id: c.id,
      name: c.name,
      description: c.description,
      image: c.photo.fileName
    })
  }
    const updateSubEditForm = (s: SubCategory) => {
    setEditSubForm({
      name: s.name,
      id: s.id,
      maxAmount: s.maxAmount.toString(),
      minAmount: s.minAmount.toString(),
      nairaRate: s.nairaRate.toString(),
    })
  }
  const router = useRouter();
  if (!canRead && permissions.length) return router.replace("/error/unauthorized");
  return (
    <>
      <div className="">
        {
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
        }

        {
          currentTab == 'subcategories' ? <Breadcrumb pageName="Sub-Categories" /> : <Breadcrumb pageName="Cards" />

        }

        <GeneralOverview overviewData={overview} overviewTitle="Card Trades">
          <div className="flex flex-col md:flex-row gap-4">
            <OverviewOne
              title="Open Trades"
              containerClassName="flex-1"
              value={`${newTradesCount}`}
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
        <Suspense fallback={<AllCardsSkeleton />}>
          {
            currentTab == 'cards' ?
              <AllGiftCardsList
                onDelete={(card) => {
                  setCurrentCard(card)
                  setShowDeleteModal(true)
                }}
                onEdit={(card) => {
                  setCurrentCard(card)
                  updateCardEditForm(card)
                  setIsEditModalOpen(true)
                }}

                onDisable={(card) => {
                  setCurrentCard(card)
                  setShowDisableModal(true)
                }}
                onAdd={() => setIsAddModalOpen(true)}
                onChangeImage={(card) => {
                  setCurrentCard(card);
                  setIsUpdateImageModalOpen(true);
                }}
                onClick={(card) => {
                  setCurrentCard(card);
                  setCurrentTab('subcategories');
                }}
                onLoadStart={() => setShowLoadingModal(true)}
                onLoadEnd={() => setShowLoadingModal(false)}
              /> : undefined
          }
          {
            currentTab == 'subcategories' ?
              <SubCategoryList
                cardId={currentCard?.id || 0}
                onEnable={(sub) => {
                  setCurrentSub(sub)
                  setShowEnableSubModal(true)
                }}
                onEdit={(sub) => {
                  setCurrentSub(sub)
                  updateSubEditForm(sub)
                  setIsEditSubModalOpen(true)
                }}
                onBack={() => {
                  setCurrentTab("cards")
                }}
                onDisable={(sub) => {
                  setCurrentSub(sub)
                  setShowDisableSubModal(true)
                }}
                onAdd={() => setIsAddSubModalOpen(true)}
                onLoadStart={() => setShowLoadingModal(true)}
                onLoadEnd={() => setShowLoadingModal(false)}
              /> : undefined
          }
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
              submitting ? <IconSpinner color="text-white-500" speed="animate-spin" /> : undefined
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
            image: '',
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
            placeholder="Amazon Gift Card"
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
            placeholder=""
            type="text"
            className="w-full text-left mt-4"
            defaultValue={currentCard?.description}
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
              submitting ? <IconSpinner color="text-white-500" speed="animate-spin" /> : undefined
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
              submitting ? <IconSpinner color="text-white-500" speed="animate-spin" /> : undefined
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

      {/* Sub Categories Start */}
      <CustomModal
        onClose={() => {
          setIsAddSubModalOpen(false)
          setAddSubForm({
            name: '',
            maxAmount: '',
            minAmount: '',
            nairaRate: ''
          })
        }}
        isOpen={isAddSubModalOpen}>
        <form
          className="flex flex-col items-start">
          <h3 className="pb-4 text-xl font-bold text-dark dark:text-white sm:text-2xl">Add Sub Category</h3>
          <InputGroup
            required
            label="Name"
            placeholder="eg. Apple Itunes (0$ - 100$)"
            type="text"
            className="w-full text-left mt-4"
            handleChange={(e) => setAddSubForm({ ...addSubForm, name: e.target.value })}
          />
          <div className="mt-2" />
          <InputGroup
            required
            label="Minimum Amount"
            placeholder="0$ - 100$"
            type="number"
            className="w-full text-left mt-4"
            handleChange={(e) => setAddSubForm({ ...addSubForm, minAmount: e.target.value })}
          />
          <div className="mt-2" />
          <InputGroup
            required
            label="Maximum Amount"
            placeholder="0$ - 100$"
            type="number"
            className="w-full text-left mt-4"
            handleChange={(e) => setAddSubForm({ ...addSubForm, maxAmount: e.target.value })}
          />
          <div className="mt-2" />
          <InputGroup
            required
            label="Naira Per USD"
            placeholder="0$ - 100$"
            type="number"
            className="w-full text-left mt-4"
            handleChange={(e) => setAddSubForm({ ...addSubForm, nairaRate: e.target.value })}
          />
          <div className="mt-4" />
          <Button className="self-end w" label="Save" variant="green" shape="rounded"
            icon={
              submitting ? <IconSpinner color="text-white-500" speed="animate-spin" /> : undefined
            }
            onClick={addSubCategory}
          />

        </form>
      </CustomModal>

      <CustomModal
        onClose={() => {
          setIsEditSubModalOpen(false)
          setEditSubForm({
            id: 0,
            maxAmount: '',
            minAmount: '',
            nairaRate: '',
            name: '',
          })
        }}
        isOpen={isEditSubModalOpen}>
        <div
          className="flex flex-col items-start">
          <h3 className="pb-4 text-xl font-bold text-dark dark:text-white sm:text-2xl">Edit Card</h3>
          <InputGroup
            required
            label="Name"
            placeholder="eg. Apple Itunes (0$ - 100$)"
            type="text"
            className="w-full text-left mt-4"
            value={editSubForm.name}
            handleChange={(e) => setEditSubForm({ ...editSubForm, name: e.target.value })}
          />
          <div className="mt-2" />
          <InputGroup
            required
            label="Minimum Amount"
            placeholder="0$ - 100$"
            type="number"
            className="w-full text-left mt-4"
            value={editSubForm.minAmount}
            handleChange={(e) => setEditSubForm({ ...editSubForm, minAmount: e.target.value })}
          />
          <div className="mt-2" />
          <InputGroup
            required
            label="Maximum Amount"
            placeholder="0$ - 100$"
            type="number"
            className="w-full text-left mt-4"
            value={editSubForm.maxAmount}
            handleChange={(e) => setEditSubForm({ ...editSubForm, maxAmount: e.target.value })}
          />
          <div className="mt-2" />
          <InputGroup
            required
            label="Naira Per USD"
            placeholder="0$ - 100$"
            type="number"
            className="w-full text-left mt-4"
            value={editSubForm.nairaRate}
            handleChange={(e) => setEditSubForm({ ...editSubForm, nairaRate: e.target.value })}
          />
          <div className="mt-4" />
          <Button
            onClick={editSubCategory}
            className="self-end"
            label="Save" variant="green" shape="rounded"
            icon={
              submitting ? <IconSpinner color="text-white-500" speed="animate-spin" /> : undefined
            }
          />

        </div>
      </CustomModal>

      <ConfirmationModal
        isOpen={showEnableSubModal}
        title={"Enable Sub Category"}
        message={"Are you sure you want to enable sub-category?"}
        onConfirm={enableSubcategory}
        onCancel={() => {
          setShowEnableSubModal(false)
        }}
        isDangerous
      />

      <ConfirmationModal
        isOpen={showDisableSubModal}
        title={"Disable Sub Category"}
        message={"Are you sure you want to disable sub-category?"}
        onConfirm={disableSubcategory}
        onCancel={() => {
          setShowDisableSubModal(false)
        }}
      />
      {/* Sub Catogeries End */}

      <LoadingModal
        isOpen={showLoadingModal}
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


// TODO: Add prembly redirect url page
// URL: https://cardicapp.com/document-verification-complete