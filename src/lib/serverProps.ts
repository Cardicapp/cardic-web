import client from '@/lib/redis'
// import { PermissionModuleEnum } from 'src/types/module';
// import { checkHasPermission as checkHasPermission } from './utils';
// import * as redis from "redis";

export const getPermissions = async () => {
    if (!client.isOpen)
        await client.connect();
    const permissions = await client.get('permissions');
    return JSON.parse(permissions ?? "[]");
}

export const redirectResponse = (path: string) => ({
    redirect: {
      permanent: false,
      destination: path,
    },
    props:{},
  });

export async function getDefaulServerSideProps() {
    const permissions = await getPermissions()
    return {
        // data
        props: { allPermissions: permissions }
    };
}

export async function getGeneralServerSideProps() {    
    return {
        // data
        allPermissions: await getPermissions()
    };
}