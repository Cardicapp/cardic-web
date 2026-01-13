import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from 'moment'
import { AdminRole, AdminRoleEnum } from "@/types/role"
import { Permission, PermissionModule } from "@/types/module"
import { deleteCookie, getCookie } from "cookies-next"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function compare<A>(a: A, b: A, key: string): number {
  // @ts-ignore
  if (a[key] < b[key]) {
    return -1
  }
  // @ts-ignore
  if (a[key] > b[key]) {
    return 1
  }
  return 0
}

export function compareByDate<A>(a: A, b: A, key: string): number {
  // @ts-ignore
  if (new Date(a[key]) < new Date(b[key])) {
    return -1
  }
  // @ts-ignore
  if (new Date(a[key]) > new Date(b[key])) {
    return 1
  }
  return 0
}
export function compareByDateB<A>(a: A, b: A, key: string): number {
  // @ts-ignore
  if (new Date(a[key]).getTime() < new Date(b[key]).getTime()) {
    return -1
  }
  // @ts-ignore
  if (new Date(a[key]).getTime() > new Date(b[key]).getTime()) {
    return 1
  }
  return 0
}
export function compareByMomentDate<A>(a: A, b: A, key: string): number {
  // @ts-ignore
  if (moment(new Date(b[key])).isAfter(moment(new Date(a[key])))) {
    return -1
  }
  // @ts-ignore
  if (moment(new Date(a[key])).isAfter(new Date(moment(b[key])))) {
    return 1
  }
  return 0
}

export function uniqueBy<A>(a: A[], key: (param: A) => string) {
  const index: any[] = []
  return a.filter((item: any) => {
    const k: string = key(item)
    return index.indexOf(k) >= 0 ? false : index.push(k)
  })
}

export const currencyFormat = (value: number, decimalPlaces: number = 2) => {
  if (value) {
    return (
      '' +
      value.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    );
  } else {
    return '0';
  }
};

export const shortenText = (text: string, length: number, postfix: string = '...') => {
  return text.length < length ? text : text.substring(0, length) + postfix;
}
export const checkHasPermission = (role: AdminRole, module: PermissionModule, allPermissions: Permission[]) => {
  if (role.id === AdminRoleEnum.superadmin) return true;
  if (!allPermissions || !allPermissions.length) return false;
  if (!role || !role.id) return false;
  const perms = allPermissions.filter(p => p.module.id === module.id && p.role?.id === role.id)
  if (perms.length) {
    return perms[0].isActive;
  } else return false;
}

export const validateEmail = (email: any) => {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const isNumber = (n: any) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const calculateRate = (a: number, b: number) => a * b;


export const getRedirect = (defaultRoute: string) => {
  const redirect = getCookie('redirect')
  if (redirect) {
    deleteCookie('redirect')
    return redirect.toString()
  }
  return defaultRoute
}